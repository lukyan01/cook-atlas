const app = require('../index');
const pool = require('../db');

// Global setup before all tests
beforeAll(async () => {
    // Any setup code that should run before all tests
});

// Global teardown after all tests
afterAll(async () => {
    // Close the database pool after all tests
    await pool.end();
});

module.exports = app;
