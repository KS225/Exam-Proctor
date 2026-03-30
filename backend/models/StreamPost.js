const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userRole: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const streamPostSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true
  },

  authorId: mongoose.Schema.Types.ObjectId,

  authorName: String,

  authorRole: String,

  title: String,
  content: String,

  files: [String],
  links: [String],

  comments: [commentSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("StreamPost", streamPostSchema);