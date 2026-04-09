import express from "express";
import multer from "multer";
import path from "path";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Image verification (optional limiters)
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router
  .route("/")
  .get(protect, getAnnouncements)
  // upload.single('image') intercepts the form-data parameter named 'image'
  .post(protect, authorize("admin", "staff"), upload.single("image"), createAnnouncement);

router
  .route("/:id")
  .delete(protect, authorize("admin", "staff"), deleteAnnouncement);

export default router;
