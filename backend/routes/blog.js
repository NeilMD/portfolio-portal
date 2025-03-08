module.exports = ({ controller, router, cacheMiddleware, logger }) => {
  // Get Retrieves all blog posts by a specific user.
  router.get(
    "/user/:userId",
    cacheMiddleware(`public, max-age=300, stale-while-revalidate=60`),
    // (cached for 5 minutes, with an additional 1 minute for background revalidation).
    (req, res) => {
      logger.info(req);
      logger.info("Blog/:userID : START");
    }
  );

  // GET Retrieves a single blog post in detail.
  router.get(
    "/:userId/:blogId",
    cacheMiddleware(`public, max-age=300, stale-while-revalidate=60`),
    // (cached for 10 minutes, with a 2-minute revalidation window).
    () => {
      logger.info("Blog/:userId/:blogId : START");
    }
  );

  // POST Creates a new blog post (title, content, tags).
  router.post("/add", () => {});
  return router;
};
