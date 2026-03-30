const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true
  },

  // for quiz questions
  options: {
    type: [String],
    default: []
  },

  // correct option index (only for quiz)
  correctAnswer: {
    type: Number,
    default: null
  },

  // ⭐ marks per question
  marks: {
    type: Number,
    default: 1
  }

});

const examSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  classCode: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["quiz", "descriptive"],
    required: true
  },

  duration: {
    type: Number,
    default: 30
  },
 /* ⭐ NEW FIELD */
  headerImage: {
    type: String
  },
  questions: {
    type: [questionSchema],
    default: []
  },

  maxAttempts: {
    type: Number,
    default: 1
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Exam", examSchema);