import { create } from "zustand";
import axios from "../utils/axios";

export const useTicketStore = create((set) => ({
  tickets: [],
  currentTicket: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchTickets: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("/tickets");
      set({ tickets: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTicket: async (id) => {
    set({ isLoading: true });
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        axios.get(`/tickets/${id}`),
        axios.get(`/tickets/${id}/messages`)
      ]);
      set({ currentTicket: ticketRes.data, messages: messagesRes.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTicket: async (ticketData) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post("/tickets", ticketData);
      set((state) => ({ tickets: [data, ...state.tickets], isLoading: false }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      const { data } = await axios.put(`/tickets/${id}`, { status });
      set((state) => ({
        currentTicket: state.currentTicket?._id === id ? data : state.currentTicket,
        tickets: state.tickets.map(t => t._id === id ? data : t)
      }));
    } catch (error) {
      console.error(error);
    }
  },

  addMessage: async (id, message) => {
    try {
      const { data } = await axios.post(`/tickets/${id}/messages`, { message });
      // We rely on socket for real-time, but optimistic update is good
      set((state) => ({ messages: [...state.messages, data] }));
    } catch (error) {
      console.error(error);
    }
  },

  // Socket actions
  socketUpdateTicket: (updatedTicket) => {
    set((state) => ({
      currentTicket: state.currentTicket?._id === updatedTicket._id ? updatedTicket : state.currentTicket,
      tickets: state.tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t)
    }));
  },

  socketAddMessage: (newMessage) => {
    set((state) => {
      // Prevent duplicates if optimistic update already ran
      const exists = state.messages.find(m => m._id === newMessage._id);
      if (exists) return state;
      return { messages: [...state.messages, newMessage] };
    });
  }
}));
