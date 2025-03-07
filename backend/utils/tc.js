const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

//Try Catch Wrapper(to make my code cleaner, and one liner)
module.exports = async (fn) => {
  // 0:success, 1: error
  let result = {
    numCode: 0,
    objResult: "",
    objError: "",
  };
  try {
    result.objResult = await fn();
    return result;
  } catch (err) {
    result.numCode = 1;
    result.objError = err;
    logger.error(err);
    return result;
  }
};
