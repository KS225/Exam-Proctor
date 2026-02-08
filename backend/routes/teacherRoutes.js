const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Class = require("../models/Class");

const router = express.Router();

// GET teacher classes
router.get("/classes", protect, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }

  const classes = await Class.find({
    teacher: req.user.id,
  });

  res.json({
    classes,
  });
});

module.exports = router;
