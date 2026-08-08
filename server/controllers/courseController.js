const Course = require("../models/Course");
const User = require("../models/User");

const apiError = (res, error) => {
  const status = error.name === "CastError" || error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
  return res.status(status).json({ success: false, message: status === 500 ? "Unable to process the course request." : error.message });
};

const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, department, semester, credits, faculty } = req.body;
    if (!courseCode || !courseName || !department || !semester || !faculty) return res.status(400).json({ success: false, message: "Course code, name, department, semester and faculty are required." });
    const facultyUser = await User.findOne({ _id: faculty, role: "faculty", institutionCode: req.user.institutionCode });
    if (!facultyUser) return res.status(400).json({ success: false, message: "Select an active faculty member from your institution." });
    const course = await Course.create({ courseCode, courseName, department, semester, credits, faculty, institutionCode: req.user.institutionCode });
    return res.status(201).json({ success: true, message: "Course created successfully.", data: course });
  } catch (error) { return apiError(res, error); }
};

const getCourses = async (req, res) => {
  try {
    const filter = { institutionCode: req.user.institutionCode };
    if (req.query.active !== "all") filter.isActive = true;
    const courses = await Course.find(filter).populate("faculty", "name email").sort({ courseName: 1 });
    return res.json({ success: true, count: courses.length, data: courses });
  } catch (error) { return apiError(res, error); }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode }).populate("faculty", "name email");
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.json({ success: true, data: course });
  } catch (error) { return apiError(res, error); }
};

const updateCourse = async (req, res) => {
  try {
    const { institutionCode: _institutionCode, faculty, ...updates } = req.body;
    if (faculty) {
      const facultyUser = await User.findOne({ _id: faculty, role: "faculty", institutionCode: req.user.institutionCode });
      if (!facultyUser) return res.status(400).json({ success: false, message: "Select an active faculty member from your institution." });
      updates.faculty = faculty;
    }
    const course = await Course.findOneAndUpdate({ _id: req.params.id, institutionCode: req.user.institutionCode }, updates, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.json({ success: true, message: "Course updated successfully.", data: course });
  } catch (error) { return apiError(res, error); }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.id, institutionCode: req.user.institutionCode }, { isActive: false }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.json({ success: true, message: "Course deactivated successfully." });
  } catch (error) { return apiError(res, error); }
};

module.exports = { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };
