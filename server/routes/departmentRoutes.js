const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require("../controllers/departmentController");

const router = express.Router();

router.route("/").get(protect, getDepartments).post(protect, authorize("admin"), createDepartment);
router.route("/:id").get(protect, getDepartmentById).put(protect, authorize("admin"), updateDepartment).delete(protect, authorize("admin"), deleteDepartment);

module.exports = router;
