// src/components/researcher/StudySelector.jsx
import { ChevronDown } from "lucide-react";

export default function StudySelector({
  studies = [],
  selectedStudyId = "",
  onChange,
  loading = false,
}) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.selectWrap}>
      <select
        value={selectedStudyId}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={loading}
        style={{
          ...styles.select,
          ...(loading ? styles.disabled : {}),
        }}
      >
        <option value="" style={styles.option}>
          {loading ? "Loading studies..." : "Select a protocol"}
        </option>

        {studies.map((study) => (
          <option key={study._id} value={study._id} style={styles.option}>
            {study.title}
          </option>
        ))}
      </select>

      <ChevronDown size={16} strokeWidth={1.75} style={styles.chevron} />
      </div>
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

  selectWrap: {
    position: "relative",
  },

  select: {
    width: "100%",
    height: 40,
    appearance: "none",
    WebkitAppearance: "none",
    padding: "0 48px 0 16px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "#111827",
    color: "#e5eefb",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  chevron: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#94a3b8",
  },

  option: {
    background: "#0f172a",
    color: "#ffffff",
  },
};