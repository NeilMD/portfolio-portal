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
    bio: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  });

  return mongoose.model("User", UserSchema);
};
