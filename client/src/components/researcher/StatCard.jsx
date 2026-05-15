// src/components/researcher/StatCard.jsx

export default function StatCard({
  label,
  value,
  subtitle,
  color = "#ffffff",
  accent = "#60a5fa",
  trend, // optional: { value: "+12%", positive: true }
}) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <span style={styles.label}>{label}</span>

        <span
          style={{
            ...styles.accentDot,
            background: accent,
            boxShadow: `0 0 14px ${accent}55`,
          }}
        />
      </div>

      <div
        style={{
          ...styles.value,
          color,
        }}
      >
        {value}
      </div>

      {(subtitle || trend) && (
        <div style={styles.footer}>
          {subtitle && <span style={styles.subtitle}>{subtitle}</span>}

          {trend && (
            <span
              style={{
                ...styles.trend,
                ...(trend.positive
                  ? styles.trendPositive
                  : styles.trendNegative),
              }}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    padding: 24,
    borderRadius: 20,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(9,16,32,0.96) 100%)",
    border: "1px solid rgba(148,163,184,0.12)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
    overflow: "hidden",
    transition:
      "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#94a3b8",
  },

  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },

  // value: {
  //   fontSize: "clamp(2rem, 4vw, 2.75rem)",
  //   fontWeight: 900,
  //   lineHeight: 1,
  //   letterSpacing: "-0.04em",
  //   color: "#ffffff",
  // },

  value: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },

  footer: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 1.5,
    color: "#64748b",
  },

  trend: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.04em",
  },

  trendPositive: {
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
  },

  trendNegative: {
    background: "rgba(239,68,68,0.12)",
    color: "#fca5a5",
  },
};