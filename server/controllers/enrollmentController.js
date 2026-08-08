const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

const handleError = (res, error) => res.status(error.name === "CastError" || error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "The student is already enrolled in this course." : error.message });

const enrollStudent = async (req, res) => {
  try {
    const { student, course, academicYear, semester } = req.body;
    if (!student || !course || !academicYear || !semester) return res.status(400).json({ success: false, message: "Student, course, academic year and semester are required." });
    const [studentExists, courseExists] = await Promise.all([
      Student.exists({ _id: student, institutionCode: req.user.institutionCode }),
      Course.exists({ _id: course, institutionCode: req.user.institutionCode, isActive: true }),
    ]);
    if (!studentExists || !courseExists) return res.status(404).json({ success: false, message: "Student or active course not found." });
    const enrollment = await Enrollment.create({ student, course, academicYear, semester, institutionCode: req.user.institutionCode });
    return res.status(201).json({ success: true, message: "Student enrolled successfully.", data: enrollment });
  } catch (error) { return handleError(res, error); }
};

const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ institutionCode: req.user.institutionCode, student: req.params.studentId, status: "Active" }).populate("course").sort({ createdAt: -1 });
    return res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) { return handleError(res, error); }
};

const getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ institutionCode: req.user.institutionCode, course: req.params.courseId, status: "Active" }).populate("student", "studentId firstName lastName email department semester").sort({ createdAt: -1 });
    return res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) { return handleError(res, error); }
};

module.exports = { enrollStudent, getStudentCourses, getCourseStudents };
