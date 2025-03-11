module.exports = {
  auth: {
    saltRounds: 10,
  },
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  },
};
