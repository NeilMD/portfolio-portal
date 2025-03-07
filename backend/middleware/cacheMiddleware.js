const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

const cacheMiddleware = (options) => {
  return (req, res, next) => {
    logger.info("CacheMiddleWare: START");
    // Set Cache-Control header based on options
    res.set("Cache-Control", `${options}`);
    logger.info(`[Cache] Cache-Control set to ${options}`);

    next();
    logger.info("CacheMiddleWare: END");
  };
};

module.exports = cacheMiddleware;
