const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      default: null,
    },

    totalSemesters: {
      type: Number,
      default: 8,
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

// One department code per institution
departmentSchema.index(
  {
    institutionCode: 1,
    code: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Department", departmentSchema);