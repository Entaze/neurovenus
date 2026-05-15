import { useState } from "react";
import { Clock, X } from "lucide-react";
import { assessmentOptions } from "./assessmentOptions";

export default function AssessmentPicker({ onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [detailsAssessment, setDetailsAssessment] = useState(null);

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
          <div
            key={assessment.id}
            style={{
              ...styles.card,
              ...(hoveredId === assessment.id ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredId(assessment.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={styles.cardTop}>
              <span style={styles.category}>{assessment.category}</span>

              {assessment.estimatedDurationMinutes && (
                <span style={styles.duration}>
                  <Clock size={12} strokeWidth={1.75} />
                  {assessment.estimatedDurationMinutes} min
                </span>
              )}
            </div>

            <h4 style={styles.name}>{assessment.name}</h4>

            <p style={styles.description}>{assessment.description}</p>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => onSelect(assessment)}
                style={styles.addButton}
              >
                Add Assessment
              </button>

              <button
                type="button"
                onClick={() => setDetailsAssessment(assessment)}
                style={styles.detailsButton}
              >
                Protocol Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailsAssessment && (
        <AssessmentDetailsModal
          assessment={detailsAssessment}
          onClose={() => setDetailsAssessment(null)}
        />
      )}
    </div>
  );
}

function formatLabel(value = "") {
  return value
    .replace(/_/g, " ")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bMs\b/g, "MS")
    .replace(/\bRt\b/g, "RT")
    .replace(/\bId\b/g, "ID")
    .replace(/\bPsqi\b/g, "PSQI");
}

function AssessmentDetailsModal({ assessment, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <p style={styles.modalKicker}>{assessment.category}</p>
            <h2 style={styles.modalTitle}>{assessment.name}</h2>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <p style={styles.modalDescription}>{assessment.description}</p>

        <div style={styles.detailGrid}>
          {assessment.estimatedDurationMinutes && (
            <div style={styles.detailCard}>
              <span style={styles.detailLabel}>Estimated duration</span>
              <strong style={styles.detailValue}>
                {assessment.estimatedDurationMinutes} minutes
              </strong>
            </div>
          )}

          {assessment.type && (
            <div style={styles.detailCard}>
              <span style={styles.detailLabel}>Assessment type</span>
              <strong style={styles.detailValue}>
                {formatLabel(assessment.type)}
              </strong>
            </div>
          )}

          {assessment.responseOptions?.mode && (
            <div style={styles.detailCard}>
              <span style={styles.detailLabel}>Response mode</span>
              <strong style={styles.detailValue}>
                {formatLabel(assessment.responseOptions.mode)}
              </strong>
            </div>
          )}
        </div>

        {assessment.instructions && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Participant Instructions</h3>
            <p style={styles.sectionText}>{assessment.instructions}</p>
          </section>
        )}

        {assessment.trialSchema?.length > 0 && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Captured Trial Fields</h3>
            <div style={styles.metricGrid}>
              {assessment.trialSchema.map((field) => (
                <span key={field} style={styles.metricBadge}>
                  {formatLabel(field)}
                </span>
              ))}
            </div>
          </section>
        )}

        {assessment.summaryMetrics?.length > 0 && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Summary Metrics</h3>
            <div style={styles.metricGrid}>
              {assessment.summaryMetrics.map((metric) => (
                <span key={metric} style={styles.metricBadge}>
                  {formatLabel(metric)}
                </span>
              ))}
            </div>
          </section>
        )}

        {assessment.scoringNotes && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>Scoring Notes</h3>
            <div style={styles.notesList}>
              {Object.entries(assessment.scoringNotes).map(([key, value]) => (
                <div key={key} style={styles.noteItem}>
                  <strong style={styles.noteKey}>{formatLabel(key)}</strong>
                  <p style={styles.noteText}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {assessment.references?.length > 0 && (
          <section style={styles.modalSection}>
            <h3 style={styles.sectionTitle}>References</h3>
            <div style={styles.references}>
              {assessment.references.map((reference, index) => (
                <p key={index} style={styles.referenceText}>
                  {reference.authors} ({reference.year}). {reference.title}
                  {reference.journal ? `, ${reference.journal}` : ""}
                  {reference.publisher ? `, ${reference.publisher}` : ""}.
                </p>
              ))}
            </div>
          </section>
        )}
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
    transition: "background 0.18s ease, border-color 0.18s ease",
  },

  cardHover: {
    background: "rgba(30, 41, 59, 0.82)",
    border: "1px solid rgba(59, 130, 246, 0.22)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  category: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(59, 130, 246, 0.12)",
    color: "#7dd3fc",
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

  actions: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  addButton: {
    border: "none",
    background: "transparent",
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
  },

  detailsButton: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(2, 6, 23, 0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "86vh",
    overflowY: "auto",
    borderRadius: 22,
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: 24,
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },

  modalKicker: {
    margin: "0 0 8px",
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  modalTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  },

  modalDescription: {
    margin: "18px 0 20px",
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.7,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginBottom: 20,
  },

  detailCard: {
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },

  detailLabel: {
    display: "block",
    marginBottom: 6,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },

  detailValue: {
    color: "#ffffff",
    fontSize: 14,
  },

  modalSection: {
    marginTop: 20,
    paddingTop: 18,
    borderTop: "1px solid rgba(148, 163, 184, 0.12)",
  },

  sectionTitle: {
    margin: "0 0 10px",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 850,
  },

  sectionText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.7,
  },

  metricGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  metricBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.10)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 700,
  },

  references: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  referenceText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },
};