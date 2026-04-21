import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp, type) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subject = type === "register" ? "Verify your Student Registration" : "Login Verification Code";
    const title = type === "register" ? "Welcome to HelpDesk! Verify your email." : "Your HelpDesk Login Verification Code";
    
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">${title}</h2>
          <p>Please use the following 6-digit verification code to complete your ${type === "register" ? "registration" : "login"}:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #4338ca;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Resend Email Error:", error);
    return false;
  }
};

// @desc    Register a new user (Init Phase)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email.toLowerCase().endsWith('@cdgi.edu.in')) {
      return res.status(400).json({ message: "Only @cdgi.edu.in email addresses are permitted for registration." });
    }

    let userExists = await User.findOne({ email });

    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists." });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    
    // Auto-verify test student
    if (email === "teststudent@cdgi.edu.in") {
      if (!userExists) {
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({
          name,
          email,
          password: hashedPassword,
          role: "student",
          department: "",
          isVerified: true,
        });
      }
      return res.status(200).json({ step: "success", message: "Registration complete. You can now log in." });
    }

    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (userExists && !userExists.isVerified) {
       // Update unverified attempt
       const hashedPassword = await bcrypt.hash(password, salt);
       userExists.name = name;
       userExists.password = hashedPassword;
       userExists.otp = hashedOtp;
       userExists.otpExpires = otpExpires;
       await userExists.save();
    } else {
       const hashedPassword = await bcrypt.hash(password, salt);
       await User.create({
         name,
         email,
         password: hashedPassword,
         role: "student",
         department: "",
         isVerified: false,
         otp: hashedOtp,
         otpExpires: otpExpires,
       });
    }

    const emailSent = await sendOTPEmail(email, otp, "register");
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }

    res.status(200).json({ step: "otp_required", email, message: "OTP sent to your email." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Registration OTP
// @route   POST /api/auth/register-verify
// @access  Public
export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Registration session not found." });
    if (user.isVerified) return res.status(400).json({ message: "User is already verified." });

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please register again to generate a new code." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP code." });

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).json({ message: "Registration complete. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Authenticate a user (Login Init)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified && user.role === "student" && email !== "teststudent@cdgi.edu.in") {
      return res.status(401).json({ message: "Please register and verify your email address first." });
    }

    // Two-factor OTP strictly for students (except test student)
    if (user.role === "student" && email !== "teststudent@cdgi.edu.in") {
      const otp = generateOTP();
      const salt = await bcrypt.genSalt(10);
      user.otp = await bcrypt.hash(otp, salt);
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
      await user.save();

      const emailSent = await sendOTPEmail(email, otp, "login");
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send login code. Please try again." });
      }

      return res.status(200).json({ step: "otp_required", email, message: "We've sent a login code to your email." });
    }

    // Default fast-track login for staff/admin
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Login OTP
// @route   POST /api/auth/login-verify
// @access  Public
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Login session not found." });

    if (user.role !== "student") {
       return res.status(400).json({ message: "This route is exclusively for student authentication." });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please try logging in again." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP code." });

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
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
