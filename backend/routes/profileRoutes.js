const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    let user;

    if (req.user.role === "student") {
      user = await Student.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.json({
        role: "student",
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        department: user.department,
      });
    }

    if (req.user.role === "teacher") {
      user = await Teacher.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      return res.json({
        role: "teacher",
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        subject: user.subject,
      });
    }

    return res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
