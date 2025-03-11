module.exports = ({ controller, router, passport }) => {
  // POST Registers a new user.
  router.post("/signup", controller.AuthController.signup);

  // POST Logs in an existing user and provides an authentication token.
  router.post("/login", controller.AuthController.login);

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
  router.post("/logout", controller.AuthController.login);

  // POST Refresh access token.
  router.post("/refresh", controller.AuthController.refresh);

  return router;
};
