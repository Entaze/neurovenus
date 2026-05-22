// src/components/researcher/ParticipantsTable.jsx

import { useState } from "react";
import ParticipantDetailModal from "./ParticipantDetailModal";

export default function ParticipantsTable({
  participants = [],
  onExport,
}) {
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!participants.length) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyTitle}>
          No participants found for this protocol yet.
        </p>
        <p style={styles.emptySubtitle}>
          Invite your first participant to begin collecting data.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={styles.wrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Participant ID</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Session Progress</th>
              <th style={styles.th}>Invited At</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((participant) => (
              <tr
                key={participant._id}
                style={{
                  ...styles.tr,
                  ...(hoveredRow === participant._id ? styles.trHover : {}),
                }}
                onMouseEnter={() => setHoveredRow(participant._id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setSelectedParticipant(participant)}
              >
                <td style={styles.td}>
                  {participant.participantCode || participant.code || "-"}
                </td>

                <td style={styles.td}>{participant.email || "-"}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      ...getStatusStyle(participant.status),
                    }}
                  >
                    {participant.status || "unknown"}
                  </span>
                </td>

                <td style={styles.td}>
                  <ProgressCell participant={participant} />
                </td>

                <td style={styles.td}>
                  {formatDate(participant.createdAt)}
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExport?.(participant);
                    }}
                  >
                    Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => setSelectedParticipant(null)}
          onExport={onExport}
        />
      )}
    </>
  );
}

function ProgressCell({ participant }) {
  const { completed, total, percentage } = getProgressData(participant);

  return (
    <div style={styles.progressWrap}>
      <div style={styles.progressTop}>
        <span style={styles.progressText}>
          {completed} / {total}
        </span>
        <span style={styles.progressPercent}>{percentage}%</span>
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
    </div>
  );
}

function getProgressData(participant) {
  const sessionRuns = participant.sessionRuns || participant.sessions || [];
  const total = sessionRuns.length;

  if (!total) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = sessionRuns.filter((session) => {
    const status = session.status?.toLowerCase?.();
    return status === "completed" || Boolean(session.completedAt);
  }).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}

function getStatusStyle(status = "") {
  const normalized = status.toLowerCase();

  if (normalized === "completed") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#86efac",
    };
  }

  if (normalized === "invited") {
    return {
      background: "rgba(250,204,21,0.12)",
      color: "#fde68a",
    };
  }

  if (normalized === "in_progress" || normalized === "in progress") {
    return {
      background: "rgba(56,189,248,0.12)",
      color: "#7dd3fc",
    };
  }

  return {
    background: "rgba(148,163,184,0.12)",
    color: "#cbd5e1",
  };
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
  wrapper: {
    overflowX: "auto",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#94a3b8",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
  },

  td: {
    padding: "14px 16px",
    fontSize: 14,
    color: "#e5e7eb",
    transition: "background 0.2s ease, color 0.2s ease",
  },

  badge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    textTransform: "capitalize",
  },

  actionButton: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    cursor: "pointer",
  },

  emptyState: {
    padding: "36px 24px",
    textAlign: "center",
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: "#e2e8f0",
  },

  emptySubtitle: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
  },

  progressWrap: {
    minWidth: 190,
    maxWidth: 240,
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },

  progressText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 800,
  },

  progressPercent: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    background: "rgba(148,163,184,0.12)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    transition: "width 0.2s ease",
  },

  trHover: {
    background: "rgba(59, 130, 246, 0.06)",
    boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.10)",
  },
};