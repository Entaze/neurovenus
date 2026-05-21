const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const { startReminderScheduler } = require("./utils/reminderScheduler");

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Neurovenus API running on port ${PORT}`);

  if (process.env.ENABLE_REMINDER_SCHEDULER === "true") {
    startReminderScheduler();
  } else {
    console.log("Reminder scheduler disabled.");
  }
});