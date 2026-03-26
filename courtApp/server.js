const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
// CHECKIN
app.post("/checkin", async(req, res) => {
    const { court_id } = req.body;

    try {
        const active = await pool.query(
            `SELECT * FROM sessions
       WHERE court_id = $1
       AND status = 'active'
       AND start_time > NOW() - INTERVAL '30 minutes'
       LIMIT 1`, [court_id]
        );

        if (active.rows.length > 0) {
            return res.status(400).json({
                error: "Court already in use"
            });
        }

        const result = await pool.query(
            `INSERT INTO sessions (court_id, start_time, status)
       VALUES ($1, NOW(), 'active')
       RETURNING *`, [court_id]
        );

        res.json({
            message: "Check-in successful",
            session: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


// STATUS
app.get("/court/:id/status", async(req, res) => {
    const courtId = req.params.id;
    // console.log("STATUS HIT FOR COURT:", req.params.id);
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS active_players
       FROM sessions
       WHERE court_id = $1
       AND status = 'active'
       AND start_time > NOW() - INTERVAL '30 minutes'`, [courtId]
        );

        res.json({
            court_id: courtId,
            active_players: parseInt(result.rows[0].active_players)
        });

    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});


// COURTS
app.get("/courts", async(req, res) => {
    const result = await pool.query("SELECT * FROM courts ORDER BY id");
    res.json(result.rows);
});


// CHECKOUT
app.post("/checkout", async(req, res) => {
    const { court_id } = req.body;

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

    res.json({ message: "Checkout successful" });
});



app.get("/admin/analytics", async(req, res) => {
    try {

        // ⭐ total active players right now (within 30 min window)
        const activePlayersResult = await pool.query(`
      SELECT COUNT(*) AS total_active_players
      FROM sessions
      WHERE status = 'active'
      AND start_time > NOW() - INTERVAL '30 minutes'
    `);

        // ⭐ total sessions created today
        const sessionsTodayResult = await pool.query(`
      SELECT COUNT(*) AS sessions_today
      FROM sessions
      WHERE DATE(start_time) = CURRENT_DATE
    `);

        // ⭐ busiest court today (most sessions)
        const busiestCourtResult = await pool.query(`
      SELECT courts.name, COUNT(sessions.id) AS session_count
      FROM sessions
      JOIN courts ON courts.id = sessions.court_id
      WHERE DATE(sessions.start_time) = CURRENT_DATE
      GROUP BY courts.name
      ORDER BY session_count DESC
      LIMIT 1
    `);

        // ⭐ usage ranking for all courts
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


/* ================= START SERVER LAST ================= */


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});