// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { authorize } = require("../middleware/roleMiddleware");
// const { createFaculty, getFaculty, getFacultyById, updateFaculty, deleteFaculty } = require("../controllers/facultyController");

// const router = express.Router();

// router.route("/").get(protect, authorize("admin"), getFaculty).post(protect, authorize("admin"), createFaculty);
// router.route("/:id").get(protect, authorize("admin"), getFacultyById).put(protect, authorize("admin"), updateFaculty).delete(protect, authorize("admin"), deleteFaculty);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin only
router.post("/", protect, authorize("admin"), createFaculty);
router.get("/", protect, authorize("admin"), getFaculty);
router.get("/:id", protect, authorize("admin"), getFacultyById);
router.put("/:id", protect, authorize("admin"), updateFaculty);
router.delete("/:id", protect, authorize("admin"), deleteFaculty);

module.exports = router;