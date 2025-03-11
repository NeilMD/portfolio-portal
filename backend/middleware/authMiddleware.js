const jwt = require("jsonwebtoken");

module.exports = ({ utils, logger, process, asyncHandler }) => {
  return (req, res, next) => {
    logger.info("authMiddleware: START");

    let objResult = utils.responseUtil();
    const token = req.header("Authorization");

    if (!token) {
      objResult.numCode = 1;
      objResult.objError = "Please Login.";
    }

    if (objResult.numCode === 0) {
      const decoded = utils.tc(async () => {
        await jwt.verify(
          token,
          process.env.SECRET_ACCESS_TOKEN,
          (err, decoded) => {
            logger.warn("Entered");
            return false;
          }
        );
      });

      if (decoded) {
        req.user.userId = decoded.userId;
        req.user.role = decoded.role;
      } else {
        objResult.numCode = 1;
        objResult.objError = "Invalid JWT Token";
      }
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
