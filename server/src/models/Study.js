const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: "v1",
    },

    order: {
      type: Number,
      default: 1,
    },

    config: {
      type: Object,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      required: true,
    },

    protocolVersion: {
      type: String,
      default: "custom",
    },

    offsetDays: {
      type: Number,
      default: 0,
    },

    delayValue: {
      type: Number,
      default: 0,
    },

    delayUnit: {
      type: String,
      enum: ["minutes", "hours", "days"],
      default: "days",
    },

    unlockAfterHours: {
      type: Number,
      default: 0,
    },

    expiresAfterHours: {
      type: Number,
      default: 24,
    },

    assessments: [assessmentSchema],

    // Temporary backward compatibility with existing Cognimeo data/logic.
    tasks: [assessmentSchema],
  },
  {
    _id: false,
  }
);

const studySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    protocolVersion: {
      type: String,
      default: "custom",
    },

    protocol: {
      type: {
        type: String,
        default: "custom",
      },

      version: {
        type: String,
        default: "v1",
      },

      sessions: {
        type: [sessionSchema],
        default: [],
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Temporary backward compatibility with existing app screens/controllers.
    sessions: [sessionSchema],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Study", studySchema);