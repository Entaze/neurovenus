// src/components/researcher/ParticipantDetailModal.jsx

import { X, Download, CheckCircle2, CircleDashed } from "lucide-react";

export default function ParticipantDetailModal({
  participant,
  onClose,
  onExport,
}) {
  const sessions = participant.sessionRuns || participant.sessions || [];
  const { completed, total, percentage } = getProgressData(participant);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Participant Details</p>
            <h2 style={styles.title}>
              {participant.participantCode || participant.code || "Participant"}
            </h2>
            <p style={styles.subtitle}>{participant.email || "-"}</p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div style={styles.summaryGrid}>
          <SummaryCard label="Status" value={participant.status || "unknown"} />
          <SummaryCard label="Progress" value={`${completed} / ${total}`} />
          <SummaryCard label="Completion" value={`${percentage}%`} />
          <SummaryCard label="Invited At" value={formatDate(participant.createdAt)} />
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${percentage}%`,
              background: percentage === 100 ? "#22c55e" : "#2563eb",
            }}
          />
        </div>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Session Timeline</h3>

          {!sessions.length ? (
            <div style={styles.emptyBox}>
              No session activity has been recorded yet.
            </div>
          ) : (
            <div style={styles.timeline}>
              {sessions.map((session, index) => {
                const completedSession =
                  session.status?.toLowerCase?.() === "completed" ||
                  Boolean(session.completedAt);

                return (
                  <div key={session._id || index} style={styles.sessionCard}>
                    <div style={styles.sessionIcon}>
                      {completedSession ? (
                        <CheckCircle2 size={18} strokeWidth={1.8} />
                      ) : (
                        <CircleDashed size={18} strokeWidth={1.8} />
                      )}
                    </div>

                    <div style={styles.sessionBody}>
                      <div style={styles.sessionTop}>
                        <h4 style={styles.sessionTitle}>
                          {session.name ||
                            session.label ||
                            `Session ${index + 1}`}
                        </h4>

                        <span
                          style={{
                            ...styles.sessionBadge,
                            ...(completedSession
                              ? styles.completedBadge
                              : styles.pendingBadge),
                          }}
                        >
                          {completedSession ? "Completed" : session.status || "Pending"}
                        </span>
                      </div>

                      <div style={styles.metaGrid}>
                        <Meta label="Started" value={formatDate(session.startedAt)} />
                        <Meta label="Completed" value={formatDate(session.completedAt)} />
                        <Meta label="Opens At" value={formatDate(session.opensAt)} />
                      </div>

                      {getAssessmentNames(session).length > 0 && (
                        <div style={styles.assessmentRow}>
                          {getAssessmentNames(session).map((name) => (
                            <span key={name} style={styles.assessmentPill}>
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div style={styles.footer}>
          <button
            type="button"
            onClick={() => onExport?.(participant)}
            style={styles.exportButton}
          >
            <Download size={16} strokeWidth={1.75} />
            Export Participant CSV
          </button>

          <button type="button" onClick={onClose} style={styles.secondaryButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <span style={styles.metaLabel}>{label}</span>
      <p style={styles.metaValue}>{value}</p>
    </div>
  );
}

function getProgressData(participant) {
  const sessions = participant.sessionRuns || participant.sessions || [];
  const total = sessions.length;

  if (!total) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = sessions.filter((session) => {
    const status = session.status?.toLowerCase?.();
    return status === "completed" || Boolean(session.completedAt);
  }).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

function getAssessmentNames(session) {
  const assessments = session.assessments || session.tasks || [];

  return assessments.map((item) => {
    return (
      item.name ||
      item.assessmentName ||
      item.assessmentId ||
      item.type ||
      "Assessment"
    );
  });
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(2,6,23,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 900,
    maxHeight: "86vh",
    overflowY: "auto",
    borderRadius: 24,
    background: "#0f172a",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
    padding: 28,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
    marginBottom: 24,
  },

  kicker: {
    margin: "0 0 8px",
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: 14,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },

  summaryCard: {
    padding: 14,
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148,163,184,0.12)",
  },

  summaryLabel: {
    display: "block",
    marginBottom: 6,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },

  summaryValue: {
    color: "#ffffff",
    fontSize: 15,
    textTransform: "capitalize",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    background: "rgba(148,163,184,0.12)",
    overflow: "hidden",
    marginBottom: 26,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.2s ease",
  },

  section: {
    paddingTop: 22,
    borderTop: "1px solid rgba(148,163,184,0.12)",
  },

  sectionTitle: {
    margin: "0 0 16px",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 850,
  },

  emptyBox: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px dashed rgba(148,163,184,0.14)",
    color: "#94a3b8",
    textAlign: "center",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  sessionCard: {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
  },

  sessionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(56,189,248,0.12)",
    color: "#67e8f9",
  },

  sessionBody: {
    minWidth: 0,
  },

  sessionTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  sessionTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 850,
  },

  sessionBadge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "capitalize",
  },

  completedBadge: {
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
  },

  pendingBadge: {
    background: "rgba(148,163,184,0.12)",
    color: "#cbd5e1",
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginBottom: 12,
  },

  metaLabel: {
    display: "block",
    marginBottom: 4,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },

  metaValue: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 13,
  },

  assessmentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  assessmentPill: {
    padding: "5px 9px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.10)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 700,
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid rgba(148,163,184,0.12)",
  },

  exportButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    borderRadius: 12,
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
};