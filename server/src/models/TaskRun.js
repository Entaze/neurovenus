const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema(
  {
    trialNumber: Number,

    stimulus: String,

    expectedResponse: String,

    actualResponse: String,

    correct: Boolean,

    reactionTimeMs: Number,

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const taskRunSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },

    sessionRunId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionRun",
      required: true,
    },

    studyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Study",
      required: true,
    },

    taskType: {
      type: String,
      required: true,
    },

    taskVersion: {
      type: String,
      default: "v1",
    },

    startedAt: Date,

    completedAt: Date,

    summary: {
      type: Object,
      default: {},
    },

    trials: [trialSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TaskRun", taskRunSchema);