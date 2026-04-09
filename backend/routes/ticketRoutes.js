import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addMessage,
  getMessages,
} from "../controllers/ticketController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, authorize("student"), createTicket)
  .get(protect, getTickets);

router.route("/:id")
  .get(protect, getTicketById)
  .put(protect, authorize("staff", "admin"), updateTicket);

router.route("/:id/messages")
  .post(protect, addMessage)
  .get(protect, getMessages);

export default router;
