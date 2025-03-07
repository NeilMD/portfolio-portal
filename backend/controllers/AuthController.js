const bcrypt = require("bcryptjs");

module.exports = (config, models, logger, util) => {
  let authController = Object.create({});
  let User = models.User;

  authController.signup = (req, res) => {
    logger.info("AuthController/signup: START");

    const { username = "", password = "" } = req.body;

    const hash = bcrypt.hashSync(password, config.saltRounds);

    const newUser = new User({ username: username, password: hash });

    util.tc(() => newUser.save());

    logger.info("AuthController/signup: END");
    res.status(201).json({ message: "User registered successfully!" });
  };

  return authController;
};
