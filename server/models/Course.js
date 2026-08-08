const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  institutionCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  courseCode: { type: String, required: true, trim: true, uppercase: true },
  courseName: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  credits: { type: Number, min: 0, default: 4 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

courseSchema.index({ institutionCode: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model("Course", courseSchema);
