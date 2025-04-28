const {getPool} = require('../config/db.config');

class RecipeModel {
    // Get all recipes
    async getAllRecipes() {
        const result = await getPool().query('SELECT * FROM recipes ORDER BY recipe_id DESC');
        return result.rows;
    }

    // Get recipe by ID
    async getRecipeById(id) {
        const result = await getPool().query('SELECT * FROM recipes WHERE recipe_id = $1', [id]);
        return result.rows[0];
    }

    // Search recipes with multiple filters
    async searchRecipes(params) {
        const {
            query, tags, skill_level, min_cook_time, max_cook_time, min_prep_time, max_prep_time
        } = params;

        let sql = 'SELECT * FROM recipes WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;

        // Text search
        if (query) {
            sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
            queryParams.push(`%${query}%`, `%${query}%`);
            paramIndex += 2;
        }

        // Tag search
        if (tags) {
            const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

            if (tagsArray.length) {
                // ( description ILIKE ANY ($n) OR skill_level ILIKE ANY ($n) … )
                sql += ` AND (
                           description     ILIKE ANY ($${paramIndex})
                        OR skill_level     ILIKE ANY ($${paramIndex})
                        OR source_platform ILIKE ANY ($${paramIndex})
                       )`;
                queryParams.push(tagsArray.map(tag => `%${tag}%`));   // ONE parameter: text[]
                paramIndex += 1;
            }
        }

        // Skill level filter
        if (skill_level) {
            sql += ` AND skill_level = $${paramIndex}`;
            queryParams.push(skill_level);
            paramIndex += 1;
        }

        // Cook time range
        if (min_cook_time) {
            const minCookTimeInt = parseInt(min_cook_time);
            if (!isNaN(minCookTimeInt)) {
                sql += ` AND cook_time >= $${paramIndex}`;
                queryParams.push(minCookTimeInt);
                paramIndex += 1;
            }
        }

        if (max_cook_time) {
            const maxCookTimeInt = parseInt(max_cook_time);
            if (!isNaN(maxCookTimeInt)) {
                sql += ` AND cook_time <= $${paramIndex}`;
                queryParams.push(maxCookTimeInt);
                paramIndex += 1;
            }
        }

        // Prep time range
        if (min_prep_time) {
            const minPrepTimeInt = parseInt(min_prep_time);
            if (!isNaN(minPrepTimeInt)) {
                sql += ` AND prep_time >= $${paramIndex}`;
                queryParams.push(minPrepTimeInt);
                paramIndex += 1;
            }
        }

        if (max_prep_time) {
            const maxPrepTimeInt = parseInt(max_prep_time);
            if (!isNaN(maxPrepTimeInt)) {
                sql += ` AND prep_time <= $${paramIndex}`;
                queryParams.push(maxPrepTimeInt);
                paramIndex += 1;
            }
        }

        sql += ' ORDER BY recipe_id DESC';
        const result = await getPool().query(sql, queryParams);
        return result.rows;
    }

    // Create a recipe
    async createRecipe(recipeData) {
        const {
            creator_id,
            title,
            description,
            cook_time,
            prep_time,
            skill_level,
            source_platform,
            source_url,
            image_url,
            instructions_md,
        } = recipeData;

        const result = await getPool().query(`INSERT INTO recipes (creator_id, title, description, cook_time, prep_time,
                                                                   skill_level, source_platform,
                                                                   source_url, image_url, instructions_md)
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                                              RETURNING *`, [creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url, image_url, instructions_md]);
        return result.rows[0];
    }

    // Update a recipe
    async updateRecipe(id, recipeData) {
        const {
            title,
            description,
            cook_time,
            prep_time,
            skill_level,
            source_platform,
            source_url,
            image_url,
            instructions_md,
        } = recipeData;

        const result = await getPool().query(`UPDATE recipes
                                              SET title           = COALESCE($1, title),
                                                  description     = COALESCE($2, description),
                                                  cook_time       = COALESCE($3, cook_time),
                                                  prep_time       = COALESCE($4, prep_time),
                                                  skill_level     = COALESCE($5, skill_level),
                                                  source_platform = COALESCE($6, source_platform),
                                                  source_url      = COALESCE($7, source_url),
                                                  image_url       = COALESCE($8, image_url),
                                                  instructions_md = COALESCE($9, instructions_md)
                                              WHERE recipe_id = $10
                                              RETURNING *`, [title, description, cook_time, prep_time, skill_level, source_platform, source_url, image_url, instructions_md, id]);
        return result.rows[0];
    }

    // Delete a recipe
    async deleteRecipe(id) {
        const result = await getPool().query('DELETE FROM recipes WHERE recipe_id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new RecipeModel();