const Organization = require("../models/Organization");
const Study = require("../models/Study");
const Participant = require("../models/Participant");
const { getPlanLimits } = require("../utils/planLimits");

const getOrganizationUsage = async (req, res) => {
  try {
    const organizationId = req.user?.organizationId;
    const userRole = req.user?.role;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const limits = getPlanLimits(organization);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const [activeStudiesUsed, participantsThisMonth] = await Promise.all([
      Study.countDocuments({
        organizationId,
        active: true,
      }),

      Participant.countDocuments({
        organizationId,
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      }),
    ]);

    const collaborationEnabled = Boolean(limits.collaborationEnabled);
    const canInviteResearchers =
      collaborationEnabled && userRole === "owner";

    return res.json({
      success: true,

      organization: {
        id: organization._id,
        name: organization.name,
        institution: organization.institution,
        plan: organization.plan,
        status: organization.status,
        workspaceType: collaborationEnabled
          ? "institutional"
          : "individual",
      },

      permissions: {
        collaborationEnabled,
        canInviteResearchers,
      },

      limits: {
        maxActiveStudies: limits.maxActiveStudies,
        maxParticipantsPerMonth: limits.maxParticipantsPerMonth,
      },

      usage: {
        activeStudiesUsed,
        participantsThisMonth,
      },

      remaining: {
        activeStudiesRemaining:
          limits.maxActiveStudies === Infinity
            ? null
            : Math.max(0, limits.maxActiveStudies - activeStudiesUsed),

        participantsRemaining:
          limits.maxParticipantsPerMonth === Infinity
            ? null
            : Math.max(
                0,
                limits.maxParticipantsPerMonth - participantsThisMonth
              ),
      },
    });
  } catch (error) {
    console.error("Failed to fetch organization usage:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch organization usage",
      error: error.message,
    });
  }
};

module.exports = {
  getOrganizationUsage,
};