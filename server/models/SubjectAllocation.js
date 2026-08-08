const mongoose = require("mongoose");

const subjectAllocationSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
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
      min: 1,
      max: 8,
    },

    division: {
      type: String,
      required: true,
      uppercase: true,
    },

    lecturesPerWeek: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    lectureType: {
      type: String,
      enum: ["Theory", "Lab"],
      default: "Theory",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SubjectAllocation",
  subjectAllocationSchema
);