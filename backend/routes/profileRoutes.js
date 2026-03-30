const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const multer = require("multer");

const router = express.Router();

/* ============================
   MULTER CONFIG
============================ */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images are allowed"), false);
    }
  },
});

/* ============================
   DEFAULT AVATAR
============================ */
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=User";

/* ============================
   GET MY PROFILE
============================ */
router.get("/me", protect, async (req, res) => {
  try {
    let user;

    if (req.user.role === "student") {
      user = await Student.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "Student not found" });

      return res.json({
        role: "student",
        profilePic: user.profilePic || DEFAULT_AVATAR,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        department: user.department,
      });
    }

    if (req.user.role === "teacher") {
      user = await Teacher.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "Teacher not found" });

      return res.json({
        role: "teacher",
        profilePic: user.profilePic || DEFAULT_AVATAR,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        subject: user.subject,
      });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   UPLOAD PROFILE PHOTO
============================ */
router.put(
  "/upload-photo",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      let user;

      if (req.user.role === "student") {
        user = await Student.findByIdAndUpdate(
          req.user.id,
          { profilePic: base64Image },
          { new: true }
        );
      }

      if (req.user.role === "teacher") {
        user = await Teacher.findByIdAndUpdate(
          req.user.id,
          { profilePic: base64Image },
          { new: true }
        );
      }

      res.json({
        message: "Profile picture updated successfully",
        profilePic: user.profilePic,
      });
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }
);

/* ============================
   UPDATE PROFILE DETAILS
============================ */
router.put("/update", protect, async (req, res) => {
  try {
    let user;

    if (req.user.role === "student") {
      user = await Student.findByIdAndUpdate(
        req.user.id,
        {
          name: req.body.name,
          email: req.body.email,
          rollNo: req.body.rollNo,
          department: req.body.department,
        },
        { new: true }
      ).select("-password");

      return res.json({
        role: "student",
        profilePic: user.profilePic || DEFAULT_AVATAR,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        department: user.department,
      });
    }

    if (req.user.role === "teacher") {
      user = await Teacher.findByIdAndUpdate(
        req.user.id,
        {
          name: req.body.name,
          email: req.body.email,
          employeeId: req.body.employeeId,
          subject: req.body.subject,
        },
        { new: true }
      ).select("-password");

      return res.json({
        role: "teacher",
        profilePic: user.profilePic || DEFAULT_AVATAR,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        subject: user.subject,
      });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
