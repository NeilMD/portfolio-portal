const express = require("express");
const router = express.Router();

// GET Fetches all contact messages.
router.get("/messages", () => {});

// POST Submits a new contact message or inquiry (name, email, message).
router.post("/messages", () => {});

module.exports = router;
