const PLAN_LIMITS = {
  pilot: {
    maxActiveStudies: 3,
    maxParticipantsPerMonth: 500,
    collaborationEnabled: false,
  },

  standard: {
    maxActiveStudies: 10,
    maxParticipantsPerMonth: 6,
    collaborationEnabled: false,
  },

  institutional: {
    maxActiveStudies: Infinity,
    maxParticipantsPerMonth: Infinity,
    collaborationEnabled: true,
  },

  custom: {
    maxActiveStudies: Infinity,
    maxParticipantsPerMonth: Infinity,
    collaborationEnabled: true,
  },
};

const getPlanLimits = (organization) => {
  const plan = organization?.plan || "standard";

  const baseLimits =
    PLAN_LIMITS[plan] || PLAN_LIMITS.standard;

  return {
    maxActiveStudies:
      typeof organization?.maxActiveStudies === "number"
        ? organization.maxActiveStudies
        : baseLimits.maxActiveStudies,

    maxParticipantsPerMonth:
      typeof organization?.maxParticipantsPerMonth === "number"
        ? organization.maxParticipantsPerMonth
        : baseLimits.maxParticipantsPerMonth,

    collaborationEnabled:
      baseLimits.collaborationEnabled,
  };
};

module.exports = {
  PLAN_LIMITS,
  getPlanLimits,
};