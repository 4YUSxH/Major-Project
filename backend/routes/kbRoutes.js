import express from "express";
import { getArticles, createArticle, deleteArticle, updateArticle } from "../controllers/kbController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(getArticles)
  .post(protect, authorize("staff", "admin"), createArticle);

router.route("/:id")
  .put(protect, authorize("staff", "admin"), updateArticle)
  .delete(protect, authorize("staff", "admin"), deleteArticle);

export default router;
