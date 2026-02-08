const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes")); 
app.use("/api/teacher", require("./routes/teacherRoutes")); 
app.use("/api/profile", require("./routes/profileRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
