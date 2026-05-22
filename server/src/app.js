const express = require("express");
const cors = require("cors");
const path = require("path");

const studyRoutes = require("./routes/study.routes");
const participantRoutes = require("./routes/participant.routes");
const sessionRoutes = require("./routes/session.routes");
const assessmentRoutes = require("./routes/assessment.routes");
const exportRoutes = require("./routes/export.routes");
const authRoutes = require("./routes/auth.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const organizationRoutes = require("./routes/organization.routes");
const researcherRoutes = require("./routes/researcher.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
  process.env.CLIENT_PREVIEW_URL,
  "https://neurovenus-app.onrender.com",
  "https://admin.neurovenus.com",
  "https://participant.neurovenus.com",
  "https://app.neurovenus.com",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/studies", studyRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", assessmentRoutes);
app.use("/api", exportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/researchers", researcherRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Neurovenus API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (err.message && err.message.includes("CORS blocked")) {
    return res.status(403).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
});

module.exports = app;