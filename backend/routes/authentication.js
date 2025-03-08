module.exports = ({ controller, router }) => {
  // POST Registers a new user.
  router.post("/signup", controller.AuthController.signup);

  // POST Logs in an existing user and provides an authentication token.
  router.post("/login", controller.AuthController.login);

  // POST Logs out the user and invalidates the session.
  router.post("/logout", controller.AuthController.login);

  // POST Retrieves the currently authenticated user’s details.
  router.post("/verify", () => {});

  return router;
};
