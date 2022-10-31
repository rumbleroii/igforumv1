const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  avatar: {
    type: String,
  },

  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
