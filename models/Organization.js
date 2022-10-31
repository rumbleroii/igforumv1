const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
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

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Organization = mongoose.model("organization", OrganizationSchema);
