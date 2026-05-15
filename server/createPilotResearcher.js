require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGO_URI;

async function createPilotResearcher() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "jane.smith@example.com";
    const temporaryPassword = "TempPassword123!";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists:", email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const user = await User.create({
      name: "Dr Jane Smith",
      email,
      passwordHash,
      institution: "University of Cape Town",
      role: "researcher",
      plan: "pilot",
      isActive: true,
      mustChangePassword: true,
    });

    console.log("Pilot researcher created:");
    console.log({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      temporaryPassword,
      organization: user.organization,
      role: user.role,
      plan: user.plan,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create pilot researcher:", error);
    process.exit(1);
  }
}

createPilotResearcher();