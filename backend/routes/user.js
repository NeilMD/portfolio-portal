const express = require("express");
const router = express.Router();
const cacheMiddleware = require("../middleware/cacheMiddleware");

const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

// Load Dummy Data
const dummyUsers = require("../data/users");

// GET Retrieves the profile information (bio, skills, social links, etc.).
router.get(
  "/profile/:userId",
  cacheMiddleware(`public, max-age=300`), // 5 minutes for profile
  (req, res) => {
    logger.info("Begin");
    res.json(
      dummyUsers.find((user) => {
        return user.id == req.params.userId;
      })
    );
    logger.info("End");
  }
);

// POST Creates the user’s profile information (bio, skills, technologies, etc.).
router.post("/profile/add", () => {});

// POST Updates the user’s profile information (bio, skills, technologies, etc.).
router.post("/profile/edit/", () => {});

// GET Fetches a list of users (for browsing developers’ portfolios).
router.get(
  "/",
  cacheMiddleware(`public, max-age=600`), // 10 minutes for the list of users
  (req, res) => {
    res.json(
      dummyUsers.find((user) => {
        return user.id == req.params.userId;
      })
    );
  }
);

module.exports = router;
