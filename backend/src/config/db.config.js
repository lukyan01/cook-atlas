require('dotenv').config();
const {Pool} = require('pg');

// Database configuration settings
const dbConfig = {
    development: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    },
    test: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.TEST_DB_NAME || 'cookatlas_test',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    },
    production: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: {
            rejectUnauthorized: false // Only use in production with proper SSL setup
        }
    }
};

// Get config based on current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = dbConfig[env];

let pool = null;
let initialized = false;

// Initialize the pool on demand, not immediately on module load
function getPool() {
    if (!initialized) {
        if (process.env.NODE_ENV !== 'test') {
            console.log(`Using database '${currentConfig.database}' in ${env} mode`);
        }

        try {
            pool = new Pool(currentConfig);

            // Add event listener for connection errors
            pool.on('error', (err) => {
                const isTerminationError = err.code === '57P01' && // terminating connection due to administrator command
                    process.env.NODE_ENV === 'test';

                if (!isTerminationError) {
                    console.error('Unexpected database error:', err);
                }
            });

            initialized = true;
        } catch (error) {
            console.error('Failed to create database pool:', error.message);
            // In production, you might want to fail hard here with process.exit(1)
            throw error;
        }
    }

    return pool;
}

// Close the pool and reset initialized state
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
        initialized = false;
    }
}

// Test the connection without blocking module initialization
async function testConnection() {
    try {
        const client = await getPool().connect();
        await client.query('SELECT NOW()');
        client.release();
        if (process.env.NODE_ENV !== 'test') {
            console.log(`Successfully connected to database: ${currentConfig.database}`);
        }
        return true;
    } catch (err) {
        if (process.env.NODE_ENV !== 'test') {
            console.warn('Database connection error:', err.message);
        }
        return false;
    }
}

module.exports = {
    getPool,
    closePool,
    config: currentConfig
};