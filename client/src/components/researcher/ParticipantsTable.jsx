// src/components/researcher/ParticipantsTable.jsx

export default function ParticipantsTable({
  participants = [],
  onExport,
}) {
  if (!participants.length) {
    return (
      <div style={styles.empty}>
        No participants found for this study yet.
      </div>
    );
  }

  return (
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
            <tr key={participant._id} style={styles.tr}>
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
                <span style={styles.progressBadge}>
                  {getSessionProgress(participant)}
                </span>
              </td>

              <td style={styles.td}>
                {participant.createdAt
                  ? new Date(participant.createdAt).toLocaleString([], {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              <td style={styles.td}>
                <button
                  style={styles.actionButton}
                  onClick={() => onExport?.(participant)}
                >
                  Export
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

function getSessionProgress(participant) {
  const sessionRuns =
    participant.sessionRuns ||
    participant.sessions ||
    [];

  const totalSessions = sessionRuns.length;

  if (!totalSessions) {
    return "0 / 0";
  }

  const completedSessions = sessionRuns.filter(
    (session) =>
      session.status?.toLowerCase?.() === "completed" ||
      session.completedAt
  ).length;

  return `${completedSessions} / ${totalSessions}`;
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
  },

  td: {
    padding: "14px 16px",
    fontSize: 14,
    color: "#e5e7eb",
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

  empty: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#94a3b8",
  },

  progressBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.12)",
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 600,
  },
};