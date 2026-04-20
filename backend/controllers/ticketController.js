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
    const { title, description, category, priority, department } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category: category || "Other",
      priority: priority || "Medium",
      student: req.user._id,
      department: department || "Other", // Route ticket to manually specified department
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
      if (req.user.department) {
        query = {
          $or: [
            { department: req.user.department },
            { assignedTo: req.user._id }
          ]
        };
      } else {
        query.assignedTo = req.user._id;
      }
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

// Status-change message map
const STATUS_MESSAGES = {
  Assigned:    (title) => `Your ticket "${title}" has been assigned to a staff member.`,
  "In Progress": (title) => `Your ticket "${title}" is now being worked on.`,
  Resolved:    (title) => `Your ticket "${title}" has been resolved. Please review and close it if satisfied.`,
  Closed:      (title) => `Your ticket "${title}" has been closed.`,
  Open:        (title) => `Your ticket "${title}" has been reopened and is in the queue.`,
};

// @desc    Update ticket status / Assign  (Student can reopen their own Closed/Resolved ticket)
// @route   PUT /api/tickets/:id
// @access  Private
export const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id).populate("student");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Students: may ONLY reopen their own ticket (set status back to Open)
    if (req.user.role === "student") {
      const isOwner = ticket.student._id.toString() === req.user._id.toString();
      const isReopenable = ["Closed", "Resolved"].includes(ticket.status);
      const isReopenRequest = status === "Open";

      if (!isOwner || !isReopenable || !isReopenRequest) {
        return res.status(403).json({ message: "Students may only reopen their own closed tickets." });
      }
    }

    // Only admins may assign
    if (assignedTo && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only administrators can assign tickets." });
    }

    const previousStatus = ticket.status;

    if (status) ticket.status = status;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;

    const updatedTicket = await ticket.save();
    const io = getIo();

    // Emit socket event for real-time ticket metadata sync
    io.to(ticket._id.toString()).emit("ticket-updated", updatedTicket);

    // Notify student on every status change
    if (status && status !== previousStatus) {
      const msgFn = STATUS_MESSAGES[status];
      const msg = msgFn ? msgFn(ticket.title) : `Your ticket "${ticket.title}" status changed to ${status}.`;

      const notification = await Notification.create({
        user: ticket.student._id,
        message: msg,
        ticket: ticket._id,
      });

      io.emit(`notification-${ticket.student._id}`, notification);

      // Send email only on Resolved
      if (status === "Resolved") {
        await sendEmail({
          email: ticket.student.email,
          subject: "Your Ticket Has Been Resolved",
          message: `${msg}\n\nPlease check your dashboard for details.`,
        });
      }
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
    const { message, isInternal } = req.body;
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId)
      .populate("student", "name email")
      .populate("assignedTo", "name email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newMessage = await Message.create({
      ticket: ticketId,
      sender: req.user._id,
      message,
      isInternal: isInternal || false,
    });

    const populatedMessage = await newMessage.populate("sender", "name role");

    // Socket emission — broadcast new message to everyone in the ticket room
    const io = getIo();
    io.to(ticketId.toString()).emit("new-message", populatedMessage);

    // --- Cross-party notification ---
    const senderName = req.user.name;
    const senderRole = req.user.role;
    let recipientId = null;

    if (isInternal) {
      if (ticket.assignedTo && req.user._id.toString() !== ticket.assignedTo._id.toString()) {
        recipientId = ticket.assignedTo._id;
      }
    } else {
      if (senderRole === "student") {
        if (ticket.assignedTo) {
          recipientId = ticket.assignedTo._id;
        }
      } else {
        recipientId = ticket.student._id;
      }
    }

    if (recipientId) {
      const notifMessage = isInternal 
        ? `${senderName} left an internal note on ticket "${ticket.title}"`
        : `${senderName} sent a message on ticket "${ticket.title}"`;

      const notification = await Notification.create({
        user: recipientId,
        message: notifMessage,
        ticket: ticket._id,
      });

      // Emit real-time notification to recipient's personal channel
      io.emit(`notification-${recipientId}`, notification);
    }

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
    let query = { ticket: req.params.id };
    
    // Students cannot see internal messages
    if (req.user.role === "student") {
      query.isInternal = { $ne: true };
    }

    const messages = await Message.find(query)
      .populate("sender", "name role")
      .sort("createdAt");
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
