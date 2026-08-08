const Department = require("../models/Department");
const Faculty = require("../models/Faculty");

const respondError = (res, error) => {
  const status = error.name === "CastError" || error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
  return res.status(status).json({ success: false, message: status === 409 ? "A department with that code or name already exists." : status === 500 ? "Unable to process the department request." : error.message });
};

const checkHod = async (hod, institutionCode) => !hod || Faculty.exists({ _id: hod, institutionCode, status: "Active" });
const withDetails = (query) => query.populate({ path: "hod", select: "employeeId designation", populate: { path: "user", select: "name email" } });

const createDepartment = async (req, res) => {
  try {
    const { code, name, description, hod } = req.body;
    if (!code || !name) return res.status(400).json({ success: false, message: "Department code and name are required." });
    if (!await checkHod(hod, req.user.institutionCode)) return res.status(400).json({ success: false, message: "Select an active faculty member as HOD." });
    const department = await Department.create({ code, name, description, hod: hod || null, institutionCode: req.user.institutionCode });
    return res.status(201).json({ success: true, message: "Department created successfully.", data: department });
  } catch (error) { return respondError(res, error); }
};

const getDepartments = async (req, res) => {
  try {
    const filter = {
      institutionCode: req.user.institutionCode,
    };

    if (req.query.active !== "all") {
      filter.status = "Active";
    }

    const departments = await withDetails(
      Department.find(filter).sort({ name: 1 })
    );

    return res.json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    return respondError(res, error);
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await withDetails(Department.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode }));
    if (!department) return res.status(404).json({ success: false, message: "Department not found." });
    return res.json({ success: true, data: department });
  } catch (error) { return respondError(res, error); }
};

const updateDepartment = async (req, res) => {
  try {
    const { hod, institutionCode: _institutionCode, ...updates } = req.body;
    if (hod !== undefined && !await checkHod(hod, req.user.institutionCode)) return res.status(400).json({ success: false, message: "Select an active faculty member as HOD." });
    if (hod !== undefined) updates.hod = hod || null;
    const department = await Department.findOneAndUpdate({ _id: req.params.id, institutionCode: req.user.institutionCode }, updates, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ success: false, message: "Department not found." });
    return res.json({ success: true, message: "Department updated successfully.", data: department });
  } catch (error) { return respondError(res, error); }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({ _id: req.params.id, institutionCode: req.user.institutionCode });
    if (!department) return res.status(404).json({ success: false, message: "Department not found." });
    if (await Faculty.exists({ institutionCode: req.user.institutionCode, department: department._id, status: "Active" })) return res.status(400).json({ success: false, message: "Move or deactivate the department's faculty before deactivating it." });
    department.status = "Inactive";
    await department.save();
    return res.json({ success: true, message: "Department deactivated successfully." });
  } catch (error) { return respondError(res, error); }
};

module.exports = { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment };
