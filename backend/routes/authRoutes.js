const express = require("express");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const router = express.Router();

// ================= STUDENT REGISTER =================
router.post("/register/student", async (req, res) => {
  try {
    console.log("👉 Student register:", req.body);

    const { name, email, password, rollNo, department } = req.body;

    if (!name || !email || !password || !rollNo || !department) {
      return res.status(400).json({ message: "All student fields are required" });
    }

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Email or Roll No already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
    });

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("🔥 Student Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= TEACHER REGISTER =================
router.post("/register/teacher", async (req, res) => {
  try {
    console.log("👉 Teacher register:", req.body);

    const { name, email, password, employeeId, subject } = req.body;

    if (!name || !email || !password || !employeeId || !subject) {
      return res.status(400).json({ message: "All teacher fields are required" });
    }

    const existingTeacher = await Teacher.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: "Email or Employee ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Teacher.create({
      name,
      email,
      password: hashedPassword,
      employeeId,
      subject,
    });

    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    console.error("🔥 Teacher Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

const jwt = require("jsonwebtoken");

// ================= LOGIN (Student / Teacher) =================
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user;

    if (role === "student") {
      user = await Student.findOne({ email });
    } else if (role === "teacher") {
      user = await Teacher.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
