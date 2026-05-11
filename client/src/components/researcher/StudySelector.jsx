// src/components/researcher/StudySelector.jsx

export default function StudySelector({
  studies = [],
  selectedStudyId = "",
  onChange,
  loading = false,
}) {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Active Study</label>

      <select
        value={selectedStudyId}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={loading}
        style={{
          ...styles.select,
          ...(loading ? styles.disabled : {}),
        }}
      >
        <option value="">
          {loading ? "Loading studies..." : "Select a study"}
        </option>

        {studies.map((study) => (
          <option key={study._id} value={study._id}>
            {study.title}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  select: {
    minWidth: 320,
    maxWidth: 480,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};