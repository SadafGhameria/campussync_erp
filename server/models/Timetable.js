const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },

    period: {
      type: Number,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    lectureType: {
      type: String,
      enum: ["Theory", "Lab"],
      default: "Theory",
    },

    room: {
    type: String,
    default: "",
},
  },
  { _id: false }
);

const periodConfigSchema = new mongoose.Schema(
  {
    period: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    label: { type: String, default: "" },
    isBreak: { type: Boolean, default: false },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    timetableName: {
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
    },

    division: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: [
        "Generated",
        "Draft",
        "Archived"
      ],
      default: "Generated",
    },
    

    generatedBy: {
      type: String,
      default: "System",
    },

    remarks: {
      type: String,
      default: "",
    },

    // Working days used to generate this timetable, e.g. ["Monday", ... "Saturday"]
    workingDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },

    // Full period layout (including break/lunch rows) used to generate this
    // timetable, so the frontend can render exactly what was generated
    // instead of relying on a hardcoded, possibly out-of-sync copy.
    periodConfig: {
      type: [periodConfigSchema],
      default: undefined,
    },

    slots: [slotSchema],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate versions
timetableSchema.index({
  institutionCode: 1,
  department: 1,
  semester: 1,
  division: 1,
  academicYear: 1,
  version: 1,
});

module.exports = mongoose.model(
  "Timetable",
  timetableSchema
);