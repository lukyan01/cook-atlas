const request = require('supertest');
const app = require('../index');
const pool = require('../db');

describe('Recipes API', () => {
    let testUser;
    let testRecipe;

    // Setup test data
    beforeAll(async () => {
        // Create test user
        const userResult = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            ['recipeuser', 'recipe@example.com', 'password123', 'Recipe Creator']
        );

        testUser = userResult.rows[0];

        // Create test recipe
        const recipeResult = await pool.query(
            `INSERT INTO recipes (
        creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                testUser.user_id,
                'Test Recipe',
                'This is a test recipe description',
                45,
                15,
                'Intermediate',
                'Test Platform',
                'http://example.com/recipe'
            ]
        );

        testRecipe = recipeResult.rows[0];
    });

    afterAll(async () => {
        // Clean up
        await pool.query('DELETE FROM recipes WHERE creator_id = $1', [testUser.user_id]);
        await pool.query('DELETE FROM users WHERE user_id = $1', [testUser.user_id]);
        await pool.end();
    });

    describe('GET /recipes', () => {
        it('should return all recipes', async () => {
            const res = await request(app).get('/recipes');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body.some(recipe => recipe.recipe_id === testRecipe.recipe_id)).toBeTruthy();
        });
    });

    describe('GET /recipes/:id', () => {
        it('should return a recipe by ID', async () => {
            const res = await request(app).get(`/recipes/${testRecipe.recipe_id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('recipe_id', testRecipe.recipe_id);
            expect(res.body).toHaveProperty('title', 'Test Recipe');
            expect(res.body).toHaveProperty('description', 'This is a test recipe description');
            expect(res.body).toHaveProperty('cook_time', 45);
            expect(res.body).toHaveProperty('prep_time', 15);
            expect(res.body).toHaveProperty('skill_level', 'Intermediate');
        });

        it('should return 404 for non-existent recipe ID', async () => {
            const res = await request(app).get('/recipes/9999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Recipe not found');
        });
    });

    describe('GET /search', () => {
        it('should search recipes by title', async () => {
            const res = await request(app).get('/search?query=Test Recipe');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.some(recipe => recipe.recipe_id === testRecipe.recipe_id)).toBeTruthy();
        });

        it('should search recipes by skill level', async () => {
            const res = await request(app).get('/search?skill_level=Intermediate');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.some(recipe => recipe.skill_level === 'Intermediate')).toBeTruthy();
        });

        it('should search recipes by cook time range', async () => {
            const res = await request(app).get('/search?min_cook_time=30&max_cook_time=60');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.some(recipe =>
                recipe.cook_time >= 30 && recipe.cook_time <= 60
            )).toBeTruthy();
        });

        it('should return empty array for no matches', async () => {
            const res = await request(app).get('/search?query=NonExistentRecipeName123456789');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });

    describe('POST /recipes', () => {
        it('should create a new recipe with valid data', async () => {
            const newRecipe = {
                creator_id: testUser.user_id,
                title: 'New Test Recipe',
                description: 'This is a new test recipe',
                cook_time: 30,
                prep_time: 10,
                skill_level: 'Beginner',
                source_platform: 'Test Platform',
                source_url: 'http://example.com/new-recipe'
            };

            const res = await request(app)
                .post('/recipes')
                .send(newRecipe);

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('recipe_id');
            expect(res.body).toHaveProperty('title', 'New Test Recipe');
            expect(res.body).toHaveProperty('description', 'This is a new test recipe');
            expect(res.body).toHaveProperty('cook_time', 30);
            expect(res.body).toHaveProperty('prep_time', 10);
            expect(res.body).toHaveProperty('skill_level', 'Beginner');

            // Clean up the created recipe
            await pool.query('DELETE FROM recipes WHERE recipe_id = $1', [res.body.recipe_id]);
        });

        it('should reject creating recipe with missing required fields', async () => {
            const res = await request(app)
                .post('/recipes')
                .send({
                    creator_id: testUser.user_id,
                    cook_time: 30,
                    prep_time: 10
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });

    describe('PUT /recipes/:id', () => {
        it('should update a recipe with valid data', async () => {
            const updates = {
                title: 'Updated Test Recipe',
                description: 'This is an updated test recipe',
                cook_time: 60
            };

            const res = await request(app)
                .put(`/recipes/${testRecipe.recipe_id}`)
                .send(updates);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('recipe_id', testRecipe.recipe_id);
            expect(res.body).toHaveProperty('title', 'Updated Test Recipe');
            expect(res.body).toHaveProperty('description', 'This is an updated test recipe');
            expect(res.body).toHaveProperty('cook_time', 60);
            expect(res.body).toHaveProperty('prep_time', 15); // Unchanged value
        });

        it('should return 404 for updating non-existent recipe', async () => {
            const res = await request(app)
                .put('/recipes/9999')
                .send({
                    title: 'Non-existent Recipe'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Recipe not found');
        });
    });

    describe('DELETE /recipes/:id', () => {
        it('should delete a recipe', async () => {
            // First create a recipe to delete
            const newRecipeRes = await request(app)
                .post('/recipes')
                .send({
                    creator_id: testUser.user_id,
                    title: 'Recipe to Delete',
                    description: 'This recipe will be deleted',
                    cook_time: 25,
                    prep_time: 5,
                    skill_level: 'Beginner'
                });

            expect(newRecipeRes.statusCode).toBe(201);

            // Now delete it
            const res = await request(app)
                .delete(`/recipes/${newRecipeRes.body.recipe_id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('deleted successfully');

            // Verify it's gone
            const verifyRes = await request(app).get(`/recipes/${newRecipeRes.body.recipe_id}`);
            expect(verifyRes.statusCode).toBe(404);
        });

        it('should return 404 for deleting non-existent recipe', async () => {
            const res = await request(app)
                .delete('/recipes/9999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Recipe not found');
        });
    });
});