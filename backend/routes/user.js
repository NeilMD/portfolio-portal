const express = require("express");
const router = express.Router();
const cacheMiddleware = require("../middleware/cacheMiddleware");

// GET Retrieves the profile information (bio, skills, social links, etc.).
router.get(
  "/profile/:userId",
  cacheMiddleware(`public, max-age=300`), // 5 minutes for profile
  () => {}
);

// POST Creates the user’s profile information (bio, skills, technologies, etc.).
router.post("/profile/add", () => {});

// POST Updates the user’s profile information (bio, skills, technologies, etc.).
router.post(
  "/profile/edit/",
  cacheMiddleware(`public, max-age=600`), // 10 minutes for the list of users
  () => {}
);

// GET Fetches a list of users (for browsing developers’ portfolios).
router.get("/", () => {});

module.exports = router;
