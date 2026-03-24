import { create } from "zustand";
import * as collectionsApi from "../api/collections.api";
import * as hApi from "../api/search-highlights.api";

export const useCollectionsStore = create((set) => ({
  collections: [],
  isLoading: false,
  
  fetchCollections: async () => {
    set({ isLoading: true });
    try {
      const data = await collectionsApi.getCollections();
      set({ collections: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  createCollection: async (data) => {
    const newCol = await collectionsApi.createCollection(data);
    set((state) => ({ collections: [...state.collections, newCol] }));
    return newCol;
  },
  
  updateCollection: async (id, data) => {
    const updatedCol = await collectionsApi.updateCollection(id, data);
    set((state) => ({
      collections: state.collections.map((c) => (c.id === id || c._id === id ? updatedCol : c)),
    }));
    return updatedCol;
  },
  
  deleteCollection: async (id) => {
    await collectionsApi.deleteCollection(id);
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id && c._id !== id),
    }));
  },
  
  addItemToCollection: async (collectionId, itemId) => {
    await collectionsApi.addItemToCollection(collectionId, itemId);
    // Refetch to update item counts
    const data = await collectionsApi.getCollections();
    set({ collections: data });
  },
}));

export const useHighlightsStore = create((set) => ({
  highlights: [],
  isLoading: false,
  
  fetchHighlights: async () => {
    set({ isLoading: true });
    try {
      const data = await hApi.getHighlights();
      set({ highlights: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  createHighlight: async (data) => {
    const newHighlight = await hApi.createHighlight(data);
    set((state) => ({ highlights: [newHighlight, ...state.highlights] }));
    return newHighlight;
  },
}));
