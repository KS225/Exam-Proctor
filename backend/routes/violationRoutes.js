const express = require("express");
const router = express.Router();

const {
  createViolation,
  getViolationsByExam,
  getViolationsByStudent,
  getViolationsByClassCode,
  getViolationSummaryByClassCode,
  dismissViolation,
  takeActionOnViolation,
  getActionedViolationsByStudent,
} = require("../controllers/violationController");

router.post("/", createViolation);

router.get("/exam/:examId", getViolationsByExam);
router.get("/student/:studentId", getViolationsByStudent);
router.get("/class/:classCode", getViolationsByClassCode);
router.get("/class/:classCode/summary", getViolationSummaryByClassCode);
router.get("/student/:studentId/actioned", getActionedViolationsByStudent);

router.patch("/:violationId/dismiss", dismissViolation);
router.patch("/:violationId/action", takeActionOnViolation);

module.exports = router;