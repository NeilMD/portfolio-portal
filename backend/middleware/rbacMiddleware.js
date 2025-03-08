const jwt = require("jsonwebtoken");

module.exports = ({ utils, logger, process }) => {
  return (req, res, next) => {
    logger.info("authMiddleware: START");

    let objResult = utils.responseUtil();
    const token = req.header("Authorization");

    if (!token) {
      objResult.numCode = 1;
      objResult.objError = "Please Login.";
    }
    if (objResult.numCode === 0) {
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
      req.userId = decoded.userId;
    }

    logger.info("authMiddleware: END");
    if (objResult.numCode == 0) {
      next();
    } else {
      return res.status(201).json({
        message: objResult.objError,
      });
    }
  };
};
