import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Library, 
  Search, 
  Layers, 
  Share2, 
  Highlighter, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { cn } from "../utils/cn";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Library, label: "Library", path: "/library" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Layers, label: "Collections", path: "/collections" },
  { icon: Share2, label: "Graph", path: "/graph" },
  { icon: Highlighter, label: "Highlights", path: "/highlights" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
    <aside 
      className={cn(
        "hidden md:flex h-screen glass border-r border-white/5 flex-col transition-all duration-300 sticky top-0 z-50",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center shrink-0">
          <BrainCircuit className="text-white scale-110" />
        </div>
        {sidebarOpen && (
          <span className="text-xl font-bold font-heading tracking-tight text-white italic">Cortex</span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              isActive 
                ? "bg-indigo/10 text-indigo shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-active:scale-90", isActive && "text-indigo")} />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {!sidebarOpen && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl mb-2",
          sidebarOpen ? "justify-start" : "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo to-indigo-light shrink-0" />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || "The Curator"}</p>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Premium Access</p>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all group",
            !sidebarOpen && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>

    {/* Mobile Bottom Nav */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-50 flex items-center justify-around px-1 py-2 bg-obsidian/95 pb-safe backdrop-blur-xl">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 flex-1 min-w-0 px-0.5",
            isActive ? "text-indigo bg-indigo/5" : "text-gray-500 hover:text-white"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("w-5 h-5 mb-1 shrink-0 transition-transform", isActive && "scale-110")} />
              <span className="text-[8px] font-medium tracking-tight truncate w-full text-center">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
    </>
  );
};

export default Navbar;
