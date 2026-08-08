const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  institutionCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  academicYear: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  status: { type: String, enum: ["Active", "Completed", "Dropped"], default: "Active" },
}, { timestamps: true });

enrollmentSchema.index({ institutionCode: 1, student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
