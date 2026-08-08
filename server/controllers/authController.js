const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const createInstitutionCode = (institution) => {
  const letters = institution.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  return `${letters || "CAMPUS"}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

// ================= REGISTER ADMIN =================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, institution, institutionCode } = req.body;

    if (!name || !email || !password || !institution) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const code = (institutionCode || createInstitutionCode(institution)).trim().toUpperCase();
    const codeInUse = await User.exists({ institutionCode: code });
    if (codeInUse) {
      return res.status(409).json({ success: false, message: "Institution code already exists." });
    }

    const existingUser = await User.exists({ email: email.toLowerCase(), institutionCode: code });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists for this institution." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      institution,
      institutionCode: code,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        institution: admin.institution,
        institutionCode: admin.institutionCode,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password, institutionCode } = req.body;

    if (!email || !password || !institutionCode) {
      return res.status(400).json({
        success: false,
        message: "Institution code, email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      institutionCode: institutionCode.trim().toUpperCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "This account is inactive." });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        institutionCode: user.institutionCode,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginUser,
};
