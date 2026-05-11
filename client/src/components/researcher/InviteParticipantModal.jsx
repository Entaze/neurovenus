// src/components/researcher/InviteParticipantModal.jsx

import { useState } from "react";

export default function InviteParticipantModal({
  onInvite,
  loading = false,
  studyId,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter a participant email address.");
      return;
    }

    if (!studyId) {
      setError("Please select a study first.");
      return;
    }

    try {
      await onInvite?.({
        email: email.trim().toLowerCase(),
        studyId,
      });

      setEmail("");
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

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="participant@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
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
    marginBottom: 20,
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

  button: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #06b6d4, #2563eb)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  error: {
    marginTop: 12,
    color: "#f87171",
    fontSize: 13,
  },
};