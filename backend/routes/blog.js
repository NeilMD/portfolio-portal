const express = require("express");
const router = express.Router();

// Get Retrieves all blog posts by a specific user.
router.get("/:userId", () => {});

// GET Retrieves a single blog post in detail.
router.get("/:userId/:blogId", () => {});

// POST Creates a new blog post (title, content, tags).
router.post("/add", () => {});

module.exports = router;
