const express = require("express");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Timetable Route Hit:", req.method, req.originalUrl);
  next();
});

const {
  generateTimetable,
  getAllTimetables,
  getSingleTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

// Generate Timetable
router.post("/generate", generateTimetable);

// Get All Timetables
router.get("/", getAllTimetables);

// Get Single Timetable
router.get("/:id", getSingleTimetable);

// Delete Timetable
router.delete("/:id", deleteTimetable);

module.exports = router;