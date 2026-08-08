const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  institutionCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
  markedAt: { type: Date, default: Date.now },
}, { timestamps: true });

attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceRecord", attendanceRecordSchema);
