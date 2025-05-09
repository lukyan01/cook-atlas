const BookmarkModel = require("../models/bookmark.model");

class BookmarkController {
  // Get all bookmarks for a user
  async getUserBookmarks(req, res) {
    try {
      const { userId } = req.params;
      const bookmarks = await BookmarkModel.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (err) {
      console.error("Error fetching user bookmarks:", err);
      res.status(500).json({ message: "Failed to fetch bookmarks", error: err.message });
    }
  }

  // Add a bookmark
  async addBookmark(req, res) {
    try {
      const { user_id, recipe_id } = req.body;

      if (!user_id || !recipe_id) {
        return res.status(400).json({ message: "User ID and Recipe ID are required" });
      }

      const bookmark = await BookmarkModel.addBookmark(user_id, recipe_id);
      res.status(201).json(bookmark);
    } catch (err) {
      console.error("Error adding bookmark:", err);

      if (err.message === "Recipe already bookmarked") {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).json({ message: "Failed to add bookmark", error: err.message });
    }
  }

  // Check if a recipe is bookmarked
  async checkBookmark(req, res) {
    try {
      const user_id = req.query.user_id;
      const recipe_id = req.query.recipe_id;

      if (!user_id || !recipe_id) {
        return res
          .status(400)
          .json({ message: "User ID and Recipe ID are required" });
      }

      const isBookmarked = await BookmarkModel.checkBookmark(user_id,recipe_id);
      res.json({ bookmarked: isBookmarked });
    } catch (err) {
      console.error("Error checking bookmark:", err);
      res.status(500).json({ message: "Failed to check bookmark", error: err.message });
    }
  }

  // Remove a bookmark
  async removeBookmark(req, res) {
    try {
      const user_id = req.query.user_id;
      const recipe_id = req.query.recipe_id;

      if (!user_id || !recipe_id) {
        return res.status(400).json({ message: "User ID and Recipe ID are required" });
      }

      await BookmarkModel.removeBookmark(user_id, recipe_id);
      res.json({ message: "Bookmark removed successfully" });
    } catch (err) {
      console.error("Error removing bookmark:", err);
      res
        .status(500)
        .json({ message: "Failed to remove bookmark", error: err.message });
    }
  }

  // Get all bookmarks (for admin/stats)
  async getAllBookmarks(req, res) {
    try {
      const bookmarks = await BookmarkModel.getAllBookmarks();
      res.json(bookmarks);
    } catch (err) {
      console.error("Error fetching all bookmarks:", err);
      res.status(500).json({ message: "Failed to fetch all bookmarks", error: err.message });
    }
  }
}

module.exports = new BookmarkController();
