// src/components/researcher/StatCard.jsx

export default function StatCard({
  label,
  value,
  subtitle,
  color = "#60a5fa",
}) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>

      <div
        style={{
          ...styles.value,
          color,
        }}
      >
        {value}
      </div>

      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}

const styles = {
  card: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#ffffff",
  },

  label: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 8,
  },

  value: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.1,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
  },
};