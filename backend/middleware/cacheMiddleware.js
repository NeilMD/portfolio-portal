const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

const cacheMiddleware = (options) => {
  return (req, res, next) => {
    logger.info("CacheMiddleWare: START");
    // Set Cache-Control header based on options
    res.set("Cache-Control", `${options}`);
    logger.info(`[Cache] Cache-Control set to ${options}`);

    logger.info("CacheMiddleWare: END");
    next(); // Move to the next middleware or route handler
  };
};

module.exports = cacheMiddleware;
