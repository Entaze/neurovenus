// server/src/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { startReminderScheduler } = require("./utils/reminderScheduler");

const studyRoutes = require("./routes/study.routes");
const participantRoutes = require("./routes/participant.routes");
const sessionRoutes = require("./routes/session.routes");
const taskRoutes = require("./routes/task.routes");
const exportRoutes = require("./routes/export.routes");
const authRoutes = require("./routes/auth.routes");

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
  "https://admin.cognimeo.com",
  "https://participant.cognimeo.com",
  "https://app.cognimeo.com",
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

/**
 * API Routes
 */
app.use("/api/studies", studyRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", exportRoutes);
app.use("/api/auth", authRoutes);

/**
 * Health check route
 */
app.get("/", (req, res) => {
  res.json({
    message: "CognitiveVault API is running",
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
  console.log(`CognitiveVault API running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins.join(", "));
  startReminderScheduler();
});