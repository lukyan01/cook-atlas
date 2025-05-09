const express = require('express');
const router = express.Router();
const recipeRoutes = require('./recipe.routes');
const userRoutes = require('./user.routes');
const bookmarkRoutes = require('./bookmark.routes');
const RecipeController = require('../controllers/recipe.controller');

// Apply routes
router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);
router.use('/bookmarks', bookmarkRoutes);

// Global search route - handles both /search and /recipes/search (from recipe.routes.js)
router.get('/search', RecipeController.searchRecipes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
