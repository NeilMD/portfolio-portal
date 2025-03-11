const urlLogging = ({ logger }) => {
  return (req, res, next) => {
    logger.info(``);
    logger.info(``);
    logger.info(`REQUEST URL: ${req.originalUrl}`);
    logger.info(`REQUEST METHOD: ${req.method}`);

    next();
  };
};

module.exports = urlLogging;
