require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function createStandardResearcher() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "standard.researcher@example.com";
    const temporaryPassword = "StandardPassword123!";

    const organization = await Organization.findOneAndUpdate(
      { slug: "standard-researcher-workspace" },
      {
        name: "Standard Researcher Workspace",
        slug: "standard-researcher-workspace",
        institution: "Independent Researcher",
        plan: "standard",
        status: "active",
        maxActiveStudies: 10,
        maxParticipantsPerMonth: 2000,
        isActive: true,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.organizationId = organization._id;
      existingUser.role = "owner";
      existingUser.institution = organization.institution;
      existingUser.status = "active";
      existingUser.isActive = true;
      existingUser.mustChangePassword = false;

      await existingUser.save();

      console.log("Standard researcher already exists. Updated:");
      console.log({
        email: existingUser.email,
        password: temporaryPassword,
        organizationName: organization.name,
        plan: organization.plan,
      });

      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const user = await User.create({
      name: "Standard Researcher",
      email,
      passwordHash,
      organizationId: organization._id,
      institution: organization.institution,
      role: "owner",
      status: "active",
      isActive: true,
      mustChangePassword: false,
    });

    organization.ownerUserId = user._id;
    await organization.save();

    console.log("Standard researcher created:");
    console.log({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      temporaryPassword,
      organizationId: organization._id.toString(),
      organizationName: organization.name,
      plan: organization.plan,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create standard researcher:", error);
    process.exit(1);
  }
}

createStandardResearcher();