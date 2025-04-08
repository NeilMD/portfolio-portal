const bcrypt = require("bcryptjs");

module.exports = ({
  config,
  model,
  logger,
  util,
  process,
  asyncHandler,
  passport,
  jwt,
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

      objHeader.userId = result.objResult._id;
      objHeader.name = result.objResult.name;
      objHeader.role = result.objResult.role;
      let accessToken = await jwt.generateAccessToken(objHeader);
      let refreshToken = await jwt.generateRefreshToken(objHeader);

      // Store refresh token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, config.cookieOptions);
      objResult.objData = accessToken;
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
    let accessToken = "";
    // Check if user exists
    const user = await User.findOne({ username: username }).select("+password");

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
        accessToken = await jwt.generateAccessToken(objHeader);
        let refreshToken = await jwt.generateRefreshToken(objHeader);
        // Store refresh token in HttpOnly cookie
        res.cookie("refreshToken", refreshToken, config.cookieOptions);
        objResult.objData = accessToken;
        objResult.objSuccess = "User Login successfully!";
      }
    }

    logger.info("AuthController/login: END");
    return res.status(201).json(objResult);
  });

  authController.refresh = asyncHandler(async (req, res) => {
    logger.info("AuthController/refresh: START");

    let objResult = util.responseUtil();
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const newAccessToken = await jwt.refreshAccessToken(refreshToken);
      objResult.objData = newAccessToken;
    } else {
      objResult.numCode = 1;
      objResult.objData = "Refresh Token Error.";
    }

    logger.info("AuthController/refresh: END");
    return res.status(201).json(objResult);
  });

  authController.logout = asyncHandler(async (req, res) => {
    logger.info("AuthController/logout: START");

    let objResult = util.responseUtil();

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.cookieOptions.secure,
      sameSite: config.cookieOptions.sameSite,
    });

    objResult.objSuccess = "User logged out successfully!";

    logger.info("AuthController/logout: END");
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
    let accessToken = "";
    objHeader.userId = user.userId;
    objHeader.name = user.name;
    objHeader.role = user.role;
    accessToken = await jwt.generateAccessToken(objHeader);
    let refreshToken = await jwt.generateRefreshToken(objHeader);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, config.cookieOptions);

    objResult.objData = { accessToken };
    objResult.objSuccess = "User Login successfully!";

    logger.info("AuthController/login/google/callback: END");
    return res.status(201).json(objResult);
  });

  authController.googleMain = asyncHandler(
    async (accessToken, refreshToken, profile, done) => {
      logger.info("AuthController/googleMain: START");
      let resultUser = "",
        existingUser = "";
      // Try to find the user in database
      existingUser = await util.tc(() => {
        return User.findOne({
          username: profile.id,
        });
      });

      // If user doesn't exist, create a new one
      if (existingUser.objResult === 0 || !existingUser.objResult) {
        const newUser = new User({
          username: profile?.id,
          name: profile?.displayName,
          role: "user",
        });
        const tempUser = await newUser.save();
        resultUser = {
          userId: tempUser._id,
          username: tempUser.username,
          name: profile.displayName,
          role: tempUser.role,
        };
      } else {
        resultUser = {
          userId: existingUser.objResult._id,
          name: profile.displayName,
          role: "user",
        };
      }
      logger.info("AuthController/googleMain: END");
      return done(null, resultUser);
    }
  );
  // ================================================
  // --------------END OF EXTERNAL APIs--------------
  // ================================================
  return authController;
};
