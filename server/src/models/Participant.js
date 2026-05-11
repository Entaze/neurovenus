const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    studyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Study",
      required: true,
    },

    participantCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    tokenId: {
      type: String,
      required: true,
      unique: true,
    },

    accessTokenHash: {
      type: String,
      required: true,
    },

    // Full participant access URL used in invitation and reminder emails.
    accessLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "invited",
        "active",
        "completed",
        "expired",
        "withdrawn",
      ],
      default: "invited",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Participant", participantSchema);