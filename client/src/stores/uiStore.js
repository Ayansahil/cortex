import { create } from "zustand";

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeFilters: {
    type: null,
    tags: [],
    dateRange: null,
    collection: null,
  },
  searchQuery: "",
  searchCount: 0,
  
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setFilters: (filters) => set((state) => ({ 
    activeFilters: { ...state.activeFilters, ...filters } 
  })),
  
  resetFilters: () => set({ 
    activeFilters: { type: null, tags: [], dateRange: null, collection: null } 
  }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  incrementSearchCount: () => set((state) => ({ searchCount: state.searchCount + 1 })),
}));
