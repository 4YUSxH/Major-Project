import { Ticket } from "../models/Ticket.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { getIo } from "../server.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category: category || "Other",
      priority: priority || "Medium",
      student: req.user._id,
      department: category, // Basic automatic routing logic based on category
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tickets (Student sees own, Staff sees dept, Admin sees all)
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "student") {
      query.student = req.user._id;
    } else if (req.user.role === "staff") {
      if (req.user.department) query.department = req.user.department;
    }

    const tickets = await Ticket.find(query)
      .populate("student", "name email")
      .populate("assignedTo", "name email")
      .sort("-createdAt");
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Role checks
    if (req.user.role === "student" && ticket.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status / Assign
// @route   PUT /api/tickets/:id
// @access  Private (Staff/Admin)
export const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id).populate("student");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const previousStatus = ticket.status;
    
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updatedTicket = await ticket.save();
    const io = getIo();

    // Emit socket event for real-time ticket metadata sync
    io.to(ticket._id.toString()).emit("ticket-updated", updatedTicket);

    // If status changed to Resolved, notify student via Email & In-App Notification
    if (status === "Resolved" && previousStatus !== "Resolved") {
      const msg = `Your ticket "${ticket.title}" has been resolved by our staff.`;
      
      // 1. Create In-App Notification Database Entry
      const notification = await Notification.create({
        user: ticket.student._id,
        message: msg,
        ticket: ticket._id,
      });

      // 2. Emit Real-time Notification Event strictly to the student
      // Note: We use student._id as a distinct channel if we set it up, but for now we broadcast
      // or we can just expect the student to fetch/listen on their personal id room. 
      // For simplicity, we emit globally uniquely addressed to them.
      io.emit(`notification-${ticket.student._id}`, notification);

      // 3. Send Email
      await sendEmail({
        email: ticket.student.email,
        subject: "Ticket Resolved",
        message: `${msg}\n\nPlease check your dashboard for details.`,
      });
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a message to a ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
export const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const ticketId = req.params.id;

    // Optional: check if ticket exists and user has access

    const newMessage = await Message.create({
      ticket: ticketId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await newMessage.populate("sender", "name role");

    // Socket emission
    const io = getIo();
    io.to(ticketId.toString()).emit("new-message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a ticket
// @route   GET /api/tickets/:id/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ ticket: req.params.id })
      .populate("sender", "name role")
      .sort("createdAt");
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
