import { Article } from "../models/Article.js";

// @desc    Get all KB articles
// @route   GET /api/kb
// @access  Public
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).populate("author", "name");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a KB article
// @route   POST /api/kb
// @access  Private (Staff/Admin)
export const createArticle = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const article = await Article.create({
      title,
      content,
      category,
      author: req.user._id,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
