// routes/users.js
const express = require("express");
const router = express.Router();
// define route for homepage
router.get("/", (req, res) => {
  res.send("User Home page");
});

// route for specicific user
router.get("/:id", (req, res) => {
  res.send(`User requested: ${req.params.id}`);
});
// export router
module.exports = router;
