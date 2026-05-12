import { assessmentOptions } from "./assessmentOptions";

export default function AssessmentPicker({ onSelect }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>Assessment Library</h3>
        <p style={styles.subtitle}>
          Select validated cognitive and sleep assessments to include in this
          session.
        </p>
      </div>

      <div style={styles.grid}>
        {assessmentOptions.map((assessment) => (
          <button
            key={assessment.id}
            type="button"
            onClick={() => onSelect(assessment)}
            style={styles.card}
          >
            <div style={styles.cardTop}>
              <span style={styles.category}>{assessment.category}</span>
            </div>

            <h4 style={styles.name}>{assessment.name}</h4>

            <p style={styles.description}>{assessment.description}</p>

            <span style={styles.addLabel}>Add Assessment</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  header: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: 900,
  },

  subtitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },

  card: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 18,
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(59, 130, 246, 0.12)",
    color: "#7dd3fc",
    fontSize: 11,
    fontWeight: 800,
  },

  name: {
    margin: 0,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 850,
    lineHeight: 1.4,
  },

  description: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
    flex: 1,
  },

  addLabel: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 800,
    marginTop: 4,
  },
};