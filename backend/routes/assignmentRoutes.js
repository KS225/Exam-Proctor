import express from "express";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

const router = express.Router();


// =============================
// CREATE ASSIGNMENT (Teacher)
// =============================
router.post("/create", async (req, res) => {
  try {
    const { title, description, classCode, teacherId, dueDate } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      classCode,
      teacherId,
      dueDate
    });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =============================
// GET ASSIGNMENTS (Student)
// =============================
router.get("/:classCode", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      classCode: req.params.classCode
    }).sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =============================
// SUBMIT ASSIGNMENT
// =============================
router.post("/submit", async (req, res) => {
  try {
    const { assignmentId, studentId, answer } = req.body;

    const submission = await Submission.create({
      assignmentId,
      studentId,
      answer
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/submit", async (req, res) => {
  try {
    const { assignmentId, studentId, answer } = req.body;

    const existing = await Submission.findOne({
      assignmentId,
      studentId
    });

    if (existing) {
      return res.status(400).json({
        message: "Already submitted"
      });
    }

    const submission = await Submission.create({
      assignmentId,
      studentId,
      answer
    });

    res.json(submission);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/student/:studentId", async (req, res) => {
  try {
    const data = await Submission.find({
      studentId: req.params.studentId
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/submissions/:assignmentId", async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignmentId: req.params.assignmentId
    });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/grade", async (req, res) => {
  try {
    const { submissionId, marks, feedback } = req.body;

    const updated = await Submission.findByIdAndUpdate(
      submissionId,
      { marks, feedback },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;