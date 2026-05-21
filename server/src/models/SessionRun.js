const mongoose = require("mongoose");

const sessionRunSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },

    studyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Study",
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionName: {
      type: String,
      required: true,
    },

    sessionOrder: {
      type: Number,
      required: true,
    },

    protocolVersion: {
      type: String,
      required: true,
      default: "custom",
      enum: ["v1", "v2", "combined-v1-v2", "custom"],
    },

    status: {
      type: String,
      enum: ["locked", "available", "in_progress", "completed", "expired"],
      default: "locked",
    },

    opensAt: Date,
    expiresAt: Date,
    startedAt: Date,
    completedAt: Date,

    reminderSentAt: Date,

    currentTaskIndex: {
      type: Number,
      default: 0,
    },

    completedTaskTypes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

sessionRunSchema.index({
  organizationId: 1,
  createdBy: 1,
});

module.exports = mongoose.model("SessionRun", sessionRunSchema);