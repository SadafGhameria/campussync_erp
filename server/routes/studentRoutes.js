const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Create Student (Admin Only)
router.post("/", protect, authorize("admin"), createStudent);

// Get All Students
router.get("/", protect, getStudents);

// Get Single Student
router.get("/:id", protect, getStudentById);

// Update Student (Admin Only)
router.put("/:id", protect, authorize("admin"), updateStudent);

// Delete Student (Admin Only)
router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;