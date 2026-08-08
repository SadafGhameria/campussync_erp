const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    maxLecturesPerDay: {
    type: Number,
    default: 4
},

maxLecturesPerWeek: {
    type: Number,
    default: 20
},

preferredDays: {
    type: [String],
    default: []
}
  },
  {
    timestamps: true,
  }
);

facultySchema.index(
  { institutionCode: 1, employeeId: 1 },
  { unique: true }
);



module.exports = mongoose.model("Faculty", facultySchema);