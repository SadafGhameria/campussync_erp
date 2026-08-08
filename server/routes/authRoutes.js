const express = require("express");
const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
  registerAdmin,
  loginUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/login", loginUser);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully.",
    user: req.user,
  });
});

module.exports = router;


router.get(
  "/admin-dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: `Welcome ${req.user.name}!`,
    });
  }
);