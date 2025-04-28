const RecipeModel = require('../models/recipe.model');

class RecipeController {
    // Get all recipes
    async getAllRecipes(req, res) {
        try {
            const recipes = await RecipeModel.getAllRecipes();
            res.json(recipes);
        } catch (err) {
            console.error('Error in getAllRecipes:', err);
            res.status(500).json({message: 'Failed to fetch recipes', error: err.message});
        }
    }

    // Get recipe by ID
    async getRecipeById(req, res) {
        try {
            const {id} = req.params;
            const recipe = await RecipeModel.getRecipeById(id);

            if (!recipe) {
                return res.status(404).json({message: 'Recipe not found'});
            }

            res.json(recipe);
        } catch (err) {
            console.error('Error in getRecipeById:', err);
            res.status(500).json({message: 'Failed to fetch recipe', error: err.message});
        }
    }

    // Search recipes
    async searchRecipes(req, res) {
        try {
            const recipes = await RecipeModel.searchRecipes(req.query);
            res.json(recipes);
        } catch (err) {
            console.error('Error in searchRecipes:', err);
            res.status(500).json({message: 'Search failed', error: err.message});
        }
    }

    // Create a recipe
    async createRecipe(req, res) {
        try {
            const {title, description} = req.body;

            if (!title || !description) {
                return res.status(400).json({message: 'Title and description are required'});
            }

            const recipe = await RecipeModel.createRecipe(req.body);
            res.status(201).json(recipe);
        } catch (err) {
            console.error('Error in createRecipe:', err);
            res.status(500).json({message: 'Failed to create recipe', error: err.message});
        }
    }

    // Update a recipe
    async updateRecipe(req, res) {
        try {
            const {id} = req.params;
            const recipe = await RecipeModel.updateRecipe(id, req.body);

            if (!recipe) {
                return res.status(404).json({message: 'Recipe not found'});
            }

            res.json(recipe);
        } catch (err) {
            console.error('Error in updateRecipe:', err);
            res.status(500).json({message: 'Failed to update recipe', error: err.message});
        }
    }

    // Delete a recipe
    async deleteRecipe(req, res) {
        try {
            const {id} = req.params;
            const recipe = await RecipeModel.deleteRecipe(id);

            if (!recipe) {
                return res.status(404).json({message: 'Recipe not found'});
            }

            res.json({message: 'Recipe deleted successfully'});
        } catch (err) {
            console.error('Error in deleteRecipe:', err);
            res.status(500).json({message: 'Failed to delete recipe', error: err.message});
        }
    }
}

module.exports = new RecipeController();