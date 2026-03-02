const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Class = require("../models/Class");

const router = express.Router();

/* =========================
   GET TEACHER CLASSES
========================= */
router.get("/classes", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const classes = await Class.find({ teacher: req.user.id });
    res.json({ classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   CREATE CLASS
========================= */
router.post("/classes", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, subject, code } = req.body;

    const newClass = await Class.create({
      title,
      subject,
      code,
      teacher: req.user.id,
      students: [],
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   DELETE CLASS
========================= */
router.delete("/classes/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Only class owner can delete
    if (cls.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await cls.deleteOne();
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
