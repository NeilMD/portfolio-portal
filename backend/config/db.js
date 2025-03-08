module.exports = async (logger, mongoose, process) => {
  try {
    logger.info(`MongoDB Connect: Start`);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`MongoDB Connect: END`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
