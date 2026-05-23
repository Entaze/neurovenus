require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function createPilotResearcher() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "jane.smith@example.com";
    const temporaryPassword = "TempPassword123!";

    const organization = await Organization.findOneAndUpdate(
      { slug: "pilot-workspace-org" },
      {
        name: "Pilot Workspace Org",
        slug: "pilot-workspace-org",
        institution: "University of Cape Town",
        plan: "pilot",
        status: "trial",
        maxActiveStudies: 3,
        maxParticipantsPerMonth: 500,
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
      existingUser.institution = existingUser.institution || "University of Cape Town";
      existingUser.status = "active";
      existingUser.isActive = true;

      await existingUser.save();

      console.log("Pilot researcher already exists. Updated organization:");
      console.log({
        id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        organizationId: organization._id.toString(),
        organizationName: organization.name,
        role: existingUser.role,
        plan: organization.plan,
      });

      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const user = await User.create({
      name: "Dr Jane Smith",
      email,
      passwordHash,
      organizationId: organization._id,
      institution: "University of Cape Town",
      role: "owner",
      status: "active",
      isActive: true,
      mustChangePassword: true,
    });

    console.log("Pilot researcher created:");
    console.log({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      temporaryPassword,
      organizationId: organization._id.toString(),
      organizationName: organization.name,
      role: user.role,
      plan: organization.plan,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create pilot researcher:", error);
    process.exit(1);
  }
}

createPilotResearcher();