const mongoose = require("mongoose");

const trialSchema = new mongoose.Schema(
  {
    trialNumber: Number,

    trialPhase: String,
    condition: String,
    mode: String,
    spanLength: Number,
    itemId: String,
    itemLabel: String,
    section: String,
    responseType: String,

    stimulus: String,
    expectedResponse: String,
    actualResponse: String,

    correct: Boolean,
    reactionTimeMs: Number,
    responseTimeMs: Number,

    startedAt: Date,
    answeredAt: Date,

    isPractice: Boolean,

    // Finger Tapping round-level metrics
    totalCharactersTyped: Number,
    correctSequences: Number,
    possibleSequences: Number,
    accuracy: Number,

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    _id: false,
    strict: false,
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

module.exports = mongoose.model("AssessmentRun", taskRunSchema);