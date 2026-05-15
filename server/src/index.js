// server/src/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { startReminderScheduler } = require("./utils/reminderScheduler");

const path = require("path");
const studyRoutes = require("./routes/study.routes");
const participantRoutes = require("./routes/participant.routes");
const sessionRoutes = require("./routes/session.routes");
const assessmentRoutes = require("./routes/assessment.routes");
const exportRoutes = require("./routes/export.routes");
const authRoutes = require("./routes/auth.routes");
const feedbackRoutes = require("./routes/feedback.routes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/**
 * Allowed frontend origins
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://cognitivevault-app.onrender.com",
  "https://admin.neurovenus.com",
  "https://participant.neurovenus.com",
  "https://app.neurovenus.com",
];

/**
 * CORS configuration
 */
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools like Postman/curl (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked for origin: ${origin}`);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/**
 * API Routes
 */
app.use("/api/studies", studyRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", assessmentRoutes);
app.use("/api", exportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

/**
 * Health check route
 */
app.get("/", (req, res) => {
  res.json({
    message: "Neurovenus API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // Handle CORS errors explicitly
  if (err.message && err.message.includes("CORS blocked")) {
    return res.status(403).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Neurovenus API running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins.join(", "));
  if (process.env.ENABLE_REMINDER_SCHEDULER === "true") {
    startReminderScheduler();
  } else {
    console.log("Reminder scheduler disabled.");
  }
});