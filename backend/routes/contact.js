module.exports = (logger, cacheMiddleware, router, controller) => {
  // GET Fetches all contact messages.
  router.get("/messages", () => {});

  // POST Submits a new contact message or inquiry (name, email, message).
  router.post("/messages", () => {});

  return router;
};
