const { Pool } = require("pg");

// Load environment variables (optional, but recommended)
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://your_username:your_password@your_neon_host/dbname",
  ssl: {
    rejectUnauthorized: false, // Required for Neon DB
  },
});

module.exports = pool;
