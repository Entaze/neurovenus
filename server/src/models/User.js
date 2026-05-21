const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

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
      required: false,
      default: "",
    },

    role: {
      type: String,
      enum: ["owner", "admin", "researcher", "viewer", "superadmin"],
      default: "researcher",
      index: true,
    },

    institution: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "active",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    inviteTokenHash: {
      type: String,
      default: "",
      select: false,
    },

    inviteExpiresAt: {
      type: Date,
      default: null,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedInviteAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);