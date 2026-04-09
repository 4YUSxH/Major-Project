import express from "express";
import { getArticles, createArticle } from "../controllers/kbController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(getArticles)
  .post(protect, authorize("staff", "admin"), createArticle);

export default router;
