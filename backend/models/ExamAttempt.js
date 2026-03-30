const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },

  answers: {
    type: Object,
  },

  violations: {
    type: Number,
    default: 0,
  },

  marksGiven: {
    type: Object,
    default: {},
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },

  totalScore: {
    type: Number,
    default: 0,
  },

  // ✅ NEW
  resultStatus: {
    type: String,
    enum: ["pending", "pass", "fail"],
    default: "pending",
  },

  cheatingFlag: {
    type: Boolean,
    default: false,
  },

  failureReason: {
    type: String,
    default: "",
  },

  teacherMessage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);