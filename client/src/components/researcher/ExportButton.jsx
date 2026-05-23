import { useState } from "react";

export default function ExportButton({
  onExport,
  loading: externalLoading = false,
  label = "Export CSV",
  disabled = false,
}) {
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading || internalLoading;

  const isDisabled =
    loading ||
    disabled ||
    !onExport;

  const handleClick = async () => {
    if (isDisabled) return;

    try {
      setInternalLoading(true);

      await onExport();
    } catch (error) {
      console.error("Export failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Export failed."
      );
    } finally {
      setInternalLoading(false);
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