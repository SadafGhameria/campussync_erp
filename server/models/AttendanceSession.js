const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema({
  institutionCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, trim: true },
  endTime: { type: String, default: "", trim: true },
  status: { type: String, enum: ["Scheduled", "In Progress", "Completed"], default: "In Progress" },
}, { timestamps: true });

attendanceSessionSchema.index({ institutionCode: 1, course: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceSession", attendanceSessionSchema);
