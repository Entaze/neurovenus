require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");

mongoose.connect(process.env.MONGO_URI);

async function createUser() {
  try {
    const existingUser = await User.findOne({
      email: "researcher@neurovenus.com",
    });

    if (existingUser) {
      console.log("User already exists");
      process.exit();
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Research Admin",
      email: "researcher@neurovenus.com",
      passwordHash,
      role: "admin",
      institution: "Neurovenus",
    });

    console.log("Researcher created:");
    console.log(user);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createUser();