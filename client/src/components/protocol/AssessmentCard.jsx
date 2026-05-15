import { useState } from "react";
import { Clock } from "lucide-react";

export default function AssessmentCard({ assessment, index, onRemove }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.number}>{index + 1}</div>

      <div style={styles.content}>
        <div style={styles.topRow}>
          <p style={styles.name}>{assessment.name}</p>
          <span style={styles.category}>{assessment.category}</span>

          {assessment.estimatedDurationMinutes && (
            <span style={styles.duration}>
              <Clock size={12} strokeWidth={1.75} />
              {assessment.estimatedDurationMinutes} min
            </span>
          )}
        </div>

        <p style={styles.description}>
          {assessment.description || "No description available."}
        </p>
      </div>

      <button type="button" onClick={onRemove} style={styles.removeButton}>
        Remove
      </button>
    </div>
  );
}

const styles = {
  card: {
    display: "grid",
    gridTemplateColumns: "34px 1fr auto",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    transition: "background 0.18s ease, border-color 0.18s ease",
  },

  cardHover: {
    background: "rgba(30, 41, 59, 0.82)",
    border: "1px solid rgba(59, 130, 246, 0.22)",
  },

  number: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(56, 189, 248, 0.12)",
    color: "#67e8f9",
    fontSize: 13,
    fontWeight: 900,
  },

  content: {
    minWidth: 0,
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  name: {
    margin: 0,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 850,
  },

  category: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(99, 102, 241, 0.12)",
    color: "#a5b4fc",
    fontSize: 11,
    fontWeight: 800,
  },

  duration: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: 700,
  },

  description: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.55,
  },

  removeButton: {
    border: "1px solid rgba(248, 113, 113, 0.22)",
    borderRadius: 12,
    background: "rgba(127, 29, 29, 0.16)",
    color: "#fca5a5",
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
};