require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");
const Organization = require("./src/models/Organization");

const MONGO_URI = process.env.MONGO_URI;

async function createStanfordInstitutionalWorkspace() {
  try {
    await mongoose.connect(MONGO_URI);

    const ownerEmail = "emily.carter@stanford.edu";
    const temporaryPassword = "Password123!";

    const organization = await Organization.findOneAndUpdate(
      { slug: "stanford-cognitive-research-lab" },
      {
        name: "Stanford Cognitive Research Lab",
        slug: "stanford-cognitive-research-lab",
        institution: "Stanford University",
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

    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const owner = await User.findOneAndUpdate(
      { email: ownerEmail },
      {
        name: "Dr. Emily Carter",
        email: ownerEmail,
        passwordHash,
        organizationId: organization._id,
        institution: organization.institution,
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

    organization.ownerUserId = owner._id;
    await organization.save();

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
          organizationId: organization._id,
          institution: organization.institution,
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

    console.log("Stanford institutional workspace ready:");
    console.log({
      organizationName: organization.name,
      institution: organization.institution,
      plan: organization.plan,
      owner: {
        name: owner.name,
        email: owner.email,
        password: temporaryPassword,
      },
      researchers: researchers.map((researcher) => ({
        name: researcher.name,
        email: researcher.email,
        password: temporaryPassword,
      })),
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to create Stanford institutional workspace:", error);
    process.exit(1);
  }
}

createStanfordInstitutionalWorkspace();