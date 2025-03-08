module.exports = ({ cacheMiddleware, controller, router }) => {
  // GET Fetches all projects of a specific user.
  router.get(
    "/user/:userId",
    cacheMiddleware(`public, max-age=300, stale-while-revalidate=60`),
    //(cached for 5 minutes, with an additional 1 minute for background revalidation)
    () => {}
  );

  // GET Retrieves detailed information about a specific project.
  router.get(
    "/:userId/:projectId",
    cacheMiddleware(`public, max-age=600, stale-while-revalidate=120`),
    //(cached for 10 minutes, with a 2-minute revalidation window)
    () => {}
  );

  // POST Adds a new project (project description, tech stack, demo links, GitHub repository).
  router.post("/add", () => {});

  // POST Adds media (images/videos) to a specific project.
  router.post("/media/:userId/:projectId", () => {});

  // GET Adds media (images/videos) to a specific project.
  router.get(
    "/media/:userId/:projectId/:media",
    cacheMiddleware(`public, max-age=31536000`), // Cache for 1 year for media files
    () => {}
  );

  return router;
};
