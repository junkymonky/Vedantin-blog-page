const pool = require("./db");

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to Neon DB! Current time:", res.rows[0].now);
  } catch (err) {
    console.error("Database connection error:", err);
  } finally {
    pool.end();
  }
}

testConnection();
