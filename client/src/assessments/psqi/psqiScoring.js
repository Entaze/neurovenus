// client/src/assessments/psqi/psqiScoring.js

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function timeToMinutes(timeString) {
  if (!timeString || typeof timeString !== "string") {
    return null;
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function calculateTimeInBedHours(bedtime, wakeTime) {
  const bedMinutes = timeToMinutes(bedtime);
  const wakeMinutes = timeToMinutes(wakeTime);

  if (bedMinutes === null || wakeMinutes === null) {
    return null;
  }

  let difference = wakeMinutes - bedMinutes;

  // Crosses midnight.
  if (difference <= 0) {
    difference += 24 * 60;
  }

  return difference / 60;
}

function scoreSleepLatency(minutesToSleep, latencyFrequency) {
  const minutes = toNumber(minutesToSleep);
  const frequency = toNumber(latencyFrequency);

  const minutesScore =
    minutes <= 15
      ? 0
      : minutes <= 30
      ? 1
      : minutes <= 60
      ? 2
      : 3;

  const combined = minutesScore + frequency;

  if (combined === 0) return 0;
  if (combined <= 2) return 1;
  if (combined <= 4) return 2;
  return 3;
}

function scoreSleepDuration(hoursSlept) {
  const hours = toNumber(hoursSlept);

  if (hours > 7) return 0;
  if (hours >= 6) return 1;
  if (hours >= 5) return 2;
  return 3;
}

function scoreSleepEfficiency(hoursSlept, timeInBedHours) {
  if (!timeInBedHours || timeInBedHours <= 0) {
    return 0;
  }

  const hours = toNumber(hoursSlept);
  const efficiency = (hours / timeInBedHours) * 100;

  if (efficiency >= 85) return 0;
  if (efficiency >= 75) return 1;
  if (efficiency >= 65) return 2;
  return 3;
}

function scoreSleepDisturbances(responses) {
  const disturbanceKeys = [
    "wakeDuringNight",
    "bathroomUse",
    "breathingDiscomfort",
    "coughOrSnore",
    "tooCold",
    "tooHot",
    "badDreams",
    "pain",
    "otherSleepProblem",
  ];

  const total = disturbanceKeys.reduce(
    (sum, key) => sum + toNumber(responses[key]),
    0
  );

  if (total === 0) return 0;
  if (total <= 9) return 1;
  if (total <= 18) return 2;
  return 3;
}

function scoreDaytimeDysfunction(troubleStayingAwake, enthusiasmDifficulty) {
  const total =
    toNumber(troubleStayingAwake) + toNumber(enthusiasmDifficulty);

  if (total === 0) return 0;
  if (total <= 2) return 1;
  if (total <= 4) return 2;
  return 3;
}

export function scorePSQI(responses) {
  const timeInBedHours = calculateTimeInBedHours(
    responses.usualBedtime,
    responses.usualWakeTime
  );

  const componentScores = {
    subjectiveSleepQuality: toNumber(
      responses.subjectiveSleepQuality
    ),

    sleepLatency: scoreSleepLatency(
      responses.sleepLatencyMinutes,
      responses.sleepLatencyFrequency
    ),

    sleepDuration: scoreSleepDuration(
      responses.hoursSlept
    ),

    habitualSleepEfficiency: scoreSleepEfficiency(
      responses.hoursSlept,
      timeInBedHours
    ),

    sleepDisturbances: scoreSleepDisturbances(
      responses
    ),

    sleepMedicationUse: toNumber(
      responses.sleepMedicationUse
    ),

    daytimeDysfunction: scoreDaytimeDysfunction(
      responses.troubleStayingAwake,
      responses.enthusiasmDifficulty
    ),
  };

  const globalScore = Object.values(componentScores).reduce(
    (sum, score) => sum + score,
    0
  );

  return {
    componentScores,
    globalScore,
    classification:
      globalScore > 5
        ? "poor_sleep_quality"
        : "good_sleep_quality",
    metadata: {
      scoringVersion: "psqi_standard_v1",
      recallPeriod: "past_month",
      timeInBedHours,
    },
  };
}