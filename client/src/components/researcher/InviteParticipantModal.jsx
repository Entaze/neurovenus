import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteParticipantModal({
  onInvite,
  disabled = false,
  disabledMessage = "",
  loading = false,
  studyId,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isDisabled = disabled || loading || !studyId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isDisabled) {
      setError(
        disabledMessage || "Create and select a study before inviting participants."
      );
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter a participant email address.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid participant email address.");
      return;
    }

    try {
      await onInvite?.({
        email: trimmedEmail,
        studyId,
      });

      setEmail("");
      setError("");
    } catch (err) {
      setError(err?.message || "Failed to send invitation.");
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Invite Participant</h3>

      <p style={styles.subtitle}>
        Enter a participant's email address to generate a secure invitation link
        and send the study invite automatically.
      </p>

      {isDisabled && !loading && (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>
            {disabledMessage || "Create and select a protocol before inviting participants."}
          </p>
          <p style={styles.emptySubtitle}>
            {disabledMessage
              ? "Upgrade your plan or wait until your monthly allowance resets."
              : "You can invite participants once a study protocol exists."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="participant@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          style={{
            ...styles.input,
            ...(isDisabled ? styles.inputDisabled : {}),
          }}
          disabled={isDisabled}
        />

        <button
          type="submit"
          disabled={isDisabled || loading || !email.trim()}
          style={{
            ...styles.button,
            ...(isDisabled || loading || !email.trim()
              ? styles.buttonDisabled
              : {}),
          }}
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>
      </form>

      <div style={styles.errorContainer}>
        {error ? <p style={styles.error}>{error}</p> : null}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  form: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: 280,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    outline: "none",
    fontSize: 14,
  },

  inputDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

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

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  errorContainer: {
    minHeight: 26,
    marginTop: 10,
  },

  error: {
    margin: 0,
    color: "#f87171",
    fontSize: 13,
  },

  emptyState: {
    padding: "28px 24px",
    marginBottom: 16,
    textAlign: "center",
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: "#e2e8f0",
  },

  emptySubtitle: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
  },
};