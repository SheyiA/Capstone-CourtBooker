const express = require("express");
const router = express.Router();

// check in route
router.post("/checkin", (req, res) => {
  console.log("checkin route hit");
  res.json({ message: "checkin working" });
});

// check out route
router.post("/checkout", (req, res) => {
  console.log("checkout route hit");
  res.json({ message: "checkout working" });
});

// court status route
router.get("/court/:id/status", (req, res) => {
  const courtId = req.params.id;

  res.json({
    court: courtId,
    activePlayers: 0,
  });
});

module.exports = router;
