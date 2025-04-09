module.exports = ({ logger, validator }) => {
  return (req, res, next) => {
    logger.info("Auth Middleware: START");

    let errMsg = null;
    if (req.originalUrl === "/api/auth/login") {
      errMsg = validator.authValidator.login(req.body);
    } else if (req.originalUrl === "/api/auth/signup") {
      errMsg = validator.authValidator.signup(req.body);
    }

    const { error } = errMsg;
    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });
    }

    logger.info("Auth Middleware: END");
    next();
  };
};
