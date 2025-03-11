module.exports = ({ config, model, logger, util, asyncHandler }) => {
  let userController = Object.create({});

  userController.profileEdit = asyncHandler((req, res) => {
    logger.info("userController/profileEdit: START");
    let objResult = util.responseUtil();

    logger.info(res.locals);
    logger.info("userController/profileEdit: END");
    return res.json(objResult);
  });

  return userController;
};
