const cacheMiddleware = (options) => {
  return (req, res, next) => {
    // Set Cache-Control header based on options
    res.set("Cache-Control", `${options}`);
    console.log(`[Cache] Cache-Control set to ${options}`);
    next(); // Move to the next middleware or route handler
  };
};

module.exports = cacheMiddleware;
