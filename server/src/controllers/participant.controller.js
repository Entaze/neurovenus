const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Study = require("../models/Study");
const Participant = require("../models/Participant");
const SessionRun = require("../models/SessionRun");
const Organization = require("../models/Organization");
const { getPlanLimits } = require("../utils/planLimits");

const {
  sendParticipantInviteEmail,
} = require("../utils/email");

const generateParticipantCode = () => {
  return `NV-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};

function deriveParticipantStatus(sessionRuns = []) {
  if (!sessionRuns.length) return "invited";

  const allCompleted = sessionRuns.every(
    (session) => session.status === "completed"
  );

  if (allCompleted) return "completed";

  const hasStarted = sessionRuns.some((session) =>
    ["in_progress", "completed", "available", "locked"].includes(session.status)
  );

  if (hasStarted) return "active";

  return "invited";
}

const getParticipantsByStudy = async (req, res) => {
  const userId = req.user?._id || req.user?.id || req.user?.sub;

  try {
    const { studyId } = req.query;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    if (!studyId) {
      return res.status(400).json({
        success: false,
        message: "studyId is required",
      });
    }

    const study = await Study.findOne({
      _id: studyId,
      organizationId,
      createdBy: userId,
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    const participants = await Participant.find({
      studyId,
      organizationId,
      createdBy: userId,
    }).sort({
      createdAt: -1,
    });

    const participantsWithSessions = await Promise.all(
      participants.map(async (participant) => {
        const sessionRuns = await SessionRun.find({
          participantId: participant._id,
        }).sort({ sessionOrder: 1 });

        const derivedStatus = deriveParticipantStatus(sessionRuns);

        return {
          ...participant.toObject(),
          status: derivedStatus,
          sessionRuns,
        };
      })
    );

    return res.json({
      success: true,
      participants: participantsWithSessions,
    });
  } catch (error) {
    console.error("Failed to fetch participants:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch participants",
    });
  }
};

const inviteParticipant = async (req, res) => {
  try {
    const { studyId, email, metadata = {} } = req.body;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    if (!studyId || !email) {
      return res.status(400).json({
        success: false,
        message: "studyId and email are required",
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

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const userId = req.user?._id || req.user?.id || req.user?.sub;

    const participantCountThisMonth =
      await Participant.countDocuments({
        organizationId,
        createdBy: userId,
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });

    if (participantCountThisMonth >= limits.maxParticipantsPerMonth) {
      return res.status(403).json({
        success: false,
        code: "PARTICIPANT_LIMIT_REACHED",
        message: `Your current plan allows up to ${limits.maxParticipantsPerMonth} participants per month.`,
      });
    }

    const study = await Study.findOne({
      _id: studyId,
      organizationId,
      createdBy: userId,
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    const studySessions = study?.protocol?.sessions?.length
      ? study.protocol.sessions
      : study.sessions || [];

    if (!studySessions.length) {
      return res.status(400).json({
        success: false,
        message: "Study has no configured sessions.",
      });
    }

    const tokenId = crypto.randomUUID();
    const tokenSecret = crypto.randomBytes(32).toString("hex");
    const rawToken = `${tokenId}.${tokenSecret}`;

    const accessTokenHash = await bcrypt.hash(rawToken, 10);
    const participantCode = generateParticipantCode();

    const inviteLink = `${process.env.CLIENT_URL}/participant/start?token=${rawToken}`;

    const participant = await Participant.create({
      studyId,
      organizationId,
      email,
      createdBy: userId,
      participantCode,
      tokenId,
      accessTokenHash,
      accessLink: inviteLink,
      metadata,
    });

    const now = new Date();

    const sessionRuns = await Promise.all(
      studySessions.map((session) => {
        const opensAt = session.order === 1 ? now : null;

        return SessionRun.create({
          participantId: participant._id,
          studyId,
          organizationId,
          createdBy: userId,
          sessionName: session.label || session.name,
          sessionOrder: session.order,
          protocolVersion: session.protocolVersion || "custom",
          status: session.order === 1 ? "available" : "locked",
          opensAt,
          expiresAt: null,
        });
      })
    );

    try {
      const emailResult = await sendParticipantInviteEmail({
        to: participant.email,
        participantCode: participant.participantCode,
        inviteLink,
        studyTitle: study.title,
      });

      if (emailResult) {
        console.log(`Invitation email sent to ${participant.email}`);
      } else {
        console.log(`Invitation email not sent to ${participant.email}`);
      }
    } catch (emailError) {
      console.error(
        `Failed to send invitation email to ${participant.email}:`,
        emailError
      );
    }

    return res.status(201).json({
      success: true,
      participant,
      sessionRuns,
      inviteLink,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to invite participant",
    });
  }
};

const validateParticipantAccess = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token required",
      });
    }

    const [tokenId] = token.split(".");

    const participant = await Participant.findOne({ tokenId });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const valid = await bcrypt.compare(token, participant.accessTokenHash);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const study = await Study.findById(participant.studyId);

    const sessionRuns = await SessionRun.find({
      participantId: participant._id,
    }).sort({ sessionOrder: 1 });

    let nextAction = {
      type: "completed",
      message: "All sessions completed.",
      sessionRun: null,
    };

    const now = new Date();

    for (const session of sessionRuns) {
      if (
        session.status === "locked" &&
        session.opensAt &&
        session.expiresAt &&
        now >= session.opensAt &&
        now <= session.expiresAt
      ) {
        session.status = "available";
        await session.save();
      }

      if (
        ["locked", "available", "in_progress"].includes(session.status) &&
        session.expiresAt &&
        now > session.expiresAt
      ) {
        session.status = "expired";
        await session.save();
      }
    }

    const refreshedSessionRuns = await SessionRun.find({
      participantId: participant._id,
    }).sort({ sessionOrder: 1 });

    const activeSession = refreshedSessionRuns.find((session) =>
      ["available", "in_progress"].includes(session.status)
    );

    const lockedSession = refreshedSessionRuns.find(
      (session) => session.status === "locked"
    );

    const expiredSession = refreshedSessionRuns.find(
      (session) => session.status === "expired"
    );

    if (activeSession) {
      nextAction = {
        type: "start_session",
        message: `${activeSession.sessionName} is available.`,
        sessionRun: activeSession,
      };
    } else if (lockedSession) {
      nextAction = {
        type: "wait_for_session",
        message: `${lockedSession.sessionName} is not available yet.`,
        sessionRun: lockedSession,
      };
    } else if (expiredSession) {
      nextAction = {
        type: "expired",
        message: `${expiredSession.sessionName} has expired.`,
        sessionRun: expiredSession,
      };
    }

    return res.json({
      success: true,
      participant,
      study,
      sessionRuns: refreshedSessionRuns,
      nextAction,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to validate access",
    });
  }
};

module.exports = {
  getParticipantsByStudy,
  inviteParticipant,
  validateParticipantAccess,
};