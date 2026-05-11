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
      enum: ["v1", "v2"],
      required: true,
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

module.exports = mongoose.model("SessionRun", sessionRunSchema);