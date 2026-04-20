import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ticket",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
