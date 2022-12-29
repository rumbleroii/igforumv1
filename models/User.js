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
    unique: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  isOrganization: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model("user", UserSchema);
