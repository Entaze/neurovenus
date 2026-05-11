const Participant = require("../models/Participant");
const SessionRun = require("../models/SessionRun");
const Study = require("../models/Study");
const { sendSessionReminderEmail } = require("./email");

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

let reminderInterval = null;
let isChecking = false;

const runReminderCheck = async () => {
  if (isChecking) {
    return;
  }

  isChecking = true;

  try {
    const now = new Date();

    const sessions = await SessionRun.find({
      opensAt: { $lte: now },
      sessionOrder: { $gt: 1 },
      $or: [
        { reminderSentAt: null },
        { reminderSentAt: { $exists: false } },
      ],
    })
      .sort({ opensAt: 1 })
      .limit(50);

    for (const session of sessions) {
      const reminderEligibleStatuses = [
        "available",
        "locked",
        "in_progress",
      ];

      if (!reminderEligibleStatuses.includes(session.status)) {
        continue;
      }

      const participant = await Participant.findById(session.participantId);
      const study = await Study.findById(session.studyId);

      if (!participant) {
        continue;
      }

      if (!study) {
        continue;
      }

      if (!participant.email) {
        continue;
      }

      if (!participant.accessLink) {
        continue;
      }

      const emailResult = await sendSessionReminderEmail({
        to: participant.email,
        participantCode: participant.participantCode,
        sessionName: session.sessionName,
        studyTitle: study.title,
        sessionLink: participant.accessLink,
        opensAt: session.opensAt,
        expiresAt: session.expiresAt,
      });

      if (!emailResult) {
        continue;
      }

      session.reminderSentAt = new Date();
      await session.save();
    }
  } catch (error) {
    console.error("Reminder scheduler failed:", error);
  } finally {
    isChecking = false;
  }
};

const startReminderScheduler = () => {
  if (reminderInterval) {
    return;
  }

  runReminderCheck();

  reminderInterval = setInterval(runReminderCheck, CHECK_INTERVAL_MS);
};

module.exports = {
  startReminderScheduler,
  runReminderCheck,
};