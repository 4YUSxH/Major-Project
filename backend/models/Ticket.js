import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["IT Support", "Academic", "Bus Service", "Facility Maintenance", "Financial", "Library", "Disciplinary", "Other", "Others"],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    department: {
      type: String,
      default: "", // Typically reflects category IT -> IT Dept
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
