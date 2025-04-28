const {Pool} = require('pg');
const {config, closePool} = require('../config/db.config');

// Create a special admin connection to postgres DB for creating/dropping test databases
const adminConfig = {
    user: config.user,
    host: config.host,
    database: 'postgres', // Connect to default postgres database
    password: config.password,
    port: config.port
};

// Initialize admin pool only when needed
let adminPool = null;
const testDbName = config.database;

function getAdminPool() {
    if (!adminPool) {
        adminPool = new Pool(adminConfig);
    }
    return adminPool;
}

async function closeAdminPool() {
    if (adminPool) {
        await adminPool.end();
        adminPool = null;
    }
}

// Function to create the test database
async function createTestDb() {
    try {
        // Close any existing connections from the main pool
        await closePool();

        const pool = getAdminPool();

        // Check if the test database already exists
        const checkResult = await pool.query(
            `SELECT 1
             FROM pg_database
             WHERE datname = $1`,
            [testDbName]
        );

        // If it exists, drop it first
        if (checkResult.rows.length > 0) {
            try {
                // Disconnect all active connections first
                await pool.query(`
                    SELECT pg_terminate_backend(pg_stat_activity.pid)
                    FROM pg_stat_activity
                    WHERE pg_stat_activity.datname = $1
                      AND pid <> pg_backend_pid()
                `, [testDbName]);
            } catch (terminateError) {
                // Continue even if this fails
            }

            await pool.query(`DROP DATABASE IF EXISTS ${testDbName} WITH (FORCE)`);
        }

        // Create a fresh test database
        console.log(`Creating test database '${testDbName}'...`);
        await pool.query(`CREATE DATABASE ${testDbName}`);

        // Connect to the new test database to create schema
        const testDb = new Pool({
            ...config,
            database: testDbName
        });

        console.log('Setting up test database schema...');

        // Create users table
        await testDb.query(`
            CREATE TABLE users
            (
                user_id    SERIAL PRIMARY KEY,
                username   VARCHAR(100) NOT NULL UNIQUE,
                email      VARCHAR(255) NOT NULL UNIQUE,
                password   VARCHAR(255) NOT NULL,
                role       VARCHAR(50)  NOT NULL DEFAULT 'Registered User',
                created_at TIMESTAMP             DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create recipes table
        await testDb.query(`
            CREATE TABLE recipes
            (
                recipe_id       SERIAL PRIMARY KEY,
                creator_id      INTEGER REFERENCES users (user_id),
                title           VARCHAR(255) NOT NULL,
                description     TEXT         NOT NULL,
                cook_time       INTEGER,
                prep_time       INTEGER,
                skill_level     VARCHAR(50),
                source_platform VARCHAR(100),
                source_url      VARCHAR(255),
                image_url       VARCHAR(255),
                instructions_md TEXT,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create bookmark table
        await testDb.query(`
            CREATE TABLE bookmark
            (
                bookmark_id SERIAL PRIMARY KEY,
                user_id     INTEGER NOT NULL REFERENCES users (user_id),
                recipe_id   INTEGER NOT NULL REFERENCES recipes (recipe_id),
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, recipe_id)
            )
        `);

        console.log('Test database setup complete');
        await testDb.end();

        return true;
    } catch (error) {
        console.error('Error setting up test database:', error);
        throw error;
    }
}

// Function to drop the test database
async function dropTestDb() {
    try {
        // Close any existing connections from the main pool
        await closePool();

        const pool = getAdminPool();

        console.log(`Dropping test database '${testDbName}'...`);

        // Disconnect all active connections first
        try {
            await pool.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = $1
                  AND pid <> pg_backend_pid()
            `, [testDbName]);
        } catch (terminateError) {
            // Continue even if this fails
        }

        await pool.query(`DROP DATABASE IF EXISTS ${testDbName} WITH (FORCE)`);
        console.log('Test database dropped');

        return true;
    } catch (error) {
        console.error('Error dropping test database:', error);
        throw error;
    } finally {
        try {
            await closeAdminPool();
        } catch (endError) {
            // Ignore errors when closing admin pool
        }
    }
}

module.exports = {
    createTestDb,
    dropTestDb
};