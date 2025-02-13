const express = require("express");
const router = express.Router();

// GET Fetches all projects of a specific user.
router.get("/:userId", () => {});

// GET Retrieves detailed information about a specific project.
router.get("/:userId/:projectId", () => {});

// POST Adds a new project (project description, tech stack, demo links, GitHub repository).
router.post("/add", () => {});

// POST Adds media (images/videos) to a specific project.
router.post("/media/:userId/:projectId", () => {});

module.exports = router;
