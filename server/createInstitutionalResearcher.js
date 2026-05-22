require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function createInstitutionalResearcher() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "institution.owner@example.com";
    const temporaryPassword = "InstitutionPassword123!";

    const organization = await Organization.findOneAndUpdate(
      { slug: "uct-institutional-workspace" },
      {
        name: "UCT Institutional Workspace",
        slug: "uct-institutional-workspace",
        institution: "University of Cape Town",
        plan: "institutional",
        status: "active",
        maxSeats: null,
        maxActiveStudies: null,
        maxParticipantsPerMonth: null,
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

      organization.ownerUserId = existingUser._id;
      await organization.save();

      console.log("Institutional owner already exists. Updated:");
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
      name: "Institutional Owner",
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

    console.log("Institutional owner created:");
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
    console.error("Failed to create institutional owner:", error);
    process.exit(1);
  }
}

createInstitutionalResearcher();