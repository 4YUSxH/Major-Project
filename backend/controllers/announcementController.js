import { Announcement } from "../models/Announcement.js";

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Staff/Admin
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = "";

    // If multer successfully uploaded a file, attach its URL path
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const announcement = await Announcement.create({
      title,
      content,
      imageUrl,
      author: req.user._id,
    });

    // Populate author so frontend doesn't crash accessing name
    await announcement.populate("author", "name role");

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Announcement Create Error:", error);
    res.status(500).json({ message: "Failed to create announcement" });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Staff/Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Verify ownership
    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this notice" });
    }

    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete announcement" });
  }
};
