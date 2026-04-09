import { create } from "zustand";
import axios from "../utils/axios";

export const useKbStore = create((set) => ({
  articles: [],
  isLoading: false,
  error: null,

  fetchArticles: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("/kb");
      set({ articles: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createArticle: async (articleData) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post("/kb", articleData);
      set((state) => ({ articles: [data, ...state.articles], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));
