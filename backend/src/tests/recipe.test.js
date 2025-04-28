const request = require('supertest');
const app = require('../app');
const {getPool} = require('../config/db.config');
const bcrypt = require('bcrypt');

/**
 * This suite inserts FOUR different recipes with clearly distinct
 * attributes so each filter can be exercised in isolation:
 *   1. Vegan Curry  – vegan tag, Beginner skill, cook 40 / prep 15
 *   2. Quick Pasta  – quick tag, Beginner skill, cook 20 / prep 5
 *   3. Sunday Roast – roast tag, Intermediate skill, cook 90 / prep 30
 *   4. Choco Brownies – dessert tag, Advanced skill, cook 30 / prep 10
 */

describe('Recipes API', () => {
    let testUser;
    /**
     * Array of fixture recipes created in beforeAll.  Each element is the row
     * returned by INSERT … RETURNING so we can reference its recipe_id later.
     */
    const fixtures = [];

    // --------------------------------------------------
    //  Test data setup & teardown
    // --------------------------------------------------
    beforeAll(async () => {
        // ––––––––––––––––––– Create a dedicated recipe‑creator user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const {rows: [u]} = await getPool().query(
            `INSERT INTO users (username, email, password, role)
             VALUES ('recipe_creator', 'creator@example.com', $1, 'Recipe Creator')
             RETURNING *`,
            [hashedPassword]
        );
        testUser = u;

        // ––––––––––––––––––– Insert four distinct recipes
        const seed = [
            {
                title: 'Vegan Curry',
                description: 'A delicious vegan curry ideal for weeknight dinners',
                cook_time: 40,
                prep_time: 15,
                skill_level: 'Beginner',
                source_platform: 'Blog',
            },
            {
                title: 'Quick Pasta',
                description: 'Quick pasta recipe – dinner in 20 minutes, perfect for busy days',
                cook_time: 20,
                prep_time: 5,
                skill_level: 'Beginner',
                source_platform: 'YouTube',
            },
            {
                title: 'Sunday Roast',
                description: 'Traditional roast dinner with potatoes – great family roast',
                cook_time: 90,
                prep_time: 30,
                skill_level: 'Intermediate',
                source_platform: 'Cookbook',
            },
            {
                title: 'Choco Brownies',
                description: 'Rich chocolate brownies – ultimate dessert for choco lovers',
                cook_time: 30,
                prep_time: 10,
                skill_level: 'Advanced',
                source_platform: 'Instagram',
            },
        ];

        for (const r of seed) {
            // prettier-ignore
            const {rows: [recipe]} = await getPool().query(
                `INSERT INTO recipes (creator_id, title, description, cook_time, prep_time, skill_level,
                                      source_platform)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [testUser.user_id, r.title, r.description, r.cook_time, r.prep_time, r.skill_level, r.source_platform]
            );
            fixtures.push(recipe);
        }
    });

    afterAll(async () => {
        await getPool().query('DELETE FROM recipes WHERE creator_id = $1', [testUser.user_id]);
        await getPool().query('DELETE FROM users   WHERE user_id    = $1', [testUser.user_id]);
    });

    // --------------------------------------------------
    //  GET /recipes
    // --------------------------------------------------
    describe('GET /recipes', () => {
        it('returns all recipes in descending id order', async () => {
            const res = await request(app).get('/recipes');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(fixtures.length);

            // Latest fixture should appear before the earliest
            const posNewest = res.body.findIndex(r => r.recipe_id === fixtures[3].recipe_id);
            const posOldest = res.body.findIndex(r => r.recipe_id === fixtures[0].recipe_id);
            expect(posNewest).toBeLessThan(posOldest);
        });
    });

    // --------------------------------------------------
    //  GET /recipes/:id
    // --------------------------------------------------
    describe('GET /recipes/:id', () => {
        it('returns the correct recipe by id', async () => {
            const target = fixtures[1]; // Quick Pasta
            const res = await request(app).get(`/recipes/${target.recipe_id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({
                recipe_id: target.recipe_id,
                title: target.title,
                cook_time: target.cook_time,
            });
        });

        it('returns 404 for a non‑existent id', async () => {
            const res = await request(app).get('/recipes/999999');
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toMatch(/not found/i);
        });
    });

    // --------------------------------------------------
    //  Flexible search endpoint
    // --------------------------------------------------
    describe('GET /search', () => {
        it('filters by title substring (case‑insensitive)', async () => {
            const res = await request(app).get('/search?query=roast');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Sunday Roast');
        });

        it('filters by exact skill level', async () => {
            const res = await request(app).get('/search?skill_level=Beginner');
            expect(res.statusCode).toBe(200);
            expect(res.body.every(r => r.skill_level === 'Beginner')).toBe(true);
        });

        it('filters by multiple tags (substring OR logic)', async () => {
            const res = await request(app).get('/search?tags=vegan,quick');
            expect(res.statusCode).toBe(200);

            // Every returned recipe must contain at least one of the tag words in description / platform / skill_level
            const containsTag = r =>
                /(vegan|quick)/i.test(`${r.description} ${r.skill_level} ${r.source_platform}`);
            expect(res.body.every(containsTag)).toBe(true);
        });

        it('filters by cook‑time range', async () => {
            const res = await request(app).get('/search?min_cook_time=25&max_cook_time=45');
            expect(res.statusCode).toBe(200);
            expect(res.body.every(r => r.cook_time >= 25 && r.cook_time <= 45)).toBe(true);
        });

        it('filters by prep‑time range', async () => {
            const res = await request(app).get('/search?min_prep_time=5&max_prep_time=15');
            expect(res.statusCode).toBe(200);
            expect(res.body.every(r => r.prep_time >= 5 && r.prep_time <= 15)).toBe(true);
        });

        it('returns an empty array when no recipe matches', async () => {
            const res = await request(app).get('/search?query=nonexistentkeyword123');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(0);
        });
    });

    // --------------------------------------------------
    //  CRUD operations (POST, PUT, DELETE)
    // --------------------------------------------------
    describe('POST /recipes', () => {
        it('creates a new recipe and returns it', async () => {
            const payload = {
                creator_id: testUser.user_id,
                title: 'Temp Recipe ' + Date.now(),
                description: 'temporary recipe for POST test',
                cook_time: 25,
                prep_time: 8,
                skill_level: 'Beginner',
                source_platform: 'TestSuite',
                source_url: 'https://example.com/temp',
            };

            const res = await request(app).post('/recipes').send(payload);
            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe(payload.title);

            // Clean up
            await getPool().query('DELETE FROM recipes WHERE recipe_id = $1', [res.body.recipe_id]);
        });

        it('rejects when required fields are missing', async () => {
            const res = await request(app).post('/recipes').send({creator_id: testUser.user_id});
            expect(res.statusCode).toBe(400);
        });
    });

    describe('PUT /recipes/:id', () => {
        it('updates only the supplied fields', async () => {
            const target = fixtures[0]; // Vegan Curry
            const res = await request(app)
                .put(`/recipes/${target.recipe_id}`)
                .send({cook_time: 50, title: 'Updated Curry'});

            expect(res.statusCode).toBe(200);
            expect(res.body.cook_time).toBe(50);
            expect(res.body.title).toBe('Updated Curry');
            expect(res.body.prep_time).toBe(target.prep_time); // unchanged
        });

        it('returns 404 for an unknown id', async () => {
            const res = await request(app).put('/recipes/999999').send({title: 'No Recipe'});
            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /recipes/:id', () => {
        it('deletes a recipe and confirms it is gone', async () => {
            // create disposable recipe first
            const {rows: [temp]} = await getPool().query(
                `INSERT INTO recipes (creator_id, title, description)
                 VALUES ($1, 'ToRemove', 'bye')
                 RETURNING *`,
                [testUser.user_id]
            );

            // delete
            const del = await request(app).delete(`/recipes/${temp.recipe_id}`);
            expect(del.statusCode).toBe(200);

            // verify 404 afterwards
            const verify = await request(app).get(`/recipes/${temp.recipe_id}`);
            expect(verify.statusCode).toBe(404);
        });

        it('returns 404 when trying to delete an id that never existed', async () => {
            const res = await request(app).delete('/recipes/999999');
            expect(res.statusCode).toBe(404);
        });
    });
});
