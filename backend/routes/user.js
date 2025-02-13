const express = require("express");
const router = express.Router();

// GET Retrieves the profile information (bio, skills, social links, etc.).
router.get("/profile/:userId", () => {});

// POST Creates the user’s profile information (bio, skills, technologies, etc.).
router.post("/profile/add", () => {});

// POST Updates the user’s profile information (bio, skills, technologies, etc.).
router.post("/profile/edit/", () => {});

// GET Fetches a list of users (for browsing developers’ portfolios).
router.get("/", () => {});

module.exports = router;
