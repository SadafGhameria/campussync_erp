const Student = require("../models/Student");

// ==========================
// Create Student
// ==========================
const createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      ...req.body,
      institutionCode: req.user.institutionCode,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: student,
    });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Students
// ==========================
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ institutionCode: req.user.institutionCode }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Student by ID
// ==========================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    const status = error.name === "ValidationError" || error.name === "CastError" ? 400 : error.code === 11000 ? 409 : 500;
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Student
// ==========================
const updateStudent = async (req, res) => {
  try {
    const { institutionCode: _institutionCode, ...updates } = req.body;
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, institutionCode: req.user.institutionCode },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
  } catch (error) {
    res.status(error.name === "CastError" ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete Student
// ==========================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, institutionCode: req.user.institutionCode });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
