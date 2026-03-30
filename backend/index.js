const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ==========================
// Middleware
// ==========================
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// ==========================
// Database
// ==========================
connectDB();

// ==========================
// Routes
// ==========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes")); 
app.use("/api/teacher", require("./routes/teacherRoutes")); 
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/proctor", require("./routes/proctorRoutes"));
app.use("/api/classrooms", require("./routes/classRoutes"));
app.use("/api/stream", require("./routes/streamRoutes"));
app.use("/api/ai", aiRoutes);
app.use("/api/violations", require("./routes/violationRoutes"));
// static uploads
app.use("/uploads", express.static("uploads"));

// ==========================
// 🔥 SOCKET.IO SETUP
// ==========================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// make io accessible globally
global.io = io;

// socket connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // join exam room
  socket.on("joinExam", (examId) => {
    socket.join(examId);
    console.log("📡 Joined exam room:", examId);
  });

  // optional: leave room
  socket.on("leaveExam", (examId) => {
    socket.leave(examId);
    console.log("🚪 Left exam room:", examId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;

// ❗ IMPORTANT: use server.listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});