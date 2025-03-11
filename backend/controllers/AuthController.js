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
    let objHeader = util.headerAuth();
    const { username = "", password = "" } = req.body;
    const hash = bcrypt.hashSync(password, config.saltRounds);
    const newUser = new User({ username: username, password: hash });

    // Check if user already exists
    const existingUser = await util.tc(() => {
      return User.findOne({ username });
    });
    if (existingUser.objResult) {
      objResult.numCode = 1;
      objResult.objError =
        "It seems you already have an account, please log in instead.";
    }

    //Save New User
    if (objResult.numCode === 0) {
      let result = await util.tc(() => {
        return newUser.save();
      });
      console.dir(result.objResult);
      // TODO Add json sign here
      objHeader.userId = result.objResult._id;
      objHeader.name = result.objResult.name;
      objHeader.role = result.objResult.role;
      token = jwt.sign(objHeader, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: "7d",
      });
      objResult.objData = token;
      objResult.objSuccess = "User registered successfully!";
    }

    logger.info("AuthController/signup: END");
    return res.status(201).json(objResult);
  };

  authController.login = asyncHandler(async (req, res) => {
    logger.info("AuthController/login: START");

    let objResult = util.responseUtil();
    let objHeader = util.headerAuth();

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
        objHeader.userId = user._id;
        objHeader.name = user.name;
        objHeader.role = user.role;
        token = jwt.sign(objHeader, process.env.SECRET_ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        objResult.objData = token;
        objResult.objSuccess = "User Login successfully!";
      }
    }

    logger.info("AuthController/login: END");
    return res.status(201).json(objResult);
  });

  // ================================================
  // -------------START OF EXTERNAL API--------------
  // ================================================
  authController.loginGoogle = passport.authenticate("google");

  authController.googleCallback = asyncHandler(async (req, res) => {
    logger.info("AuthController/login/google/callback: START");

    let objResult = util.responseUtil();
    let objHeader = util.headerAuth();

    const user = req.user;
    let token = "";
    objHeader.userId = user.userId;
    objHeader.name = user.name;
    objHeader.role = user.role;
    token = jwt.sign(objHeaderj, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: "7d",
    });
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
        role: "user",
      });
      const tempUser = await newUser.save();
      resultUser = {
        userId: tempUser._id,
        googleId: tempUser.googleId,
        name: profile.displayName,
        role: tempUser.role,
      };
    } else {
      resultUser = {
        userId: existingUser.objResult._id,
        googleId: existingUser.objResult.googleId,
        name: profile.displayName,
        role: "user",
      };
    }
    logger.info("AuthController/googleMain: END");
    return done(null, resultUser);
  };
  // ================================================
  // --------------END OF EXTERNAL APIs--------------
  // ================================================
  return authController;
};
