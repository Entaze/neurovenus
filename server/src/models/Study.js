const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: "v1",
      enum: ["v1", "v2"],
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

    order: {
      type: Number,
      required: true,
    },

    protocolVersion: {
      type: String,
      required: true,
      enum: ["v1", "v2"],
    },

    unlockAfterHours: {
      type: Number,
      default: 0,
    },

    expiresAfterHours: {
      type: Number,
      default: 24,
    },

    tasks: [taskSchema],
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
      default: "combined-v1-v2",
      enum: ["v1", "v2", "combined-v1-v2"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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