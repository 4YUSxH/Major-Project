import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email.toLowerCase().endsWith('@cdgi.edu.in')) {
      return res.status(400).json({ message: "Only @cdgi.edu.in email addresses are permitted for registration." });
    }

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
      role: "student",
      department: "",
      isVerified: true,
    });

    if (user) {
      res.status(201).json({
        message: "Registration successful. You can now log in.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify user email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email successfully verified. You can now log in." });
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
      if (user.isVerified === false) {
        return res.status(401).json({ message: "Please verify your email address to log in." });
      }

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

// @desc    Add a staff or admin member
// @route   POST /api/auth/add-staff
// @access  Private (Admin only)
export const addStaff = async (req, res) => {
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
      role: role === "admin" ? "admin" : "staff",
      department: department || "",
      isVerified: true,
      hasSetupProfile: true,
    });

    res.status(201).json({
      message: "Staff member added successfully.",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a staff or admin member
// @route   DELETE /api/auth/staff/:id
// @access  Private (Admin only)
export const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "staff" && user.role !== "admin") {
      return res.status(400).json({ message: "Can only delete staff or admin users through this route" });
    }

    if (user._id.toString() === req.user._id.toString()) {
       return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
