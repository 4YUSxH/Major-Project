import { create } from "zustand";
import axios from "../utils/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isCheckingAuth: true,
  isLoading: false,
  error: null,
  successMessage: null,

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
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await axios.post("/auth/register", userData);
      set({ isLoading: false, successMessage: response.data.message });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "An error occurred during registration", 
        isLoading: false 
      });
      return false;
    }
  },

  verifyEmail: async (token) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const response = await axios.get(`/auth/verify-email/${token}`);
      set({ isLoading: false, successMessage: response.data.message });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "An error occurred during verification", 
        isLoading: false 
      });
      return false;
    }
  },
  
  clearMessages: () => set({ error: null, successMessage: null }),

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
    if (!token) {
      set({ isCheckingAuth: false });
      return;
    }

    try {
      const response = await axios.get("/auth/me");
      set({ user: response.data, isCheckingAuth: false });
    } catch (_err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isCheckingAuth: false });
    }
  }
}));
