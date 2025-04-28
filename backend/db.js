const { Pool } = require('pg');
const path = require('path');

// Load environment variables from the appropriate .env file
require('dotenv').config({
  path: process.env.NODE_ENV === 'test'
      ? path.resolve(__dirname, '.env.test')
      : path.resolve(__dirname, '.env')
});

// Log for debugging (remove in production)
console.log('Using database:', process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;