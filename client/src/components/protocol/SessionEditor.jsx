import AssessmentCard from "./AssessmentCard";
import AssessmentPicker from "./AssessmentPicker";

const delayUnits = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
];

export default function SessionEditor({
  session,
  sessionIndex,
  onChange,
  onRemoveSession,
}) {
  const updateSession = (updates) => {
    onChange({
      ...session,
      ...updates,
    });
  };

  const addAssessment = (assessment) => {
    const nextAssessment = {
      assessmentId: assessment.id,
      type: assessment.id,
      version: "v1",
      order: session.assessments.length + 1,
      config: {},
      name: assessment.name,
      category: assessment.category,
      description: assessment.description,
    };

    updateSession({
      assessments: [...session.assessments, nextAssessment],
    });
  };

  const removeAssessment = (indexToRemove) => {
    const updated = session.assessments
      .filter((_, index) => index !== indexToRemove)
      .map((assessment, index) => ({
        ...assessment,
        order: index + 1,
      }));

    updateSession({
      assessments: updated,
    });
  };

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.sessionLabel}>Session {sessionIndex + 1}</p>
          <h3 style={styles.title}>{session.label}</h3>
        </div>

        <button
          type="button"
          onClick={onRemoveSession}
          style={styles.removeButton}
        >
          Remove Session
        </button>
      </div>

      <div style={styles.fieldGrid}>
        <div style={styles.field}>
          <label style={styles.label}>Session Name</label>
          <input
            value={session.label}
            onChange={(e) =>
              updateSession({
                label: e.target.value,
                name: e.target.value,
              })
            }
            style={styles.input}
            placeholder="Session 1"
          />
        </div>

        <div style={styles.delayGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Delay Value</label>
            <input
              type="number"
              min="0"
              step="any"
              value={session.delayValue ?? 0}
              onChange={(e) =>
                updateSession({
                  delayValue: Number(e.target.value || 0),
                })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Delay Unit</label>
            <select
              value={session.delayUnit || "days"}
              onChange={(e) =>
                updateSession({
                  delayUnit: e.target.value,
                })
              }
              style={styles.input}
            >
              {delayUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p style={styles.helpText}>
        This controls when the session becomes available after the previous
        session is completed. Use 0 for immediate access.
      </p>

      <div style={styles.assessmentSection}>
        <h4 style={styles.sectionTitle}>Selected Assessments</h4>

        {session.assessments.length === 0 ? (
          <div style={styles.emptyState}>No assessments added yet.</div>
        ) : (
          <div style={styles.assessmentList}>
            {session.assessments.map((assessment, index) => (
              <AssessmentCard
                key={`${assessment.assessmentId}-${index}`}
                assessment={assessment}
                index={index}
                onRemove={() => removeAssessment(index)}
              />
            ))}
          </div>
        )}
      </div>

      <AssessmentPicker onSelect={addAssessment} />
    </section>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 28,
    borderRadius: 28,
    background: "rgba(7, 15, 35, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },

  sessionLabel: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
  },

  title: {
    margin: "6px 0 0",
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 900,
  },

  removeButton: {
    border: "1px solid rgba(248, 113, 113, 0.22)",
    borderRadius: 12,
    background: "rgba(127, 29, 29, 0.16)",
    color: "#fca5a5",
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) minmax(320px, 1fr)",
    gap: 16,
  },

  delayGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 800,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(59, 130, 246, 0.18)",
    background: "rgba(2, 6, 23, 0.8)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },

  helpText: {
    margin: "-10px 0 0",
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },

  assessmentSection: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  sectionTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 850,
  },

  emptyState: {
    padding: 16,
    borderRadius: 16,
    background: "rgba(15, 23, 42, 0.5)",
    border: "1px dashed rgba(148, 163, 184, 0.18)",
    color: "#94a3b8",
    fontSize: 14,
  },

  assessmentList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
};