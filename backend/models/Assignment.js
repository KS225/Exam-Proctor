// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   files: [String],
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const assignmentSchema = new mongoose.Schema({

//   classCode: String,
//   title: String,
//   description: String,
//   files: [String],

//   submissions: [submissionSchema],

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// module.exports = mongoose.model(
//   "Assignment",
//   assignmentSchema
// );

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  classCode: String,
  teacherId: String,
  dueDate: Date
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);