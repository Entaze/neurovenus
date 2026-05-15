// server/models/Feedback.js

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    organizationName: {
      type: String,
      default: "Pilot Workspace Org",
      trim: true,
    },

    organizationPlan: {
      type: String,
      enum: ["pilot", "individual", "lab", "institution", "enterprise"],
      default: "pilot",
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["bug", "feature", "improvement", "general"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: [
        "studies",
        "participants",
        "exports",
        "billing",
        "team_access",
        "performance",
        "other",
      ],
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    internalNotes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "planned",
        "in_progress",
        "released",
        "closed",
      ],
      default: "submitted",
      index: true,
    },

    attachments: {
      type: [
        {
          filename: String,
          url: String,
          mimeType: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);