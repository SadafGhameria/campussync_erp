const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { enrollStudent, getStudentCourses, getCourseStudents } = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", protect, authorize("admin"), enrollStudent);
router.get("/student/:studentId", protect, getStudentCourses);
router.get("/course/:courseId", protect, getCourseStudents);

module.exports = router;
