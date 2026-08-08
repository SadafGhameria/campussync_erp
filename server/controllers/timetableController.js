const Timetable = require("../models/Timetable");
const generateTimetableService = require("../services/timetableGenerator");

// ======================================
// Generate Timetable
// ======================================

exports.generateTimetable = async (req, res) => {
  try {
    const {
      institutionCode,
      department,
      semester,
      division,
      academicYear,
      replaceExisting = false,
      saturdayWorking = false,
    } = req.body;

    if (!institutionCode || !department || !semester || !division || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "institutionCode, department, semester, division and academicYear are all required.",
      });
    }

    // Check latest timetable
    const latestTimetable = await Timetable.findOne({
      institutionCode,
      department,
      semester,
      division,
      academicYear,
    }).sort({ version: -1 });

    // Timetable already exists
    if (latestTimetable && !replaceExisting) {
      return res.status(409).json({
        success: false,
        message: "Timetable already exists.",
        latestVersion: latestTimetable.version,
      });
    }

    // Create next version
    const nextVersion = latestTimetable
      ? latestTimetable.version + 1
      : 1;

    const timetable = await generateTimetableService({
      institutionCode,
      department,
      semester,
      division,
      academicYear,
      version: nextVersion,
      saturdayWorking,
    });

    res.status(201).json({
      success: true,
      message: "Timetable generated successfully.",
      data: timetable,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get All Timetables
// ======================================

exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// Get Single Timetable
// ======================================

exports.getSingleTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate({
        path: "slots.faculty",
        select: "employeeId designation branch user",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    console.error("Get timetable error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Timetable
// ======================================

exports.deleteTimetable = async (req, res) => {
  try {

    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};