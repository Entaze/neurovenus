const PLAN_LIMITS = {
  pilot: {
    maxSeats: 5,
    maxActiveStudies: 20,
    maxParticipantsPerMonth: 1000,
  },

  standard: {
    maxSeats: 5,
    maxActiveStudies: 10,
    maxParticipantsPerMonth: 2000,
  },

  institutional: {
    maxSeats: Infinity,
    maxActiveStudies: Infinity,
    maxParticipantsPerMonth: Infinity,
  },

  custom: {
    maxSeats: Infinity,
    maxActiveStudies: Infinity,
    maxParticipantsPerMonth: Infinity,
  },
};

function getPlanLimits(organization) {
  if (!organization) {
    return PLAN_LIMITS.standard;
  }

  const plan = organization.plan || "standard";
  const baseLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.standard;

  return {
    maxSeats:
      typeof organization.maxSeats === "number"
        ? organization.maxSeats
        : baseLimits.maxSeats,

    maxActiveStudies:
      typeof organization.maxActiveStudies === "number"
        ? organization.maxActiveStudies
        : baseLimits.maxActiveStudies,

    maxParticipantsPerMonth:
      typeof organization.maxParticipantsPerMonth === "number"
        ? organization.maxParticipantsPerMonth
        : baseLimits.maxParticipantsPerMonth,
  };
}

module.exports = {
  PLAN_LIMITS,
  getPlanLimits,
};