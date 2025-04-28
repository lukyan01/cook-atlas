const {getPool} = require('../config/db.config');

class BookmarkModel {
    // Get all bookmarks for a user
    async getUserBookmarks(userId) {
        const result = await getPool().query(
            `SELECT r.*
             FROM recipes r
                      JOIN bookmark b ON r.recipe_id = b.recipe_id
             WHERE b.user_id = $1
             ORDER BY r.recipe_id DESC`,
            [userId]
        );
        return result.rows;
    }

    // Add a bookmark
    async addBookmark(userId, recipeId) {
        // Check if bookmark already exists
        const checkResult = await getPool().query(
            'SELECT * FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );

        if (checkResult.rows.length > 0) {
            throw new Error('Recipe already bookmarked');
        }

        // Create bookmark
        const result = await getPool().query(
            'INSERT INTO bookmark (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
            [userId, recipeId]
        );
        return result.rows[0];
    }

    // Check if a recipe is bookmarked
    async checkBookmark(userId, recipeId) {
        const result = await getPool().query(
            'SELECT * FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );
        return result.rows.length > 0;
    }

    // Remove a bookmark
    async removeBookmark(userId, recipeId) {
        await getPool().query(
            'DELETE FROM bookmark WHERE user_id = $1 AND recipe_id = $2',
            [userId, recipeId]
        );
        return {success: true};
    }
}

module.exports = new BookmarkModel();