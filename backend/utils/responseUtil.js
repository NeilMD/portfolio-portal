// responseUtil.js
module.exports = (
  numCode = 0,
  objData = "",
  objError = "",
  objSuccess = ""
) => {
  return {
    numCode,
    objData,
    objError,
    objSuccess,
  };
};
