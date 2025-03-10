const jwt = require("jsonwebtoken");

module.exports = ({ utils, logger, process }) => {
  return (req, res, next) => {
    logger.info("rbacMiddleware: START");

    let objResult = utils.responseUtil();

    logger.info("rbacMiddleware: END");
    if (objResult.numCode == 0) {
      next();
    } else {
      return res.status(201).json({
        message: objResult.objError,
      });
    }
  };
};
