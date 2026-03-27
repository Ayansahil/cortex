const API_URL = "https://cortex-u1lk.onrender.com/v1";
const APP_URL = "https://cortex-kappa-beige.vercel.app";

let selectedType = "article";
let currentTab = null;

const detectType = (url) => {
  if (!url) return "article";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "video";
  if (u.includes("twitter.com") || u.includes("x.com")) return "tweet";
  if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(u)) return "image";
  if (u.includes(".pdf")) return "pdf";
  return "article";
};

const setActiveType = (type) => {
  selectedType = type;
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });
};

const showStatus = (msg, isError = false) => {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.className = `status ${isError ? "error" : "success"}`;
  el.style.display = "block";
  if (!isError) setTimeout(() => (el.style.display = "none"), 3000);
};

const showSaveScreen = (user) => {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("saveScreen").style.display = "block";
  document.getElementById("userBadge").textContent = user?.name || user?.email || "User";
};

const showLoginScreen = () => {
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("saveScreen").style.display = "none";
};

document.addEventListener("DOMContentLoaded", async () => {
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  document.getElementById("pageTitle").textContent = tab.title || "Untitled";
  document.getElementById("pageUrl").textContent = tab.url || "";
  setActiveType(detectType(tab.url));

  // Check if already logged in
  chrome.storage.local.get(["cortex_token", "cortex_user"], ({ cortex_token, cortex_user }) => {
    if (cortex_token) {
      showSaveScreen(cortex_user);
    } else {
      showLoginScreen();
    }
  });

  // LOGIN
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    const btn = document.getElementById("loginBtn");
    const errEl = document.getElementById("loginError");

    if (!email || !password) {
      errEl.textContent = "Please enter email and password";
      errEl.style.display = "block";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Logging in...";
    errEl.style.display = "none";

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and user info
      const token = data.data?.token || data.token;
      const user = data.data?.user || data.user;

      chrome.storage.local.set({ cortex_token: token, cortex_user: user }, () => {
        showSaveScreen(user);
      });

    } catch (err) {
      errEl.textContent = err.message || "Invalid email or password";
      errEl.style.display = "block";
      btn.disabled = false;
      btn.textContent = "Login to Cortex";
    }
  });

  // Allow Enter key on password field
  document.getElementById("passwordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("loginBtn").click();
  });

  // TYPE BUTTONS
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => setActiveType(btn.dataset.type));
  });

  // SAVE ITEM
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const btn = document.getElementById("saveBtn");
    btn.disabled = true;
    btn.innerHTML = "Saving...";

    chrome.storage.local.get("cortex_token", async ({ cortex_token }) => {
      if (!cortex_token) {
        showLoginScreen();
        return;
      }

      try {
        const res = await fetch(`${API_URL}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cortex_token}`,
          },
          body: JSON.stringify({
            title: currentTab.title,
            url: currentTab.url,
            type: selectedType,
          }),
        });

        // Token expired — logout
        if (res.status === 401) {
          chrome.storage.local.remove(["cortex_token", "cortex_user"]);
          showLoginScreen();
          return;
        }

        if (!res.ok) throw new Error("Failed to save");

        showStatus("Saved to Cortex ✓");
      } catch (err) {
        showStatus("Failed to save. Try again.", true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = "<span>＋</span> Save to Cortex";
      }
    });
  });

  // OPEN APP
  document.getElementById("openApp").addEventListener("click", () => {
    chrome.tabs.create({ url: APP_URL });
  });

  // LOGOUT
  document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.storage.local.remove(["cortex_token", "cortex_user"], () => {
      showLoginScreen();
      document.getElementById("emailInput").value = "";
      document.getElementById("passwordInput").value = "";
    });
  });
});