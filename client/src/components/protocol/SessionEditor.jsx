// client/src/components/researcher/SessionEditor.jsx

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
  const isFirstSession = sessionIndex === 0;

  const updateSession = (updates) => {
    onChange({ ...session, ...updates });
  };

  const addAssessment = (assessment) => {
    updateSession({
      assessments: [
        ...session.assessments,
        {
          assessmentId: assessment.id,
          type: assessment.id,
          version: "v1",
          order: session.assessments.length + 1,
          config: {},
          name: assessment.name,
          category: assessment.category,
          description: assessment.description,
        },
      ],
    });
  };

  const removeAssessment = (indexToRemove) => {
    updateSession({
      assessments: session.assessments
        .filter((_, index) => index !== indexToRemove)
        .map((assessment, index) => ({
          ...assessment,
          order: index + 1,
        })),
    });
  };

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.sessionLabel}>Session {sessionIndex + 1}</p>
        </div>

        {onRemoveSession && (
          <button
            type="button"
            onClick={onRemoveSession}
            style={styles.removeButton}
          >
            Remove Session
          </button>
        )}
      </div>

      <div style={styles.fieldGrid}>
        {/* Session Name */}
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
            placeholder="Session name"
          />
        </div>

        {/* Timing Controls */}
        {isFirstSession ? (
          <div style={styles.inlineNotice}>
            <span style={styles.infoIcon}>i</span>
            <p style={styles.infoText}>
              Session 1 becomes available immediately when the participant
              starts the study.
            </p>
          </div>
        ) : (
          <div style={styles.delayPanel}>
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

            <p style={styles.helpText}>
              Set how long after the previous session is completed before this
              session unlocks. Enter 0 for immediate access.
            </p>
          </div>
        )}
      </div>

      <div style={styles.divider} />

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
    borderRadius: 32,
    padding: 32,
    background:
      "linear-gradient(180deg, rgba(8, 25, 60, 0.96) 0%, rgba(4, 18, 44, 0.98) 100%)",
    border: "1px solid rgba(59, 130, 246, 0.14)",
    boxShadow: `
      inset 0 1px 0 rgba(255, 255, 255, 0.03),
      0 20px 50px rgba(0, 0, 0, 0.35)
    `,
    position: "relative",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    paddingBottom: 24,
  },

  sessionLabel: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
  },

  removeButton: {
    border: "1px solid rgba(248, 113, 113, 0.28)",
    borderRadius: 14,
    background: "rgba(127, 29, 29, 0.14)",
    color: "#fca5a5",
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 850,
    cursor: "pointer",
  },

  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1fr) minmax(320px, 1fr)",
    gap: 28,
    alignItems: "start",
  },

  delayPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
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
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid rgba(59, 130, 246, 0.2)",
    background: "rgba(2, 6, 23, 0.78)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },

  inlineNotice: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 46,
    paddingLeft: 28,
    borderLeft: "1px solid rgba(148, 163, 184, 0.18)",
  },

  infoIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 999,
    border: "1px solid rgba(56, 189, 248, 0.65)",
    color: "#7dd3fc",
    fontSize: 13,
    fontWeight: 900,
    flex: "0 0 auto",
  },

  infoText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.6,
  },

  helpText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 620,
  },

  divider: {
    height: 1,
    margin: "28px 0",
    background:
      "linear-gradient(90deg, rgba(148, 163, 184, 0.16), rgba(148, 163, 184, 0.04))",
  },

  assessmentSection: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: "4px 0 16px",
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
    background: "rgba(15, 23, 42, 0.45)",
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