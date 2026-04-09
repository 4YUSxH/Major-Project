import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/announcements';

export const useAnnouncementStore = create((set, get) => ({
  announcements: [],
  isLoading: false,

  fetchAnnouncements: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ announcements: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      set({ isLoading: false });
    }
  },

  createAnnouncement: async (formDataObj) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(API_URL, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Let browser set content-type for multipart automatically
          'Content-Type': 'multipart/form-data',
        }
      });
      
      set({ 
        announcements: [response.data, ...get().announcements],
        isLoading: false 
      });
      return true;
    } catch (error) {
      console.error('Failed to create announcement', error);
      set({ isLoading: false });
      return false;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      set({ 
        announcements: get().announcements.filter(a => a._id !== id) 
      });
    } catch (error) {
      console.error('Failed to delete announcement', error);
    }
  }
}));
