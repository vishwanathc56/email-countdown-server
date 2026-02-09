const express = require("express");
const router = express.Router();
const { createTimer } = require("../controllers/timerController");

// POST /api/timers
router.post("/", createTimer);

module.exports = router;
