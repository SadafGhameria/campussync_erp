const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");

const router = express.Router();

router.route("/").get(protect, getCourses).post(protect, authorize("admin"), createCourse);
router.route("/:id").get(protect, getCourseById).put(protect, authorize("admin"), updateCourse).delete(protect, authorize("admin"), deleteCourse);

module.exports = router;
