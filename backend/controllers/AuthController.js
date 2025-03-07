const bcrypt = require("bcryptjs");

module.exports = (config, models, logger, util) => {
  let authController = Object.create({});
  let User = models.User;

  authController.signup = async (req, res) => {
    logger.info("AuthController/signup: START");

    let objResult = util.responseUtil();
    const { username = "", password = "" } = req.body;
    const hash = bcrypt.hashSync(password, config.saltRounds);
    const newUser = new User({ username: username, password: hash });

    // Check if user already exists
    const existingUser = await util.tc(() => User.findOne({ username }));
    if (existingUser.objResult) {
      objResult.numCode = 1;
      objResult.objError =
        "It seems you already have an account, please log in instead.";
    }

    //Save New User
    if (objResult.numCode === 0) {
      let result = await util.tc(() => newUser.save());
    }

    logger.info("AuthController/signup: END");
    if (objResult.numCode == 0) {
      return res.status(201).json({
        message: "User registered successfully!",
      });
    } else {
      return res.status(201).json({
        message: objResult.objError,
      });
    }
  };

  authController.login = async (req, res) => {
    logger.info("AuthController/login: START");

    let objResult = util.responseUtil();
    const { username, password } = req.body;
    try {
      // Check if user exists

      const user = await User.findOne({ username }).select("+password");

      if (!user) {
        objResult.numCode = 1;
        objResult.objError =
          "Invalid email or password. Please try again with the correct credentials.";
      }

      if (objResult.numCode === 0) {
        // if user exists
        // validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // if not valid, return unathorized response
        if (!isPasswordValid) {
          objResult.numCode = 1;
          objResult.objError =
            "Invalid email or password. Please try again with the correct credentials.";
        }
      }
    } catch (err) {
      logger.error(err);
      objResult.numCode = 1;
      objResult.objError = "Internal Server Error";
    }

    logger.info("AuthController/signup: END");
    if (objResult.numCode == 0) {
      return res.status(201).json({
        message: "User Login successfully!",
      });
    } else {
      return res.status(201).json({
        message: objResult.objError,
      });
    }
  };

  return authController;
};
