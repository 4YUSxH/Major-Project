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

// @desc    Delete a KB article
// @route   DELETE /api/kb/:id
// @access  Private (Staff/Admin)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (req.user.role !== "admin" && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this article" });
    }

    await article.deleteOne();
    res.status(200).json({ message: "Article removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a KB article
// @route   PUT /api/kb/:id
// @access  Private (Staff/Admin)
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (req.user.role !== "admin" && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this article" });
    }

    const { title, content, category } = req.body;

    if (title) article.title = title;
    if (content) article.content = content;
    if (category) article.category = category;

    const updatedArticle = await article.save();
    
    // Repopulate author name for frontend
    await updatedArticle.populate("author", "name");
    
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
