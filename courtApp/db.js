require("dotenv").config(); // Load environment variables from .env file

const { Pool } = require("pg");

// Connection parameters
const pool = new Pool({
  user: process.env.DB_USER, // your PostgreSQL username
  host: process.env.DB_HOST, // your database host
  database: process.env.DB_NAME, // your database name
  password: process.env.DB_PASSWORD, // your password
  port: process.env.DB_PORT, // default PostgreSQL port
});

// Optional: Test the connection when the pool is created
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database", err);
    return;
  }
  console.log("Connected to the PostgreSQL database successfully!");
  done(); // Release the client back to the pool immediately if just testing the connection
});

module.exports = pool;
