import mongoose from "mongoose";
import CONFIG from "../config/config";
import logger from "../logger/logger";

const connectToMongoDb = async (): Promise<void> => {
  const MONGODB_URI = CONFIG.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      logger.info("Connection to MongoDB successful");
    } catch (error) {
      logger.info("Connection to MongoDB failed");
      logger.error(error);
    }
  } else {
    logger.info("MongoDB URI is not provided");
  }

  // Add event listeners
  mongoose.connection.on("connected", () => {
    logger.info("Connection to MongoDB successful");
  });

  mongoose.connection.on("error", (err: any) => {
    logger.info("Connection to MongoDB failed");
    logger.error(err);
  });
};

export default connectToMongoDb;
