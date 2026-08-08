// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { authorize } = require("../middleware/roleMiddleware");
// const { startAttendanceSession, markAttendance, getAttendanceSessions, getCourseAttendance, getStudentAttendance, getDefaulters } = require("../controllers/attendanceController");

// const router = express.Router();

// router.get("/sessions", protect, getAttendanceSessions);
// router.post("/session", protect, authorize("faculty", "admin"), startAttendanceSession);
// router.post("/mark", protect, authorize("faculty", "admin"), markAttendance);
// router.get("/course/:courseId", protect, getCourseAttendance);
// router.get("/student/:studentId", protect, getStudentAttendance);
// router.get("/defaulters/:courseId", protect, getDefaulters);

// module.exports = router;
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
  markAttendance,
  getAttendanceHistory,
  getStudentAttendance,
  getDefaulters,
} = require("../controllers/attendanceController");

// Save attendance
router.post(
  "/",
  protect,
  authorize("admin", "faculty"),
  markAttendance
);

// Attendance history
router.get(
  "/",
  protect,
  authorize("admin", "faculty"),
  getAttendanceHistory
);

// Student attendance report
router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "faculty"),
  getStudentAttendance
);

// Defaulter list
router.get(
  "/defaulters",
  protect,
  authorize("admin", "faculty"),
  getDefaulters
);

module.exports = router;