import { create } from "zustand";
import axios from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      set({ user: userData, token, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "An error occurred during login", 
        isLoading: false 
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/register", userData);
      const { token, ...newUserData } = response.data;
      localStorage.setItem("token", token);
      set({ user: newUserData, token, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "An error occurred during registration", 
        isLoading: false 
      });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put("/auth/profile", profileData);
      set({ user: response.data, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "An error occurred during profile update", 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get("/auth/me");
      set({ user: response.data, isLoading: false });
    } catch (_err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
