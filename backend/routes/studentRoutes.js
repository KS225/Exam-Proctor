const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Class = require("../models/Class");

const router = express.Router();

// GET student classes
router.get("/classes", protect, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const classes = await Class.find({
    students: req.user.id,
  }).populate("teacher", "name");

  res.json({
    classes: classes.map((cls) => ({
      _id: cls._id,
      title: cls.title,
      code: cls.code,
      teacherName: cls.teacher.name,
    })),
  });
});

// JOIN CLASS
router.post("/join", protect, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { code } = req.body;

  const cls = await Class.findOne({ code }).populate("teacher", "name");

  if (!cls) {
    return res.status(404).json({ message: "Invalid class code" });
  }

  if (cls.students.includes(req.user.id)) {
    return res.status(400).json({ message: "Already joined this class" });
  }

  cls.students.push(req.user.id);
  await cls.save();

  res.json({
    class: {
      _id: cls._id,
      title: cls.title,
      code: cls.code,
      teacherName: cls.teacher.name,
    },
  });
});

module.exports = router;
