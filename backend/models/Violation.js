const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    studentName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: null,
    },
    violations: {
      type: [String],
      default: [],
    },
    direction: {
      type: String,
      default: "",
    },
    gaze: {
      type: String,
      default: "",
    },
    objects: {
      type: [String],
      default: [],
    },
    num_faces: {
      type: Number,
      default: 0,
    },
    snapshot: {
      type: String,
      default: "",
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },

    // ✅ NEW
    status: {
      type: String,
      enum: ["pending", "dismissed", "action_taken"],
      default: "pending",
    },
    teacherRemark: {
      type: String,
      default: "",
    },
    actionTakenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Violation", violationSchema);