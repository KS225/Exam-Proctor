const Violation = require("../models/Violation");
const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");

exports.createViolation = async (req, res) => {
  try {
    const {
      examId,
      studentId,
      studentName,
      type,
      violations,
      direction,
      gaze,
      objects,
      num_faces,
      snapshot,
    } = req.body;

    const newViolation = await Violation.create({
      examId,
      studentId,
      studentName,
      type,
      violations,
      direction,
      gaze,
      objects,
      num_faces,
      snapshot,
      isSubmitted: false,
      submittedAt: null,
      timestamp: new Date(),
      status: "pending",
      teacherRemark: "",
      actionTakenAt: null,
    });

    res.status(201).json({
      message: "Violation saved successfully",
      violation: newViolation,
    });
  } catch (error) {
    console.error("createViolation error:", error);
    res.status(500).json({
      message: "Failed to save violation",
      error: error.message,
    });
  }
};

exports.getViolationsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const violations = await Violation.find({
      examId,
      isSubmitted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(violations);
  } catch (error) {
    console.error("getViolationsByExam error:", error);
    res.status(500).json({
      message: "Failed to fetch violations",
      error: error.message,
    });
  }
};

exports.getViolationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const violations = await Violation.find({
      studentId,
      isSubmitted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(violations);
  } catch (error) {
    console.error("getViolationsByStudent error:", error);
    res.status(500).json({
      message: "Failed to fetch student violations",
      error: error.message,
    });
  }
};

exports.getViolationsByClassCode = async (req, res) => {
  try {
    const { classCode } = req.params;

    const exams = await Exam.find({ classCode }).select("_id title");
    const examIds = exams.map((exam) => exam._id);

    const violations = await Violation.find({
      examId: { $in: examIds },
      isSubmitted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(violations);
  } catch (error) {
    console.error("getViolationsByClassCode error:", error);
    res.status(500).json({
      message: "Failed to fetch class violations",
      error: error.message,
    });
  }
};

exports.getViolationSummaryByClassCode = async (req, res) => {
  try {
    const { classCode } = req.params;

    const exams = await Exam.find({ classCode }).select("_id title");
    const examMap = {};
    exams.forEach((exam) => {
      examMap[String(exam._id)] = exam.title;
    });

    const examIds = exams.map((exam) => exam._id);

    const violations = await Violation.find({
      examId: { $in: examIds },
      isSubmitted: true,
    });

    const grouped = {};

    violations.forEach((v) => {
      const key = String(v.examId);

      if (!grouped[key]) {
        grouped[key] = {
          examId: key,
          examTitle: examMap[key] || "Untitled Exam",
          totalViolations: 0,
          pendingViolations: 0,
          dismissedViolations: 0,
          actionTakenViolations: 0,
        };
      }

      grouped[key].totalViolations += 1;

      if (v.status === "pending") grouped[key].pendingViolations += 1;
      if (v.status === "dismissed") grouped[key].dismissedViolations += 1;
      if (v.status === "action_taken") grouped[key].actionTakenViolations += 1;
    });

    res.status(200).json(Object.values(grouped));
  } catch (error) {
    console.error("getViolationSummaryByClassCode error:", error);
    res.status(500).json({
      message: "Failed to fetch violation summary",
      error: error.message,
    });
  }
};

exports.dismissViolation = async (req, res) => {
  try {
    const { violationId } = req.params;

    const violation = await Violation.findByIdAndUpdate(
      violationId,
      {
        status: "dismissed",
        actionTakenAt: new Date(),
      },
      { new: true }
    );

    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }

    res.json({
      message: "Violation dismissed successfully",
      violation,
    });
  } catch (error) {
    console.error("dismissViolation error:", error);
    res.status(500).json({
      message: "Failed to dismiss violation",
      error: error.message,
    });
  }
};

exports.takeActionOnViolation = async (req, res) => {
  try {
    const { violationId } = req.params;
    const { teacherRemark } = req.body;

    const violation = await Violation.findById(violationId);

    if (!violation) {
      return res.status(404).json({ message: "Violation not found" });
    }

    violation.status = "action_taken";
    violation.teacherRemark =
      teacherRemark || "You were caught cheating during the exam.";
    violation.actionTakenAt = new Date();

    await violation.save();

    await ExamAttempt.findOneAndUpdate(
      {
        examId: violation.examId,
        studentId: violation.studentId,
      },
      {
        $set: {
          resultStatus: "fail",
          cheatingFlag: true,
          failureReason: "Caught cheating during the exam",
          teacherMessage:
            teacherRemark ||
            "You were caught cheating during the exam. Your attempt has been marked as failed.",
        },
      }
    );

    res.json({
      message: "Action taken. Student marked as failed.",
      violation,
    });
  } catch (error) {
    console.error("takeActionOnViolation error:", error);
    res.status(500).json({
      message: "Failed to take action on violation",
      error: error.message,
    });
  }
};

exports.markViolationsSubmitted = async (examId, studentId) => {
  try {
    await Violation.updateMany(
      {
        examId,
        studentId,
        isSubmitted: false,
      },
      {
        $set: {
          isSubmitted: true,
          submittedAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error("markViolationsSubmitted error:", error);
    throw error;
  }
};

exports.getActionedViolationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const violations = await Violation.find({
      studentId,
      isSubmitted: true,
      status: "action_taken",
    }).sort({ createdAt: -1 });

    res.status(200).json(violations);
  } catch (error) {
    console.error("getActionedViolationsByStudent error:", error);
    res.status(500).json({
      message: "Failed to fetch student violation actions",
      error: error.message,
    });
  }
};