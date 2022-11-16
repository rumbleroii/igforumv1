const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organization",
    required: true,
  },

  title: {
    type: String,
    max: 20,
  },

  body: {
    type: String,
    max: 500,
  },

  img: {
    type: String,
  },

  likes: {
    type: Array,
    default: [],
  },

  updated: {
    type: Boolean,
    default: false,
  },

  registrants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  deadline: {
    type: String,
    max: 10,
  },

  venue: {
    type: String,
    max: 30,
  },

  waLink: {
    type: String,
    default: ""
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", PostSchema);
