module.exports = (logger, router, controller, cacheMiddleware) => {
  // GET Fetches all contact messages.
  router.get("/messages", () => {});

  // POST Submits a new contact message or inquiry (name, email, message).
  router.post("/messages", () => {});
};
