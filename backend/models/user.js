module.exports = (logger, mongoose) => {
  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  logger.info("User Model Loaded");
  return mongoose.model("User", UserSchema);
};
