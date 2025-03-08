const errorMiddleware = ({ logger }) => {
  return (err, req, res, next) => {
    logger.info("Error Middleware: START");
    logger.error(err);

    logger.info("Error Middleware: END");
    res.status(500).json({ message: err.message });
  };
};

module.exports = errorMiddleware;
