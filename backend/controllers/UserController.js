module.exports = ({ config, model, logger, util, asyncHandler }) => {
  let userController = Object.create({});
  let User = model.User;

  userController.profileGet = asyncHandler(async (req, res) => {
    logger.info("userController/profileGet: START");

    let objResult = util.responseUtil();
    const { userId = "" } = req.body;

    const user = await User.findOne({ _id: userId });
    console.log(user._id);
    if (user.objResult) {
      objResult.numCode = 1;
      objResult.objError = "User not found!";
    }

    if (objResult.numCode === 0) {
      objResult.objData = {
        userId: user._id,
        name: user?.name || "",
        username: user.username,
        bio: user?.bio || "",
      };
      objResult.objSuccess = "User found.";
    }

    logger.info("userController/profileGet: END");
    return res.status(201).json(objResult);
  });

  userController.profileEdit = asyncHandler(async (req, res) => {
    logger.info("userController/profileEdit: START");
    let objResult = util.responseUtil();

    const { userId = "", username = "", name = "", bio = "" } = req.body;

    // Find the user
    const user = await User.findOne({ _id: userId });

    if (!user) {
      objResult.numCode = 1;
      objResult.objError = "User not found!";
    }

    if (objResult.numCode === 0) {
      user.name = name.trim();
      user.bio = bio.trim();
      user.username = username.trim();

      const updatedUser = await util.tc(() => {
        return user.save();
      });
      if (updatedUser.numCode) {
        objResult.numCode = 1;
        objResult.objError = `The email is already in use. Please choose another.`;
      } else {
        objResult.objSuccess = "User profile updated successfully.";
        objResult.objData = {
          userId: updatedUser.objResult._id,
          name: updatedUser.objResult.name,
          username: updatedUser.objResult.username,
          bio: updatedUser.objResult.bio,
        };
      }
    }

    logger.info("userController/profileEdit: END");
    return res.json(objResult);
  });

  return userController;
};
