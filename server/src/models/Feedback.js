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
        "assessments",
        "exports",
        "authentication",
        "notifications",
        "billing",
        "documentation",
        "team_access",
        "performance",
        "other",
      ],
      required: true,
      index: true,
    },

    impactOnWorkflow: {
      type: String,
      enum: [
        "minor_inconvenience",
        "slows_me_down",
        "blocks_my_study",
        "critical_issue",
      ],
      default: "minor_inconvenience",
    },

    scientificImportance: {
      type: String,
      enum: [
        "nice_to_have",
        "useful",
        "important",
        "essential",
      ],
      default: "nice_to_have",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical",],
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