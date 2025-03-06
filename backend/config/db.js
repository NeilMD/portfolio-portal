module.exports = async (logger, mongoose, process) => {
  try {
    logger.info(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
