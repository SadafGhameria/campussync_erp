const SubjectAllocation = require("../models/SubjectAllocation");

// =============================
// Create Subject Allocation
// =============================
exports.createSubjectAllocation = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Subject allocated successfully",
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Subject Allocations
// =============================
exports.getAllSubjectAllocations = async (req, res) => {
  try {
    const allocations = await SubjectAllocation.find()
  .populate({
    path: "faculty",
    populate: {
      path: "user",
      select: "name email",
    },
  })
  .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Subject Allocation
// =============================
exports.getSubjectAllocation = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.findById(req.params.id)
      .populate("faculty");

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Subject Allocation
// =============================
exports.updateSubjectAllocation = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Allocation updated successfully",
      data: allocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Subject Allocation
// =============================
exports.deleteSubjectAllocation = async (req, res) => {
  try {
    const allocation = await SubjectAllocation.findByIdAndDelete(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Allocation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};