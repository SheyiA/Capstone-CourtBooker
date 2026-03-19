const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
const pool = require("./db");

const cors = require("cors");
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // db connection test
    pool.query("SELECT * FROM courts", (err, result) => {
        if (err) {
            console.log("DB ERROR", err);
        } else {
            console.log("DB CONNECTED SUCCESS");
            console.log(result.rows);
        }
    });
    // test adding into sessions
    pool.query(
        "INSERT INTO sessions (court_id) VALUES ($1) RETURNING *", [1],
        (err, result) => {
            if (err) {
                console.log("INSERT ERROR:", err);
            } else {
                console.log("SESSION CREATED:");
                console.log(result.rows);
            }
        },
    );
});

// api route
// app.post("/checkin", (req, res) => {
//   const courtId = req.body.court_id;
//   pool.query(
//     "INSERT INTO sessions (court_id) VALUES ($1) RETURNING *",
//     [courtId],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).json({ error: "Database error" });
//       } else {
//         res.json({
//           message: "Check-in successful",
//           session: result.rows[0],
//         });
//       }
//     },
//   );
// });

app.post("/checkin", (req, res) => {
    console.log("BODY:", req.body);

    const courtId = req.body.court_id;

    pool.query(
        "INSERT INTO sessions (court_id) VALUES ($1) RETURNING *", [courtId],
        (err, result) => {
            if (err) {
                console.log("DB ERROR:", err);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Check-in successful",
                session: result.rows[0],
            });
        },
    );
});

// count person route
app.get("/court/:id/status", (req, res) => {
    const courtId = req.params.id;

    pool.query(
        "SELECT COUNT(*) FROM sessions WHERE court_id = $1 AND status = 'active'", [courtId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({
                court_id: courtId,
                active_players: result.rows[0].count,
            });
        },
    );
});

// checkout or leave court
app.post("/checkout", (req, res) => {
    const courtId = req.body.court_id;

    pool.query(
        `
        UPDATE sessions
        SET end_time = CURRENT_TIMESTAMP,
            status = 'completed'
        WHERE id = (
            SELECT id FROM sessions
            WHERE court_id = $1
            AND status = 'active'
            ORDER BY start_time ASC
            LIMIT 1
        )
        RETURNING *
        `, [courtId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (result.rows.length === 0) {
                return res.json({ message: "No active session found" });
            }

            res.json({
                message: "Checkout successful",
                session: result.rows[0],
            });
        },
    );
});