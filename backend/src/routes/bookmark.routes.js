const express = require("express");
const router = express.Router();
const BookmarkController = require("../controllers/bookmark.controller");

// Bookmark routes
router.post("/", BookmarkController.addBookmark);
router.get("/check", BookmarkController.checkBookmark);
router.get("/", BookmarkController.getAllBookmarks);
router.delete("/", BookmarkController.removeBookmark);

module.exports = router;
