// src/components/researcher/ExportButton.jsx

export default function ExportButton({
  href = "",
  onClick,
  loading = false,
  label = "Export CSV",
  disabled = false,
}) {
  const isDisabled = loading || disabled || (!href && !onClick);

  const handleClick = () => {
    if (isDisabled) return;

    // Custom click handler takes precedence.
    if (onClick) {
      onClick();
      return;
    }

    // Otherwise open export URL in a new tab.
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
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
    transition: "all 0.2s ease",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};