// headerAuth.js
module.exports = (userId = "", name = "", role = "guest") => {
  return {
    userId,
    name,
    role,
  };
};
