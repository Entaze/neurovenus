const Participant = require("../models/Participant");
const SessionRun = require("../models/SessionRun");
const Study = require("../models/Study");
const { sendSessionReminderEmail } = require("./email");

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

let reminderInterval = null;
let isChecking = false;

const runReminderCheck = async () => {
  if (isChecking) {
    console.log("Reminder check already running. Skipping this cycle.");
    return;
  }

  isChecking = true;

  try {
    const now = new Date();

    console.log("Running reminder check at:", now.toISOString());

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

    console.log(`Reminder candidates found: ${sessions.length}`);

    for (const session of sessions) {
      const reminderEligibleStatuses = ["available", "locked", "in_progress"];

      if (!reminderEligibleStatuses.includes(session.status)) {
        console.log(
          `Skipping ${session.sessionName}: status is "${session.status}", not reminder eligible.`
        );
        continue;
      }

      const participant = await Participant.findById(session.participantId);
      const study = await Study.findById(session.studyId);

      if (!participant) {
        console.log(`Skipping ${session.sessionName}: participant not found.`);
        continue;
      }

      if (!study) {
        console.log(`Skipping ${session.sessionName}: study not found.`);
        continue;
      }

      if (!participant.email) {
        console.log(
          `Skipping ${session.sessionName}: participant has no email.`
        );
        continue;
      }

      if (!participant.accessLink) {
        console.log(
          `Skipping ${participant.email}: participant has no access link.`
        );
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
        console.log(
          `Reminder email failed or returned no result for ${participant.email} / ${session.sessionName}.`
        );
        continue;
      }

      session.reminderSentAt = new Date();
      await session.save();

      console.log(
        `Session reminder sent to ${participant.email} for ${session.sessionName}.`
      );
    }
  } catch (error) {
    console.error("Reminder scheduler failed:", error);
  } finally {
    isChecking = false;
  }
};

const startReminderScheduler = () => {
  if (reminderInterval) {
    console.log("Reminder scheduler already started.");
    return;
  }

  console.log("Reminder scheduler started.");

  runReminderCheck();

  reminderInterval = setInterval(runReminderCheck, CHECK_INTERVAL_MS);
};

module.exports = {
  startReminderScheduler,
  runReminderCheck,
};