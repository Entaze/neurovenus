const Study = require("../models/Study");
const Participant = require("../models/Participant");
const SessionRun = require("../models/SessionRun");
const AssessmentRun = require("../models/AssessmentRun");

const flattenSummary = (summary = {}) => {
  const flattened = {};

  Object.entries(summary).forEach(([key, value]) => {
    flattened[`summary_${key}`] = value;
  });

  return flattened;
};

const flattenTrial = (trial = {}) => {
  const flattened = {};

  Object.entries(trial).forEach(([key, value]) => {
    if (key === "metadata") return;

    flattened[`trial_${key}`] = value;
  });

  if (trial.metadata && typeof trial.metadata === "object") {
    Object.entries(trial.metadata).forEach(([key, value]) => {
      flattened[`trial_metadata_${key}`] = value;
    });
  }

  return flattened;
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  let stringValue;

  if (value instanceof Date) {
    stringValue = value.toISOString();
  } else if (typeof value === "object") {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = String(value);
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const convertRowsToCsv = (rows) => {
  if (!rows.length) return "";

  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    ),
  ];

  return csvRows.join("\n");
};

function deriveParticipantStatus(sessionRuns = []) {
  if (!sessionRuns.length) {
    return "invited";
  }

  const allCompleted = sessionRuns.every(
    (session) => session.status === "completed"
  );

  if (allCompleted) {
    return "completed";
  }

  const hasStarted = sessionRuns.some((session) =>
    ["available", "locked", "in_progress", "completed"].includes(
      session.status
    )
  );

  if (hasStarted) {
    return "active";
  }

  return "invited";
}

const exportStudyData = async (req, res) => {
  try {
    const { studyId } = req.params;
    const organizationId = req.user?.organizationId;
    const userId = req.user?._id || req.user?.id || req.user?.sub;

    if (!organizationId) {
      return res.status(401).json({
        success: false,
        message: "Organization context required",
      });
    }

    const {
      participantId,
      participantCode,
      sessionOrder,
      taskType,
      taskVersion,
      format,
    } = req.query;

    const study = await Study.findOne({
      _id: studyId,
      organizationId,
      createdBy: userId,
    }).lean();

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    const participantQuery = {
      studyId,
      organizationId,
      createdBy: userId,
    };

    if (participantId) {
      participantQuery._id = participantId;
    }

    if (participantCode) {
      participantQuery.participantCode = participantCode;
    }

    const participants = await Participant.find(participantQuery).lean();
    const participantIds = participants.map((p) => p._id);

    const sessionQuery = {
      studyId,
      organizationId,
      createdBy: userId,
      participantId: { $in: participantIds },
    };

    if (sessionOrder) {
      sessionQuery.sessionOrder = Number(sessionOrder);
    }

    const sessionRuns = await SessionRun.find(sessionQuery).lean();
    const sessionRunIds = sessionRuns.map((s) => s._id);

    const taskQuery = {
      studyId,
      organizationId,
      createdBy: userId,
      participantId: { $in: participantIds },
      sessionRunId: { $in: sessionRunIds },
    };

    if (taskType) {
      taskQuery.taskType = taskType;
    }

    if (taskVersion) {
      taskQuery.taskVersion = taskVersion;
    }

    const taskRuns = await AssessmentRun.find(taskQuery)
      .sort({ completedAt: 1 })
      .lean();

    const participantMap = new Map(
      participants.map((participant) => [
        participant._id.toString(),
        participant,
      ])
    );

    const sessionMap = new Map(
      sessionRuns.map((session) => [session._id.toString(), session])
    );

    const sessionRunsByParticipant = new Map();

    for (const session of sessionRuns) {
      const participantId = session.participantId.toString();

      if (!sessionRunsByParticipant.has(participantId)) {
        sessionRunsByParticipant.set(participantId, []);
      }

      sessionRunsByParticipant.get(participantId).push(session);
    }

    const rows = [];

    for (const taskRun of taskRuns) {
      const participant = participantMap.get(
        taskRun.participantId.toString()
      );

      const session = sessionMap.get(
        taskRun.sessionRunId.toString()
      );

      const participantSessionRuns =
        sessionRunsByParticipant.get(
          taskRun.participantId.toString()
        ) || [];

      const derivedParticipantStatus =
        deriveParticipantStatus(participantSessionRuns);

      const baseRow = {
        studyId: study._id,
        studyTitle: study.title,
        studyProtocolVersion: study.protocolVersion,

        participantId: participant?._id,
        participantCode: participant?.participantCode,
        participantEmail: participant?.email,
        participantStatus: derivedParticipantStatus,

        sessionRunId: session?._id,
        sessionName: session?.sessionName,
        sessionOrder: session?.sessionOrder,
        sessionProtocolVersion: session?.protocolVersion,
        sessionStatus: session?.status,
        sessionOpenedAt: session?.opensAt,
        sessionStartedAt: session?.startedAt,
        sessionCompletedAt: session?.completedAt,

        taskRunId: taskRun._id,
        taskType: taskRun.taskType,
        taskVersion: taskRun.taskVersion,
        taskStartedAt: taskRun.startedAt,
        taskCompletedAt: taskRun.completedAt,

        ...flattenSummary(taskRun.summary),
      };

      if (!taskRun.trials || taskRun.trials.length === 0) {
        rows.push(baseRow);
        continue;
      }

      for (const trial of taskRun.trials) {
        rows.push({
          ...baseRow,
          ...flattenTrial(trial),
        });
      }
    }

    if (format === "csv") {
      const csv = convertRowsToCsv(rows);

      const slugify = (value = "") =>
        String(value)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const today = new Date().toISOString().slice(0, 10);

      const selectedParticipant = participants[0];

      const filenameParts = [
        "neurovenus",
        slugify(study.title || "study"),

        participantId || participantCode
          ? selectedParticipant?.participantCode ||
            slugify(selectedParticipant?.email || "participant")
          : null,

        sessionOrder ? `session-${sessionOrder}` : null,

        taskType ? slugify(taskType) : null,

        today,
      ].filter(Boolean);

      const filename = `${filenameParts.join("_")}.csv`;

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      return res.send(csv);
    }

    return res.json({
      success: true,
      count: rows.length,
      filters: {
        participantId: participantId || null,
        participantCode: participantCode || null,
        sessionOrder: sessionOrder || null,
        taskType: taskType || null,
        taskVersion: taskVersion || null,
      },
      rows,
    });
  } catch (error) {
    console.error("Failed to export study data:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export study data",
      error: error.message,
    });
  }
};

module.exports = {
  exportStudyData,
};