import { create } from "zustand";

const getInitialUser = () => {
  try {
    const user = localStorage.getItem("cortex_user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("cortex_user");
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem("cortex_token") || null,
  
  login: (userData, token) => {
    localStorage.setItem("cortex_token", token);
    localStorage.setItem("cortex_user", JSON.stringify(userData));
    set({ user: userData, token });
  },
  
  logout: () => {
    localStorage.removeItem("cortex_token");
    localStorage.removeItem("cortex_user");
    set({ user: null, token: null });
  },
}));
