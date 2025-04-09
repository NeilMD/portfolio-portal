module.exports = ({
  logger,
  cacheMiddleware,
  profileMiddleware,
  controller,
  router,
}) => {
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

  // GET Retrieves the profile information (bio, skills, social links, etc.).
  router.post(
    "/profile/get",
    profileMiddleware,
    controller.UserController.profileGet
  );

  // POST Updates the user’s profile information (bio, skills, technologies, etc.).
  router.post(
    "/profile/edit/",
    profileMiddleware,
    controller.UserController.profileEdit
  );

  return router;
};
