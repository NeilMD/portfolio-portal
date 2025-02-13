const express = require("express");
const router = express.Router();
const cacheMiddleware = require("../middleware/cacheMiddleware");

// Get Retrieves all blog posts by a specific user.
router.get(
  "/:userId",
  cacheMiddleware(`public, max-age=300, stale-while-revalidate=60`),
  // (cached for 5 minutes, with an additional 1 minute for background revalidation).
  () => {}
);

// GET Retrieves a single blog post in detail.
router.get(
  "/:userId/:blogId",
  cacheMiddleware(`public, max-age=300, stale-while-revalidate=60`),
  // (cached for 10 minutes, with a 2-minute revalidation window).
  () => {}
);

// POST Creates a new blog post (title, content, tags).
router.post("/add", () => {});

module.exports = router;
