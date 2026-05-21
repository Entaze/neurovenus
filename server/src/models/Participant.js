const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
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

participantSchema.index({
  organizationId: 1,
  createdBy: 1,
});

module.exports = mongoose.model("Participant", participantSchema);