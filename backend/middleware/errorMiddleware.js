const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

const errorMiddleware = (err, req, res, next) => {
  logger.info("Error Middleware");
  logger.error(err);
  res.status(500).json({ message: err.message });
};

module.exports = errorMiddleware;
