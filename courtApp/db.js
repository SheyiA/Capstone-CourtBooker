/*
Name: Sheyi Adepoju
Description: This db filder to open the connection process to connect the data base with the api this is necessary for the backend communication. I created the database with pgAdmin and later made a connection on render to be able to host the database on the cloud to have access constantly to satisfy the MVP
*/

require("dotenv").config(); // Load environment variables from .env file

const { Pool } = require("pg");

// Connection parameters
const pool = new Pool({
    // user: process.env.DB_USER, // your PostgreSQL username
    // host: process.env.DB_HOST, // your database host
    // database: process.env.DB_NAME, // your database name
    // password: process.env.DB_PASSWORD, // your password
    // port: process.env.DB_PORT, // default PostgreSQL port
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // This is necessary for some hosting providers like Heroku
    },
});

// Test the connection when the pool is created
// pool.connect((err, client, done) => {
//     if (err) {
//         console.error("Error connecting to the database", err);
//         return;
//     }
//     console.log("Connected to the PostgreSQL database successfully!");
//     done(); 

// Release the client back to the pool immediately if just testing the connection
//});
console.log("DATABASE_URL:", process.env.DATABASE_URL);
module.exports = pool;