require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

mongoose.connect(process.env.MONGO_URI);

async function createUser() {
  try {
    const organization = await Organization.findOneAndUpdate(
      { slug: "neurovenus-internal" },
      {
        name: "Neurovenus Internal",
        slug: "neurovenus-internal",
        institution: "Neurovenus",
        plan: "custom",
        status: "active",
        maxActiveStudies: 999,
        maxParticipantsPerMonth: 99999,
        isActive: true,
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    const existingUser = await User.findOne({
      email: "researcher@neurovenus.com",
    });

    if (existingUser) {
      existingUser.organizationId = organization._id;
      existingUser.role = "admin";
      existingUser.institution = "Neurovenus";
      existingUser.isActive = true;

      await existingUser.save();

      console.log("User already exists. Updated organization.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Research Admin",
      email: "researcher@neurovenus.com",
      passwordHash,
      organizationId: organization._id,
      role: "admin",
      institution: "Neurovenus",
      isActive: true,
    });

    console.log("Researcher created:");
    console.log(user);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createUser();