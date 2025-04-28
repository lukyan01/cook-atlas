// tests/bookmarks.test.js
const request = require('supertest');
const app = require('../index');
const pool = require('../db');

describe('Bookmarks API', () => {
    let testUser;
    let testRecipe;

    // Setup test data
    beforeAll(async () => {
        // Create test user
        const userResult = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            ['bookmarkuser', 'bookmark@example.com', 'password123', 'Registered User']
        );

        testUser = userResult.rows[0];

        // Create test recipe
        const recipeResult = await pool.query(
            `INSERT INTO recipes (
        creator_id, title, description, cook_time, prep_time, skill_level
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                testUser.user_id,
                'Bookmark Test Recipe',
                'This is a recipe for bookmark testing',
                30,
                15,
                'Beginner'
            ]
        );

        testRecipe = recipeResult.rows[0];
    });

    afterAll(async () => {
        // Clean up
        await pool.query('DELETE FROM bookmark WHERE user_id = $1', [testUser.user_id]);
        await pool.query('DELETE FROM recipes WHERE creator_id = $1', [testUser.user_id]);
        await pool.query('DELETE FROM users WHERE user_id = $1', [testUser.user_id]);
        await pool.end();
    });

    describe('POST /bookmarks', () => {
        it('should add a bookmark with valid data', async () => {
            const res = await request(app)
                .post('/bookmarks')
                .send({
                    user_id: testUser.user_id,
                    recipe_id: testRecipe.recipe_id
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('bookmark_id');
            expect(res.body).toHaveProperty('user_id', testUser.user_id);
            expect(res.body).toHaveProperty('recipe_id', testRecipe.recipe_id);
        });

        it('should reject adding duplicate bookmark', async () => {
            const res = await request(app)
                .post('/bookmarks')
                .send({
                    user_id: testUser.user_id,
                    recipe_id: testRecipe.recipe_id
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('already bookmarked');
        });

        it('should reject bookmark with missing fields', async () => {
            const res = await request(app)
                .post('/bookmarks')
                .send({
                    user_id: testUser.user_id
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });

    describe('GET /bookmarks/check', () => {
        it('should check if recipe is bookmarked', async () => {
            const res = await request(app)
                .get('/bookmarks/check')
                .query({
                    user_id: testUser.user_id,
                    recipe_id: testRecipe.recipe_id
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('bookmarked', true);
        });

        it('should return false for non-bookmarked recipe', async () => {
            const res = await request(app)
                .get('/bookmarks/check')
                .query({
                    user_id: testUser.user_id,
                    recipe_id: 9999 // Non-existent recipe
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('bookmarked', false);
        });

        it('should require both user_id and recipe_id', async () => {
            const res = await request(app)
                .get('/bookmarks/check')
                .query({
                    user_id: testUser.user_id
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });

    describe('GET /users/:userId/bookmarks', () => {
        it('should get user bookmarks', async () => {
            const res = await request(app)
                .get(`/users/${testUser.user_id}/bookmarks`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('recipe_id', testRecipe.recipe_id);
            expect(res.body[0]).toHaveProperty('title', 'Bookmark Test Recipe');
        });

        it('should return empty array for user with no bookmarks', async () => {
            // Create a new user with no bookmarks
            const newUserResult = await pool.query(
                'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
                ['nobookmarks', 'nobookmarks@example.com', 'password123', 'Registered User']
            );

            const newUser = newUserResult.rows[0];

            const res = await request(app)
                .get(`/users/${newUser.user_id}/bookmarks`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);

            // Clean up
            await pool.query('DELETE FROM users WHERE user_id = $1', [newUser.user_id]);
        });
    });

    describe('DELETE /bookmarks', () => {
        it('should remove a bookmark', async () => {
            const res = await request(app)
                .delete('/bookmarks')
                .query({
                    user_id: testUser.user_id,
                    recipe_id: testRecipe.recipe_id
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('removed successfully');

            // Verify it's removed
            const checkRes = await request(app)
                .get('/bookmarks/check')
                .query({
                    user_id: testUser.user_id,
                    recipe_id: testRecipe.recipe_id
                });

            expect(checkRes.body).toHaveProperty('bookmarked', false);
        });

        it('should return success even for non-existent bookmark', async () => {
            // This is a common API pattern - deleting something that doesn't exist is considered a success
            const res = await request(app)
                .delete('/bookmarks')
                .query({
                    user_id: testUser.user_id,
                    recipe_id: 9999
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('removed successfully');
        });

        it('should require both user_id and recipe_id', async () => {
            const res = await request(app)
                .delete('/bookmarks')
                .query({
                    user_id: testUser.user_id
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });
});