const bcrypt = require("bcryptjs");

module.exports = (config, models, logger) => {
  let authController = Object.create({});
  let User = models.User;

  authController.signup = (req, res) => {
    logger.info("AuthController/signup: START");

    bcrypt.hash(req.body.password, config.saltRounds, function (err, hash) {
      const newUser = new User({ username: req.body.username, password: hash });

      kitty.save();
    });

    logger.info("AuthController/signup: END");
  };

  return authController;
};
