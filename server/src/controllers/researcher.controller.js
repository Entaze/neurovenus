const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organization");
const { getPlanLimits } = require("../utils/planLimits");

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.sub;
};

const getResearchers = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    const researchers = await User.find({
      organizationId,
      role: { $in: ["owner", "researcher"] },
    })
      .select("-passwordHash")
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      researchers,
    });
  } catch (error) {
    console.error("Failed to fetch researchers:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch researchers",
    });
  }
};

const inviteResearcher = async (req, res) => {
  try {
    const userId = getUserId(req);
    const organizationId = req.user?.organizationId;
    const { email } = req.body;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const inviter = await User.findOne({
      _id: userId,
      organizationId,
      isActive: true,
    });

    if (!inviter) {
      return res.status(403).json({
        success: false,
        message: "Inviter account not found or inactive.",
      });
    }

    const organization = await Organization.findById(organizationId);

    if (!organization || !organization.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization is not active",
      });
    }

    const limits = getPlanLimits(organization);

    if (!limits.collaborationEnabled) {
      return res.status(403).json({
        success: false,
        code: "RESEARCHER_INVITES_NOT_AVAILABLE",
        message:
          "Researcher collaboration is available on Institutional workspaces.",
      });
    }

    if (inviter.role !== "owner") {
      return res.status(403).json({
        success: false,
        code: "INSUFFICIENT_INVITE_PERMISSION",
        message: "Only workspace owners can invite researchers.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenHash = await bcrypt.hash(rawToken, 10);

    const inviteExpiresAt = new Date();
    inviteExpiresAt.setDate(inviteExpiresAt.getDate() + 7);

    const researcher = await User.create({
      organizationId,
      name: "Invited Researcher",
      email: normalizedEmail,
      passwordHash: "",
      role: "researcher",
      institution: organization.institution,
      status: "pending",
      isActive: false,
      mustChangePassword: true,
      inviteTokenHash,
      inviteExpiresAt,
      invitedBy: userId,
    });

    const inviteLink = `${process.env.CLIENT_URL}/researcher/accept-invite?token=${rawToken}`;

    console.log("Researcher invite link:", inviteLink);

    return res.status(201).json({
      success: true,
      researcher: {
        id: researcher._id,
        name: researcher.name,
        email: researcher.email,
        role: researcher.role,
        status: researcher.status,
        isActive: researcher.isActive,
      },
      inviteLink,
    });
  } catch (error) {
    console.error("Failed to invite researcher:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to invite researcher",
    });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    if (!token || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Token, name, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const pendingUsers = await User.find({
      status: "pending",
      isActive: false,
      inviteExpiresAt: { $gt: new Date() },
    }).select("+inviteTokenHash");

    let invitedUser = null;

    for (const user of pendingUsers) {
      if (!user.inviteTokenHash) continue;

      const matches = await bcrypt.compare(token, user.inviteTokenHash);

      if (matches) {
        invitedUser = user;
        break;
      }
    }

    if (!invitedUser) {
      return res.status(400).json({
        success: false,
        message: "This invitation is invalid or has expired.",
      });
    }

    invitedUser.name = name.trim();
    invitedUser.passwordHash = await bcrypt.hash(password, 12);
    invitedUser.status = "active";
    invitedUser.isActive = true;
    invitedUser.mustChangePassword = false;
    invitedUser.acceptedInviteAt = new Date();
    invitedUser.inviteTokenHash = "";
    invitedUser.inviteExpiresAt = null;

    await invitedUser.save();

    return res.json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error("Failed to accept invite:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept invitation.",
    });
  }
};

module.exports = {
  getResearchers,
  inviteResearcher,
  acceptInvite,
};