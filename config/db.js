require('dotenv').config();
const mongoose = require("mongoose");
const logger = require("../logger");

const db = process.env.MongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("[Info] MongoDB Connected Successfully!");
  } catch (err) {
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
