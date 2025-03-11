module.exports = ({ logger, rateLimit, utils }) => {
  // Create rate limiter once at the middleware level
  const accountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 5, // Limit each account to 5 login attempts per windowMs
    keyGenerator: (req) => req.body.username, // Use username as the key

    // Custom handler to manage rate limit violations
    handler: (req, res, next) => {
      // Log the rate limit violation
      logger.error(`Rate limit exceeded for user: ${req.body.username}`);

      // Prepare response
      let objResult = utils.responseUtil();
      objResult.numCode = 1;
      objResult.objError =
        "Too many login attempts from this account, please try again later.";

      // Send the response with 429 status code
      res.status(429).json(objResult); // Use 429 status code for rate limit errors
    },
  });

  // This is the main middleware function to wrap the rate limiter
  return (req, res, next) => {
    logger.info("rateLimiterMiddleware: START");

    // Apply the rate limiter here
    accountLimiter(req, res, next);

    // Continue with the next middleware or route handler
    logger.info("rateLimiterMiddleware: END");
  };
};
