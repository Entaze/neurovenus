// src/components/researcher/SessionProgressChart.jsx

export default function SessionProgressChart({ sessions = [] }) {
  if (!sessions.length) {
    return (
      <div style={styles.empty}>
        No session progress data available yet.
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Session Progress</h3>
        <p style={styles.subtitle}>
          Completion percentage by study session.
        </p>
      </div>

      <div style={styles.list}>
        {sessions.map((session) => {
          const percent = Math.max(0, Math.min(100, session.percent || 0));

          return (
            <div key={session.name} style={styles.row}>
              <div style={styles.labelBlock}>
                <span style={styles.label}>{session.name}</span>
                {session.description && (
                  <span style={styles.description}>
                    {session.description}
                  </span>
                )}
              </div>

              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${percent}%`,
                  }}
                />
              </div>

              <div style={styles.percent}>{percent}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
  },

  header: {
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "220px 1fr 56px",
    gap: 14,
    alignItems: "center",
  },

  labelBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e7eb",
  },

  description: {
    fontSize: 12,
    color: "#64748b",
  },

  barTrack: {
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #06b6d4, #2563eb)",
    transition: "width 0.3s ease",
  },

  percent: {
    textAlign: "right",
    fontSize: 13,
    color: "#94a3b8",
  },

  empty: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#94a3b8",
  },
};