const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    section: {
      type: String,
      default: "A",
    },

    admissionYear: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
    },

    guardianName: {
      type: String,
    },

    guardianPhone: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },

    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ institutionCode: 1, studentId: 1 }, { unique: true });
studentSchema.index({ institutionCode: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
