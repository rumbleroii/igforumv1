require('dotenv').config();
const mongoose = require("mongoose");

const db = process.env.MongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("[Info] MongoDB Connected Successfully!");
  } catch (err) {
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
