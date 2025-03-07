const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

//Try Catch Wrapper(to make my code cleaner, and one liner)
module.exports = (fn) => {
  try {
    return fn();
  } catch (err) {
    logger.error(err);
    return;
  }
};
