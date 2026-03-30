/*
Name: Sheyi Adepoju 
Description: This file names server.js is intended to handle the server and necessary routes. This will connect to local host for testing the afterwards it will connect to the necessary server for public production (Render server) for hosting. 
*/
// require express 
const express = require("express");
// require cors for browser to talk to api
const cors = require("cors");
// connect to db folder 
const pool = require("./db");
// express 
const app = express();
// use this for local host or enviornment variable 
const PORT = process.env.PORT || 3000;

// use cors and express start
app.use(cors());
app.use(express.json());

// ROUTES --------------- 
// check in route 
app.post("/checkin", async(req, res) => {
    // check in path
    const { court_id } = req.body; // court id is request body
    // try catch for db query to get all sessions where court id and status are active 
    try {
        const active = await pool.query(
            `SELECT * FROM sessions
       WHERE court_id = $1
       AND status = 'active'
       AND start_time > NOW() - INTERVAL '30 minutes'
       LIMIT 1`, [court_id]
        );
        // if active court rows are greater than 0 then need to return message that court is in use 
        if (active.rows.length > 0) {
            return res.status(400).json({
                error: "Court already in use"
            });
        }
        // query result to add to the sessions table the court id start time and status 
        const result = await pool.query(
            `INSERT INTO sessions (court_id, start_time, status)
       VALUES ($1, NOW(), 'active')
       RETURNING *`, [court_id]
        );
        // successful court sign in message 
        res.json({
            message: "Check-in successful",
            session: result.rows[0]
        });

    } catch (err) {
        // error for the db if there are database query issues
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


// court status 
app.get("/court/:id/status", async(req, res) => {
    const courtId = req.params.id; // courtId get from request 
    //console.log("STATUS HIT FOR COURT:", courtId);
    // try catch 
    try {
        // result query to select all active players from sessions where status is active and not null and valid time. 
        const result = await pool.query(
            `SELECT COUNT(*)::int AS active_players
             FROM sessions
             WHERE court_id = $1
             AND status = 'active'
             AND start_time IS NOT NULL
             AND start_time > NOW() - INTERVAL '30 minutes'`, [courtId]
        );
        // count variable 
        let count = 0;
        // if resultrow and row length is greater than 0 count active players
        if (result.rows && result.rows.length > 0) {
            count = parseInt(result.rows[0].active_players);
        }
        // response of court id and count for api 
        res.json({
            court_id: courtId,
            active_players: count
        });
        // db error 
    } catch (err) {
        console.error("STATUS ROUTE DB ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});
// courts route
app.get("/courts", async(req, res) => {
    // simple query to select all from the courts to see
    const result = await pool.query("SELECT * FROM courts ORDER BY id");
    res.json(result.rows);
    // creates rows json 
});


// Checkout route 
app.post("/checkout", async(req, res) => {
    const { court_id } = req.body;
    // query to checkout up date the sessions to complete a session 
    const result = await pool.query(
        `UPDATE sessions
     SET end_time = CURRENT_TIMESTAMP,
         status = 'completed'
     WHERE id = (
        SELECT id FROM sessions
        WHERE court_id = $1
        AND status = 'active'
        ORDER BY start_time ASC
        LIMIT 1
     )
     RETURNING *`, [court_id]
    );
    // sucess message 
    res.json({ message: "Checkout successful" });
});



app.get("/admin/analytics", async(req, res) => {
    try {

        // total active players right now 
        const activePlayersResult = await pool.query(`
      SELECT COUNT(*) AS total_active_players
      FROM sessions
      WHERE status = 'active'
      AND start_time > NOW() - INTERVAL '30 minutes'
    `);

        // total sessions created today
        const sessionsTodayResult = await pool.query(`
      SELECT COUNT(*) AS sessions_today
      FROM sessions
      WHERE DATE(start_time) = CURRENT_DATE
    `);

        // busiest court today 
        const busiestCourtResult = await pool.query(`
      SELECT courts.name, COUNT(sessions.id) AS session_count
      FROM sessions
      JOIN courts ON courts.id = sessions.court_id
      WHERE DATE(sessions.start_time) = CURRENT_DATE
      GROUP BY courts.name
      ORDER BY session_count DESC
      LIMIT 1
    `);

        // usage ranking for all courts
        const usageRankingResult = await pool.query(`
      SELECT courts.name, COUNT(sessions.id) AS session_count
      FROM sessions
      JOIN courts ON courts.id = sessions.court_id
      GROUP BY courts.name
      ORDER BY session_count DESC
    `);

        res.json({
            total_active_players: parseInt(activePlayersResult.rows[0].total_active_players),
            sessions_today: parseInt(sessionsTodayResult.rows[0].sessions_today),
            busiest_court: busiestCourtResult.rows[0] || null,
            court_usage: usageRankingResult.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Analytics query failed" });
    }
});

app.get("/analytics/usage", async(req, res) => {
    // query to check all sessions from the usage logs 
    const result = await pool.query(`
    SELECT 
      TO_CHAR(checkin_time, 'HH24:MI') as time,
      COUNT(*) as sessions
    FROM usage_logs
    GROUP BY time
    ORDER BY MIN(checkin_time)
    LIMIT 20
  `);

    res.json(result.rows);
});


//  START SERVER LAST 

// port to listen to and run 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});