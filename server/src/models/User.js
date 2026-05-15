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
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["researcher", "admin"],
      default: "researcher",
    },

    institution: {
      type: String,
      default: "",
    },

    // Subscription plan
    plan: {
      type: String,
      enum: ["pilot", "free", "pro", "institutional"],
      default: "pilot",
    },

    // Account active/inactive
    isActive: {
      type: Boolean,
      default: true,
    },

    // Force password change after first login
    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);