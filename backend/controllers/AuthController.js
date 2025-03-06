const bcrypt = require("bcryptjs");

module.exports = (config, models, logger) => {
  let authController = Object.create({});
  let User = models.User;

  authController.signup = (req, res) => {
    logger.info("AuthController/signup: START");
    logger.info(req.body);
    const hash = bcrypt.hashSync(req.body.password, config.saltRounds);

    const newUser = new User({ username: req.body.username, password: hash });

    newUser.save();

    logger.info("AuthController/signup: END");
    res.status(201).json({ message: "User registered successfully!" });
  };

  return authController;
};
