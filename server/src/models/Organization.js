const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    institution: {
      type: String,
      default: "",
      trim: true,
    },

    plan: {
      type: String,
      enum: ["pilot", "standard", "institutional", "custom"],
      default: "standard",
      index: true,
    },

    status: {
      type: String,
      enum: ["trial", "active", "past_due", "cancelled", "expired"],
      default: "trial",
      index: true,
    },

    maxSeats: {
      type: Number,
      default: 1,
    },

    maxActiveStudies: {
      type: Number,
      default: 10,
    },

    maxParticipantsPerMonth: {
      type: Number,
      default: 2000,
    },

    billingEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    pilotStartDate: {
      type: Date,
      default: null,
    },

    pilotEndDate: {
      type: Date,
      default: null,
    },

    subscriptionStartDate: {
      type: Date,
      default: null,
    },

    subscriptionEndDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", organizationSchema);