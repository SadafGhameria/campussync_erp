const express = require("express");

const router = express.Router();

const {
  createSubjectAllocation,
  getAllSubjectAllocations,
  getSubjectAllocation,
  updateSubjectAllocation,
  deleteSubjectAllocation,
} = require("../controllers/subjectAllocationController");

// Create
router.post("/", createSubjectAllocation);

// Get All
router.get("/", getAllSubjectAllocations);

// Get One
router.get("/:id", getSubjectAllocation);

// Update
router.put("/:id", updateSubjectAllocation);

// Delete
router.delete("/:id", deleteSubjectAllocation);

module.exports = router;