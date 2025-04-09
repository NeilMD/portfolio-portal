module.exports = ({
  controller,
  rateLimitMiddleware,
  authMiddleware,
  router,
  passport,
}) => {
  // POST Registers a new user.
  router.post("/signup", authMiddleware, controller.AuthController.signup);

  // POST Logs in an existing user and provides an authentication token.
  router.post(
    "/login",
    [rateLimitMiddleware, authMiddleware],
    controller.AuthController.login
  );

  // GET Login using google.
  router.get("/login/google", controller.AuthController.loginGoogle);

  // GET Google Login callback.
  router.get(
    "/login/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    controller.AuthController.googleCallback
  );

  // POST Logs out the user and invalidates the session.
  router.post("/logout", controller.AuthController.logout);

  // POST Refresh access token.
  router.post("/refresh", controller.AuthController.refresh);

  return router;
};
