const express = require("express");
const router = express.Router();
const RecipeController = require("../controllers/recipe.controller");

// Regular API routes
router.get("/", RecipeController.getAllRecipes);
router.get("/search", RecipeController.searchRecipes);
router.get("/:id", RecipeController.getRecipeById);
router.post("/", RecipeController.createRecipe);
router.put("/:id", RecipeController.updateRecipe);
router.delete("/:id", RecipeController.deleteRecipe);

module.exports = router;
