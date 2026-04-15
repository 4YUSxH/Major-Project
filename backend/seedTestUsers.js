import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const salt = await bcrypt.genSalt(10);
    const hashedPasswordAdmin = await bcrypt.hash("admin123", salt);
    const hashedPasswordStaff = await bcrypt.hash("faculty123", salt);
    const hashedPasswordStudent = await bcrypt.hash("student123", salt);

    // Delete existing users with these emails to avoid unique conflicts
    await User.deleteMany({
      email: {
        $in: [
          "admin@university.edu",
          "faculty@university.edu",
          "student@student.university.edu"
        ]
      }
    });

    const testUsers = [
      {
        name: "Test Administrator",
        email: "admin@university.edu",
        password: hashedPasswordAdmin,
        role: "admin",
        department: "Administration",
        isVerified: true,
        hasSetupProfile: true
      },
      {
        name: "Test Faculty",
        email: "faculty@university.edu",
        password: hashedPasswordStaff,
        role: "staff",
        department: "Engineering",
        isVerified: true,
        hasSetupProfile: true
      },
      {
        name: "Test Student",
        email: "student@student.university.edu",
        password: hashedPasswordStudent,
        role: "student",
        isVerified: true,
        hasSetupProfile: true,
        branch: "Computer Science",
        semester: "6th",
        year: "3rd Year",
        enrollmentNumber: "001CS020304"
      }
    ];

    await User.insertMany(testUsers);
    
    console.log("Data Imported successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error}`);
    process.exit(1);
  }
};

seedUsers();
