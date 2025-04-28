const request = require('supertest');
const app = require('./setupTests');
const pool = require('../db');

describe('Authentication API', () => {
    let testUser;

    // Setup test data
    beforeAll(async () => {
        // Clear test users if they exist
        await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    });

    afterAll(async () => {
        // Clean up
        await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
        await pool.query('DELETE FROM users WHERE email = $1', ['testupdated@example.com']);
    });

    describe('POST /auth/register', () => {
        it('should register a new user with valid data', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'Registered User'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('user_id');
            expect(res.body).toHaveProperty('username', 'testuser');
            expect(res.body).toHaveProperty('email', 'test@example.com');
            expect(res.body).toHaveProperty('role', 'Registered User');

            testUser = res.body;
        });

        it('should reject registration with duplicate email', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'Registered User'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Email already in use');
        });

        it('should reject registration with duplicate username', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test2@example.com',
                    password: 'password123',
                    role: 'Registered User'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Username already in use');
        });

        it('should reject registration with missing required fields', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    email: 'missing@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });

    describe('POST /auth/login', () => {
        it('should authenticate user with valid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('user_id');
            expect(res.body).toHaveProperty('username', 'testuser');
            expect(res.body).toHaveProperty('email', 'test@example.com');
        });

        it('should reject login with invalid password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Invalid credentials');
        });

        it('should reject login with non-existent email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Invalid credentials');
        });

        it('should reject login with missing fields', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required');
        });
    });

    describe('GET /users/:id', () => {
        it('should get user profile by ID', async () => {
            const res = await request(app)
                .get(`/users/${testUser.user_id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('user_id', testUser.user_id);
            expect(res.body).toHaveProperty('username', 'testuser');
            expect(res.body).not.toHaveProperty('password'); // Password should not be returned
        });

        it('should return 404 for non-existent user ID', async () => {
            const res = await request(app)
                .get('/users/9999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('User not found');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user profile with valid data', async () => {
            const res = await request(app)
                .put(`/users/${testUser.user_id}`)
                .send({
                    username: 'testuserupdated',
                    email: 'testupdated@example.com'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('username', 'testuserupdated');
            expect(res.body).toHaveProperty('email', 'testupdated@example.com');
        });

        it('should allow partial updates', async () => {
            const res = await request(app)
                .put(`/users/${testUser.user_id}`)
                .send({
                    username: 'testuserfinal'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('username', 'testuserfinal');
            expect(res.body).toHaveProperty('email', 'testupdated@example.com');
        });

        it('should return 404 for non-existent user ID', async () => {
            const res = await request(app)
                .put('/users/9999')
                .send({
                    username: 'nonexistentuser'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('User not found');
        });
    });
});