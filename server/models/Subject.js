const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    lectureHoursPerWeek: {
      type: Number,
      default: 0,
    },

    labHoursPerWeek: {
      type: Number,
      default: 0,
    },

    credits: {
      type: Number,
      default: 0,
    },

    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ],

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

subjectSchema.index(
  {
    institutionCode: 1,
    subjectCode: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Subject", subjectSchema);