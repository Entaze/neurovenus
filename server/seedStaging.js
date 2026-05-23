require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function seedStaging() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB staging database");

    const password = "Password123!";
    const passwordHash = await bcrypt.hash(password, 12);

    /**
     * STANDARD WORKSPACE
     */
    const standardOrg = await Organization.findOneAndUpdate(
      { slug: "standard-researcher-workspace" },
      {
        name: "Independent Research Workspace",
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

    const standardUser = await User.findOneAndUpdate(
      { email: "standard.researcher@example.com" },
      {
        name: "Standard Researcher",
        email: "standard.researcher@example.com",
        passwordHash,
        organizationId: standardOrg._id,
        institution: standardOrg.institution,
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

    standardOrg.ownerUserId = standardUser._id;
    await standardOrg.save();

    /**
     * INSTITUTIONAL WORKSPACE
     */
    const institutionalOrg = await Organization.findOneAndUpdate(
      { slug: "stanford-cognitive-research-lab" },
      {
        name: "Stanford Cognitive Research Lab",
        slug: "stanford-cognitive-research-lab",
        institution: "Stanford University",
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

    const owner = await User.findOneAndUpdate(
      { email: "emily.carter@stanford.edu" },
      {
        name: "Dr. Emily Carter",
        email: "emily.carter@stanford.edu",
        passwordHash,
        organizationId: institutionalOrg._id,
        institution: institutionalOrg.institution,
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

    institutionalOrg.ownerUserId = owner._id;
    await institutionalOrg.save();

    const researchers = [
      {
        name: "David Mo",
        email: "david.mo@stanford.edu",
        role: "researcher",
      },
      {
        name: "Sarah Chen",
        email: "sarah.chen@stanford.edu",
        role: "researcher",
      },
      {
        name: "Michael Alvarez",
        email: "michael.alvarez@stanford.edu",
        role: "researcher",
      },
    ];

    for (const researcher of researchers) {
      await User.findOneAndUpdate(
        { email: researcher.email },
        {
          name: researcher.name,
          email: researcher.email,
          passwordHash,
          organizationId: institutionalOrg._id,
          institution: institutionalOrg.institution,
          role: researcher.role,
          status: "active",
          isActive: true,
          mustChangePassword: false,
          inviteTokenHash: "",
          inviteExpiresAt: null,
          invitedBy: owner._id,
          acceptedInviteAt: new Date(),
        },
        {
          returnDocument: "after",
          upsert: true,
        }
      );
    }

    console.log("");
    console.log("Staging seed complete");
    console.log("");
    console.log("Standard account:");
    console.log({
      email: "standard.researcher@example.com",
      password,
      plan: "standard",
    });

    console.log("");
    console.log("Institutional owner account:");
    console.log({
      email: "emily.carter@stanford.edu",
      password,
      plan: "institutional",
    });

    console.log("");
    console.log("Institutional researcher accounts:");
    researchers.forEach((researcher) => {
      console.log({
        email: researcher.email,
        password,
        role: researcher.role,
      });
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed staging database:", error);
    process.exit(1);
  }
}

seedStaging();