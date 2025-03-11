const jwt = require("jsonwebtoken");

module.exports = ({ process, utils, logger, asyncHandler }) => {
  let jwtUtil = {};

  // Method to sign a token
  jwtUtil.generateAccessToken = asyncHandler((payload) => {
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: "3h",
    });
  });

  // Method to sign a token
  jwtUtil.generateRefreshToken = asyncHandler((payload) => {
    return jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, {
      expiresIn: "7d",
    });
  });

  // Method to sign a token
  jwtUtil.refreshAccessToken = asyncHandler(async (refreshToken) => {
    return await jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN,
      async (err, user) => {
        let payload = {};
        if (user) {
          payload.userId = user?.userId;
          payload.name = user?.name;
          payload.role = user?.role;
          const newAccessToken = await jwtUtil.generateAccessToken(payload);
          return newAccessToken;
        }
        return payload;
      }
    );
  });

  // Method to verify a token
  jwtUtil.verifyToken = asyncHandler(async (token) => {
    return await jwt.verify(
      token,
      process.env.SECRET_ACCESS_TOKEN,
      (err, decoded) => {
        return decoded;
      }
    );
  });

  return jwtUtil;
};
