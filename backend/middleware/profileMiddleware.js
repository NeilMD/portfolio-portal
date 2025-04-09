module.exports = ({ logger, validator }) => {
  return (req, res, next) => {
    logger.info("Profile Middleware: START");

    let errMsg = null;
    if (req.originalUrl === "/api/user/profile/get") {
      errMsg = validator.profileValidator.get(req.body);
    } else if (req.originalUrl === "/api/user/profile/edit") {
      errMsg = validator.profileValidator.edit(req.body);
    }

    const { error } = errMsg;
    if (error) {
      return res
        .status(400)
        .json({ errors: error.details.map((err) => err.message) });
    }

    logger.info("Profile Middleware: END");
    next();
  };
};
