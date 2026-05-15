// src/components/researcher/InfoNotice.jsx

export default function InfoNotice({ children }) {
  return (
    <div style={styles.notice}>
      <div style={styles.noticeIcon}>i</div>
      <span>{children}</span>
    </div>
  );
}

const styles = {
  notice: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(8, 47, 73, 0.65)",
    border: "1px solid rgba(14, 165, 233, 0.22)",
    color: "rgba(226, 232, 240, 0.9)",
    fontSize: 14,
    lineHeight: 1.5,
  },

  noticeIcon: {
    width: 22,
    height: 22,
    minWidth: 22,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(14, 165, 233, 0.14)",
    border: "1px solid rgba(14, 165, 233, 0.28)",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 700,
    fontStyle: "italic",
  },
};