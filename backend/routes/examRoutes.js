const express = require("express");
const router = express.Router();

const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");
const upload = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const { protect } = require("../middleware/authMiddleware");
const { markViolationsSubmitted } = require("../controllers/violationController");

/* =============================
   Create Exam
============================= */

router.post(
  "/create",
  upload.single("headerImage"),
  async (req, res) => {

    try {

      const { title, classCode, type, duration } = req.body;

      /* parse questions from FormData */
      const questions = JSON.parse(req.body.questions || "[]");

      const exam = new Exam({
        title,
        classCode,
        type,
        duration,
        headerImage: req.file
          ? `/uploads/${req.file.filename}`
          : null,
        questions
      });

      await exam.save();

      res.json(exam);

    } catch (error) {

      console.error("Create exam error:", error);
      res.status(500).json({ message: error.message });

    }

  }
);


/* =============================
   Get Exams For Class
============================= */

router.get("/class/:classCode", async (req, res) => {

  try {

    const exams = await Exam.find({
      classCode: req.params.classCode
    });

    res.json(exams);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


/* =============================
   Teacher Preview
============================= */

router.get("/:id", async (req, res) => {

  try {

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    res.json(exam);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


/* =============================
   Student Attempt
============================= */
router.get("/exam/:id", async (req, res) => {

  try {

    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID required"
      });
    }

    // ✅ CHECK IF ALREADY ATTEMPTED
    const existingAttempt = await ExamAttempt.findOne({
      examId: req.params.id,
      studentId
    });

    if (existingAttempt) {
      return res.status(403).json({
        message: "You have already attempted this exam",
        attemptId: existingAttempt._id
      });
    }

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    res.json(exam);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


/* =============================
   Submit Exam
============================= */
router.post("/submit", async (req, res) => {

  try {

    const { examId, studentId, answers, violations } = req.body;

    // ✅ CHECK IF ALREADY ATTEMPTED
    const existingAttempt = await ExamAttempt.findOne({
      examId,
      studentId
    });

    if (existingAttempt) {
      return res.status(400).json({
        message: "You have already attempted this exam",
        attemptId: existingAttempt._id
      });
    }

    const exam = await Exam.findById(examId);

    let marksGiven = {};
let totalScore = 0;

if (exam.type === "quiz") {

  exam.questions.forEach((q, index) => {

    const correct = Number(q.correctAnswer);
    const studentAnswer = answers[index] !== undefined
      ? Number(answers[index])
      : null;

    // ✅ Validate answer
    if (
      studentAnswer !== null &&
      studentAnswer >= 0 &&
      studentAnswer < (q.options?.length || 0)
    ) {

      if (studentAnswer === correct) {
        marksGiven[index] = Number(q.marks || 0);
        totalScore += Number(q.marks || 0);
      } else {
        marksGiven[index] = 0;
      }

    } else {
      // ❌ unanswered or invalid
      marksGiven[index] = 0;
    }

  });

}

    const attempt = new ExamAttempt({
      examId,
      studentId,
      answers,
      violations,
      marksGiven,
      totalScore
    });

    await attempt.save();
await markViolationsSubmitted(examId, studentId);

    res.json({
      message: "Exam submitted",
      totalScore,
      attemptId: attempt._id
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

/* =============================
   GET EXAM RESULTS
============================= */

router.get("/results/:examId", async (req, res) => {

  try {

    const attempts = await ExamAttempt.find({
  examId: req.params.examId
})
.populate("studentId")
.populate("examId"); // ✅ ADD THIS

    res.json(attempts);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});
/* =============================
   GET SINGLE ATTEMPT
============================= */

router.get("/attempt/:attemptId", async (req, res) => {

  try {

    const attempt = await ExamAttempt.findById(
      req.params.attemptId
    )
    .populate("studentId")
    .populate("examId");

    res.json(attempt);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

/* =============================
   SAVE GRADING
============================= */

router.post("/grade", protect, async (req, res) => {

  try {

    const { attemptId, marks, password } = req.body;
    const teacherId = req.user.id;

    if (!attemptId || !marks) {
      return res.status(400).json({
        message: "Invalid grading data"
      });
    }

    const attempt = await ExamAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found"
      });
    }

    // ✅ Get exam to validate total marks
    const exam = await Exam.findById(attempt.examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    // ✅ TOTAL MARKS VALIDATION
    const totalAllowed = exam.questions.reduce(
      (sum, q) => sum + Number(q.marks || 0),
      0
    );

    const totalGiven = Object.values(marks).reduce(
      (sum, m) => sum + Number(m || 0),
      0
    );

    if (totalGiven > totalAllowed) {
      return res.status(400).json({
        message: `Total marks cannot exceed ${totalAllowed}`
      });
    }

    // ✅ PASSWORD CHECK (only if already graded)
    if (
      attempt.marksGiven &&
      Object.keys(attempt.marksGiven).length > 0
    ) {

      if (!password) {
        return res.status(403).json({
          message: "Password required to change marks"
        });
      }

      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found"
        });
      }

      const valid = await bcrypt.compare(
        password,
        teacher.password
      );

      if (!valid) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }
    }

    // ✅ SAVE MARKS
    attempt.marksGiven = marks;

    await attempt.save();

    res.json({
      message: "Marks saved successfully",
      totalGiven,
      totalAllowed
    });

  } catch (error) {

    console.log("GRADE ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }

});


module.exports = router;