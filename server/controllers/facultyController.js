// const bcrypt = require("bcryptjs");
// const Faculty = require("../models/Faculty");
// const Department = require("../models/Department");
// const User = require("../models/User");

// const respondError = (res, error) => {
//   const status = error.name === "CastError" || error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
//   return res.status(status).json({ success: false, message: status === 409 ? "A faculty member with that email or employee ID already exists." : status === 500 ? "Unable to process the faculty request." : error.message });
// };

// const validDepartment = (department, institutionCode) => Department.exists({ _id: department, institutionCode, isActive: true });

// const createFaculty = async (req, res) => {
//   let user;
//   try {
//     const { name, email, password, employeeId, department, designation, phone, joiningDate } = req.body;
//     if (!name || !email || !password || !employeeId || !department || !designation) return res.status(400).json({ success: false, message: "Name, email, password, employee ID, department and designation are required." });
//     if (!await validDepartment(department, req.user.institutionCode)) return res.status(400).json({ success: false, message: "Select an active department in your institution." });
//     if (await User.exists({ email: email.toLowerCase(), institutionCode: req.user.institutionCode })) return res.status(409).json({ success: false, message: "A user with this email already exists." });
//     user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: "faculty", institution: req.user.institution, institutionCode: req.user.institutionCode });
//     const faculty = await Faculty.create({ user: user._id, employeeId, department, designation, phone, joiningDate, institutionCode: req.user.institutionCode });
//     await faculty.populate([{ path: "user", select: "name email" }, { path: "department", select: "code name" }]);
//     return res.status(201).json({ success: true, message: "Faculty member created successfully.", data: faculty });
//   } catch (error) {
//     if (user) await User.findByIdAndDelete(user._id);
//     return respondError(res, error);
//   }
// };

// const getFaculty = async (req, res) => {
//   try {
//     const filter = { institutionCode: req.user.institutionCode };
//     if (req.query.department) filter.department = req.query.department;
//     if (req.query.status) filter.status = req.query.status;
//     const faculty = await Faculty.find(filter).populate("user", "name email profileImage isActive").populate("department", "code name").sort({ createdAt: -1 });
//     return res.json({ success: true, count: faculty.length, data: faculty });
//   } catch (error) { return respondError(res, error); }
// };

// const getFacultyById = async (req, res) => {
//   try {
//     const faculty = await Faculty.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode }).populate("user", "name email profileImage isActive").populate("department", "code name");
//     if (!faculty) return res.status(404).json({ success: false, message: "Faculty member not found." });
//     return res.json({ success: true, data: faculty });
//   } catch (error) { return respondError(res, error); }
// };

// const updateFaculty = async (req, res) => {
//   try {
//     const faculty = await Faculty.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode });
//     if (!faculty) return res.status(404).json({ success: false, message: "Faculty member not found." });
//     const { name, email, password, department, employeeId, designation, phone, joiningDate, status } = req.body;
//     if (department && !await validDepartment(department, req.user.institutionCode)) return res.status(400).json({ success: false, message: "Select an active department in your institution." });
//     if (email) {
//       const duplicate = await User.findOne({ email: email.toLowerCase(), institutionCode: req.user.institutionCode, _id: { $ne: faculty.user } });
//       if (duplicate) return res.status(409).json({ success: false, message: "A user with this email already exists." });
//     }
//     const userUpdates = {};
//     if (name) userUpdates.name = name;
//     if (email) userUpdates.email = email;
//     if (password) userUpdates.password = await bcrypt.hash(password, 10);
//     if (status) userUpdates.isActive = status === "Active";
//     if (Object.keys(userUpdates).length) await User.findByIdAndUpdate(faculty.user, userUpdates, { runValidators: true });
//     ["department", "employeeId", "designation", "phone", "joiningDate", "status"].forEach((field) => { if (req.body[field] !== undefined) faculty[field] = req.body[field]; });
//     await faculty.save();
//     await faculty.populate([{ path: "user", select: "name email profileImage isActive" }, { path: "department", select: "code name" }]);
//     return res.json({ success: true, message: "Faculty member updated successfully.", data: faculty });
//   } catch (error) { return respondError(res, error); }
// };

// const deleteFaculty = async (req, res) => {
//   try {
//     const faculty = await Faculty.findOneAndUpdate({ _id: req.params.id, institutionCode: req.user.institutionCode }, { status: "Inactive" }, { new: true });
//     if (!faculty) return res.status(404).json({ success: false, message: "Faculty member not found." });
//     await Promise.all([User.findByIdAndUpdate(faculty.user, { isActive: false }), Department.updateMany({ institutionCode: req.user.institutionCode, hod: faculty._id }, { hod: null })]);
//     return res.json({ success: true, message: "Faculty member deactivated successfully." });
//   } catch (error) { return respondError(res, error); }
// };

// module.exports = { createFaculty, getFaculty, getFacultyById, updateFaculty, deleteFaculty };

const bcrypt = require("bcryptjs");
const Faculty = require("../models/Faculty");
const User = require("../models/User");

// Common Error Response
const respondError = (res, error) => {
  const status =
    error.name === "CastError" || error.name === "ValidationError"
      ? 400
      : error.code === 11000
      ? 409
      : 500;

  return res.status(status).json({
    success: false,
    message:
      status === 409
        ? "Faculty with this Employee ID or Email already exists."
        : status === 500
        ? "Something went wrong."
        : error.message,
  });
};



// ======================
// CREATE FACULTY
// ======================

const createFaculty = async (req, res) => {
  let user;

  try {
    const {
      name,
      email,
      password,
      employeeId,
      branch,
      designation,
      subjects,
      phone,
      joiningDate,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !employeeId ||
      !branch ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email, Password, Employee ID, Branch and Designation are required.",
      });
    }

    // Email already exists?
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      institutionCode: req.user.institutionCode,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Create Login User

    user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "faculty",
      institution: req.user.institution,
      institutionCode: req.user.institutionCode,
    });

    // Create Faculty Profile

    const faculty = await Faculty.create({
      user: user._id,
      employeeId,
      branch,
      designation,
      subjects,
      phone,
      joiningDate,
      institutionCode: req.user.institutionCode,
    });

    await faculty.populate("user", "name email");

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully.",
      data: faculty,
    });
  } catch (error) {
    if (user) await User.findByIdAndDelete(user._id);

    return respondError(res, error);
  }
};



// ======================
// GET ALL FACULTY
// ======================

const getFaculty = async (req, res) => {
  try {
    const filter = {
      institutionCode: req.user.institutionCode,
    };

    if (req.query.branch) {
      filter.branch = req.query.branch;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const faculty = await Faculty.find(filter)
      .populate("user", "name email isActive")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    return respondError(res, error);
  }
};



// ======================
// GET SINGLE FACULTY
// ======================

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      _id: req.params.id,
      institutionCode: req.user.institutionCode,
    }).populate("user", "name email isActive");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    return res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    return respondError(res, error);
  }
};



// ======================
// UPDATE FACULTY
// ======================

const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      _id: req.params.id,
      institutionCode: req.user.institutionCode,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    const {
      name,
      email,
      password,
      employeeId,
      branch,
      designation,
      subjects,
      phone,
      joiningDate,
      status,
    } = req.body;

    // Update User

    const userUpdates = {};

    if (name) userUpdates.name = name;
    if (email) userUpdates.email = email.toLowerCase();

    if (password) {
      userUpdates.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdates).length) {
      await User.findByIdAndUpdate(faculty.user, userUpdates, {
        runValidators: true,
      });
    }

    // Update Faculty

    if (employeeId) faculty.employeeId = employeeId;
    if (branch) faculty.branch = branch;
    if (designation) faculty.designation = designation;
    if (subjects) faculty.subjects = subjects;
    if (phone) faculty.phone = phone;
    if (joiningDate) faculty.joiningDate = joiningDate;
    if (status) faculty.status = status;

    await faculty.save();

    await faculty.populate("user", "name email isActive");

    return res.json({
      success: true,
      message: "Faculty updated successfully.",
      data: faculty,
    });
  } catch (error) {
    return respondError(res, error);
  }
};



// ======================
// DELETE FACULTY
// ======================

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({
      _id: req.params.id,
      institutionCode: req.user.institutionCode,
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    await User.findByIdAndDelete(faculty.user);

    await Faculty.findByIdAndDelete(faculty._id);

    return res.json({
      success: true,
      message: "Faculty deleted successfully.",
    });
  } catch (error) {
    return respondError(res, error);
  }
};

module.exports = {
  createFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};