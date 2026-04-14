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
  },

  deleteArticle: async (id) => {
    try {
      await axios.delete(`/kb/${id}`);
      set((state) => ({ articles: state.articles.filter((a) => a._id !== id) }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateArticle: async (id, articleData) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.put(`/kb/${id}`, articleData);
      set((state) => ({
        articles: state.articles.map((a) => a._id === id ? data : a),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));
