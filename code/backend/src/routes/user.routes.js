const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const BookmarkController = require("../controllers/bookmark.controller");

// Auth routes
router.post("/auth/register", UserController.register);
router.post("/auth/forgot-password", UserController.requestPasswordReset);
router.post("/auth/reset-password", UserController.resetPasswordWithToken);
router.post("/auth/login", UserController.login);

// boomark routes
router.get("/:userId/bookmarks", BookmarkController.getUserBookmarks);

// User routes
router.get("/:id", UserController.getUserProfile);
router.put("/:id", UserController.updateUserProfile);

// Admin uses these
router.get("/", UserController.getAllUsers); // get all users list
router.delete("/:id", UserController.deleteUser); // delete user by id

module.exports = router;
