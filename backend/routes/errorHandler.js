const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

module.exports = (req, res, err) => {
  logger.error(`Error 404: Route Not Found`);

  res.status(404).json({
    message: "Route not found",
    error: "404 - Not Found",
  });
};
