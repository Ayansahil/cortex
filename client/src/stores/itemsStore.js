import { create } from "zustand";
import * as itemsApi from "../api/items.api";

export const useItemsStore = create((set) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchItems: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await itemsApi.getItems(params);
      set({ items: data.items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  saveItem: async (itemData) => {
    set({ isLoading: true });
    try {
      const newItem = await itemsApi.saveItem(itemData);
      set((state) => ({ 
        items: [newItem, ...state.items],
        isLoading: false 
      }));
      return newItem;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  deleteItem: async (id) => {
    try {
      await itemsApi.deleteItem(id);
      set((state) => ({ 
        items: state.items.filter((item) => item._id !== id) 
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
