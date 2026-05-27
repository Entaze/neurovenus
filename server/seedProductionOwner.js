require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function seedProductionOwner() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB production database");

    const crypto = require("crypto");

    const password = crypto.randomBytes(18).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 12);

    const org = await Organization.findOneAndUpdate(
      { slug: "entaze-neurovenus" },
      {
        name: "Neurovenus Admin Workspace",
        slug: "entaze-neurovenus",
        institution: "Entaze Software",
        plan: "institutional",
        status: "active",
        maxActiveStudies: null,
        maxParticipantsPerMonth: null,
        isActive: true,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    const user = await User.findOneAndUpdate(
      { email: "mowems@gmail.com" },
      {
        name: "David Mo",
        email: "mowems@gmail.com",
        passwordHash,
        organizationId: org._id,
        institution: org.institution,
        role: "owner",
        status: "active",
        isActive: true,
        mustChangePassword: false,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    org.ownerUserId = user._id;
    await org.save();

    console.log("Production owner created:");
    console.log({
      email: user.email,
      password,
      plan: org.plan,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed production owner:", error);
    process.exit(1);
  }
}

seedProductionOwner();