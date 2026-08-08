const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const subjectAllocationRoutes = require("./routes/subjectAllocationRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  // origin: process.env.CLIENT_URL || "http://localhost:5173",
  // credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "EduSphere Backend Running 🚀",
  });
});

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/departments", departmentRoutes);

app.use(
    "/api/subject-allocation",
    subjectAllocationRoutes
);
console.log("Timetable routes loaded");
app.use("/api/timetable", timetableRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
