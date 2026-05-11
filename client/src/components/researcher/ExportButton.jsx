// src/components/researcher/ExportButton.jsx

export default function ExportButton({
  onClick,
  loading = false,
  label = "Export CSV",
  disabled = false,
}) {
  const isDisabled = loading || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        ...styles.button,
        ...(isDisabled ? styles.disabled : {}),
      }}
    >
      {loading ? "Exporting..." : label}
    </button>
  );
}

const styles = {
  button: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #06b6d4, #2563eb)",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
    transition: "all 0.2s ease",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};