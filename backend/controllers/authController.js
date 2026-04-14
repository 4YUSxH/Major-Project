import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      department: department || "",
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile setup
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, department, branch, semester, year, enrollmentNumber, profileImage } = req.body;

    if (name) user.name = name;
    if (department) user.department = department;
    if (profileImage) user.profileImage = profileImage;

    if (user.role === "student") {
      if (branch) user.branch = branch;
      if (semester) user.semester = semester;
      if (year) user.year = year;
      if (enrollmentNumber) user.enrollmentNumber = enrollmentNumber;
    }

    user.hasSetupProfile = true;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get staff members
// @route   GET /api/auth/staff
// @access  Private
export const getStaff = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    const staffMembers = await User.find({ role: "staff" }).select("-password");
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
