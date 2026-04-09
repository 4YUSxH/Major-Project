import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
    },
    department: {
      type: String,
      default: "", // Empty for students, populated for staff if applicable
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
