import mongoose from "mongoose";


const submissionSchema = new mongoose.Schema({
  assignmentId: String,
  studentId: String,
  answer: String,

  marks: { type: Number, default: null },
  feedback: { type: String, default: "" },

  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);