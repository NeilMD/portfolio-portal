const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = ({
  config,
  model,
  logger,
  util,
  process,
  asyncHandler,
  passport,
}) => {
  let authController = {};
  let User = model.User;

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
      objResult.objSuccess = "User registered successfully!";
    }

    logger.info("AuthController/signup: END");
    return res.status(201).json(objResult);
  };

  authController.login = asyncHandler(async (req, res) => {
    logger.info("AuthController/login: START");

    let objResult = util.responseUtil();
    const { username, password } = req.body;
    let token = "";
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
      } else {
        token = jwt.sign(
          { userId: user._id },
          process.env.SECRET_ACCESS_TOKEN,
          {
            expiresIn: "7d",
          }
        );
        objResult.objData = token;
        objResult.objSuccess = "User Login successfully!";
      }
    }

    logger.info("AuthController/login: END");
    return res.status(201).json(objResult);
  });

  authController.loginGoogle = passport.authenticate("google");

  authController.googleCallback = asyncHandler(async (req, res) => {
    logger.info("AuthController/login/google/callback: START");

    let objResult = util.responseUtil();

    const user = req.user;
    let token = "";
    token = jwt.sign(
      { userId: user?.userId, googleId: user?.googleId, name: user?.name },
      process.env.SECRET_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      }
    );
    objResult.objData = { token };
    objResult.objSuccess = "User Login successfully!";

    logger.info("AuthController/login/google/callback: END");
    return res.status(201).json(objResult);
  });

  authController.googleMain = async (
    accessToken,
    refreshToken,
    profile,
    done
  ) => {
    logger.info("AuthController/googleMain: START");
    let resultUser = "",
      existingUser = "";
    // Try to find the user in database
    existingUser = await util.tc(
      async () =>
        await User.findOne({
          googleId: profile.id,
        })
    );

    // If user doesn't exist, create a new one
    if (existingUser.objResult === 0 || !existingUser.objResult) {
      const newUser = new User({
        googleId: profile?.id,
        name: profile?.displayName,
        email: profile?.emails?.value,
      });
      const tempUser = await newUser.save();
      resultUser = {
        userId: tempUser._id,
        googleId: tempUser.googleId,
        name: profile.displayName,
      };
    } else {
      resultUser = {
        userId: existingUser.objResult._id,
        googleId: existingUser.objResult.googleId,
        name: profile.displayName,
      };
    }
    logger.info("AuthController/googleMain: END");
    return done(null, resultUser);
  };
  return authController;
};
