import express from "express";
import { registerUser, loginUser, getMe, updateProfile, getStaff, addStaff, deleteStaff } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/staff", protect, getStaff);
router.post("/add-staff", protect, authorize("admin"), addStaff);
router.delete("/staff/:id", protect, authorize("admin"), deleteStaff);

export default router;
