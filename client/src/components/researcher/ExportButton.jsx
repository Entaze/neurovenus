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
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    background: "#2f4b88",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};