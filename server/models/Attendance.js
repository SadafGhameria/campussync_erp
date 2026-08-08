const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student, subject, and date
attendanceSchema.index(
  {
    institutionCode: 1,
    student: 1,
    subject: 1,
    date: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);