module.exports = (logger, mongoose) => {
  const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    name: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  });

  return mongoose.model("User", UserSchema);
};
