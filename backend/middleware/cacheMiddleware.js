const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

const cacheMiddleware = (options) => {
  logger.info("Cache Middleware");
  return (req, res, next) => {
    // Set Cache-Control header based on options
    res.set("Cache-Control", `${options}`);
    logger.info(`[Cache] Cache-Control set to ${options}`);

    next(); // Move to the next middleware or route handler
  };
};

module.exports = cacheMiddleware;
