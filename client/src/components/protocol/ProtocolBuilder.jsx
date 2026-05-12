import { useMemo, useState } from "react";
import SessionEditor from "./SessionEditor";

const delayToTiming = (delayValue = 0, delayUnit = "days") => {
  const value = Number(delayValue || 0);

  if (delayUnit === "minutes") {
    return {
      offsetDays: value / 1440,
      unlockAfterHours: value / 60,
    };
  }

  if (delayUnit === "hours") {
    return {
      offsetDays: value / 24,
      unlockAfterHours: value,
    };
  }

  return {
    offsetDays: value,
    unlockAfterHours: value * 24,
  };
};

const hydrateSessionTiming = (session, order) => {
  if (session.delayValue !== undefined && session.delayUnit) {
    return session;
  }

  const unlockAfterHours = Number(session.unlockAfterHours || 0);

  if (unlockAfterHours > 0) {
    if (unlockAfterHours % 24 === 0) {
      return {
        ...session,
        delayValue: unlockAfterHours / 24,
        delayUnit: "days",
      };
    }

    return {
      ...session,
      delayValue: unlockAfterHours,
      delayUnit: "hours",
    };
  }

  return {
    ...session,
    delayValue: order === 1 ? 0 : Number(session.offsetDays || order - 1),
    delayUnit: "days",
  };
};

const normalizeSession = (session, sessionIndex) => {
  const order = sessionIndex + 1;
  const delayValue = Number(session.delayValue || 0);
  const delayUnit = session.delayUnit || "days";
  const timing = delayToTiming(delayValue, delayUnit);

  return {
    ...session,
    ...timing,
    delayValue,
    delayUnit,
    order,
    name: session.name || session.label || `Session ${order}`,
    label: session.label || session.name || `Session ${order}`,
    expiresAfterHours: session.expiresAfterHours || 24,
    protocolVersion: session.protocolVersion || "custom",
    assessments: (session.assessments || []).map(
      (assessment, assessmentIndex) => ({
        assessmentId: assessment.assessmentId || assessment.type,
        type: assessment.type || assessment.assessmentId,
        version: assessment.version || "v1",
        order: assessmentIndex + 1,
        config: assessment.config || {},

        name: assessment.name,
        category: assessment.category,
        description: assessment.description,
      })
    ),
  };
};

const createDefaultSession = (order = 1) => ({
  label: `Session ${order}`,
  name: `Session ${order}`,
  order,
  delayValue: order === 1 ? 0 : 1,
  delayUnit: order === 1 ? "days" : "days",
  offsetDays: order === 1 ? 0 : 1,
  unlockAfterHours: order === 1 ? 0 : 24,
  expiresAfterHours: 24,
  protocolVersion: "custom",
  assessments: [],
});

export default function ProtocolBuilder({ value, onChange }) {
  const [sessions, setSessions] = useState(() => {
    if (value?.sessions?.length) {
      return value.sessions.map((session, index) =>
        hydrateSessionTiming(session, index + 1)
      );
    }

    return [createDefaultSession(1)];
  });

  const protocol = useMemo(
    () => ({
      type: "custom",
      version: "v1",
      sessions: sessions.map(normalizeSession),
    }),
    [sessions]
  );

  const emitChange = (nextSessions) => {
    const nextProtocol = {
      type: "custom",
      version: "v1",
      sessions: nextSessions.map(normalizeSession),
    };

    onChange?.(nextProtocol);
  };

  const updateSessions = (nextSessions) => {
    setSessions(nextSessions);
    emitChange(nextSessions);
  };

  const addSession = () => {
    const nextOrder = sessions.length + 1;
    updateSessions([...sessions, createDefaultSession(nextOrder)]);
  };

  const updateSession = (indexToUpdate, updatedSession) => {
    const nextSessions = sessions.map((session, index) =>
      index === indexToUpdate ? updatedSession : session
    );

    updateSessions(nextSessions);
  };

  const removeSession = (indexToRemove) => {
    if (sessions.length === 1) return;

    const nextSessions = sessions
      .filter((_, index) => index !== indexToRemove)
      .map((session, index) => ({
        ...session,
        order: index + 1,
        label: session.label || `Session ${index + 1}`,
        name: session.name || session.label || `Session ${index + 1}`,
      }));

    updateSessions(nextSessions);
  };

  const totalAssessments = sessions.reduce(
    (count, session) => count + session.assessments.length,
    0
  );

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Protocol Builder</p>
          <h2 style={styles.title}>Design the study protocol</h2>
          <p style={styles.subtitle}>
            Add sessions, choose assessments, and configure the sequence
            participants will complete remotely.
          </p>
        </div>

        <button type="button" onClick={addSession} style={styles.addButton}>
          Add Session
        </button>
      </div>

      <div style={styles.stats}>
        <Stat label="Sessions" value={sessions.length} />
        <Stat label="Assessments" value={totalAssessments} />
        <Stat label="Protocol" value={protocol.version.toUpperCase()} />
      </div>

      <div style={styles.sessionList}>
        {sessions.map((session, index) => (
          <SessionEditor
            key={`session-${index}`}
            session={session}
            sessionIndex={index}
            onChange={(updatedSession) => updateSession(index, updatedSession)}
            onRemoveSession={() => removeSession(index)}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 26,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    flexWrap: "wrap",
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
  },

  title: {
    margin: "10px 0 0",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: 950,
    letterSpacing: "-0.045em",
  },

  subtitle: {
    margin: "12px 0 0",
    maxWidth: 720,
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.7,
  },

  addButton: {
    border: "1px solid rgba(56, 189, 248, 0.28)",
    borderRadius: 14,
    background: "linear-gradient(90deg, #0ea5e9, #4f46e5)",
    color: "#ffffff",
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
  },

  statCard: {
    padding: 18,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.68)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  statValue: {
    margin: 0,
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 950,
  },

  statLabel: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },

  sessionList: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
};