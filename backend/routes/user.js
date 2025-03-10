module.exports = ({
  logger,
  cacheMiddleware,
  controller,
  authMiddleware,
  router,
}) => {
  // GET Retrieves the profile information (bio, skills, social links, etc.).
  router.get(
    "/profile/:userId",
    cacheMiddleware(`public, max-age=300`), // 5 minutes for profile
    (req, res) => {
      logger.info("Begin");

      logger.info("End");
    }
  );

  // GET Fetches a list of users (for browsing developers’ portfolios).
  router.get(
    "/",
    cacheMiddleware(`public, max-age=600`), // 10 minutes for the list of users
    (req, res) => {
      res.json();
    }
  );

  // POST Creates the user’s profile information (bio, skills, technologies, etc.).
  router.post("/profile/add", () => {});

  // POST Updates the user’s profile information (bio, skills, technologies, etc.).
  router.post(
    "/profile/edit/",
    authMiddleware,
    controller.UserController.profileEdit
  );

  return router;
};
