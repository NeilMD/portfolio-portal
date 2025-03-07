const bcrypt = require("bcryptjs");

module.exports = (config, models, logger, util) => {
  let authController = Object.create({});
  let User = models.User;

  authController.signup = async (req, res) => {
    logger.info("AuthController/signup: START");

    const { username = "", password = "" } = req.body;

    const hash = bcrypt.hashSync(password, config.saltRounds);

    const newUser = new User({ username: username, password: hash });

    let result = await util.tc(() => newUser.save());
    logger.info("AuthController/signup: END");

    if (result.numCode == 0) {
      res.status(201).json({ message: "User registered successfully!" });
    } else {
      res.status(500);
    }
  };

  return authController;
};
