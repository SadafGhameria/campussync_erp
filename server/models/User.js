const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "faculty", "student"],
      default: "student",
    },

    institution: {
      type: String,
      // required: true,
      trim: true,
    },

    institutionCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ institutionCode: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
