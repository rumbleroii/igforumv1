const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organization",
    required: true
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

  likes : {
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
        type : mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      date: {
        type: Date,
        default: Date.now,
      }
    }
  ],

  duration: {
    type: String,
    max: 10
  },

  lastDate: {
    type: Date,
    default: Date.now,
  },

  date: {
    type: Date,
    default: Date.now,
  },

})

module.exports = Post = mongoose.model("post", PostSchema);