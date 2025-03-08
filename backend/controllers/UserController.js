module.exports = ({ config, model, logger, util }) => {
  let userController = Object.create({});

  userController.profileEdit = (req, res) => {
    logger.info("userController/profileEdit: START");

    logger.info("userController/profileEdit: END");
    return res.json({});
  };

  return userController;
};
