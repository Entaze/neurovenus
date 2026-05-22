import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, User } from "lucide-react";

import api from "../../api/client";

export default function AcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This invitation link is missing a token.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/researchers/accept-invite", {
        token,
        name: name.trim(),
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/researcher/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <img
          src="/neurovenus-icon.svg"
          alt="Neurovenus"
          style={styles.logo}
        />

        <p style={styles.kicker}>Researcher Invitation</p>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>
          Set your name and password to join your Neurovenus workspace.
        </p>

        {!token && (
          <div style={styles.error}>
            This invitation link is invalid because no token was found.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.field}>
            <span style={styles.label}>Full Name</span>
            <div style={styles.inputWrap}>
              <User size={18} style={styles.inputIcon} />
              <input
                value={name}
                placeholder="Sarah Smith"
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                disabled={submitting || !token}
              />
            </div>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Password</span>
            <div style={styles.inputWrap}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                value={password}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={submitting || !token}
                autoComplete="new-password"
              />
            </div>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Confirm Password</span>
            <div style={styles.inputWrap}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                disabled={submitting || !token}
                autoComplete="new-password"
              />
            </div>
          </label>

          <div style={styles.messageBox}>
            {error ? <p style={styles.errorText}>{error}</p> : null}
            {success ? <p style={styles.successText}>{success}</p> : null}
          </div>

          <button
            type="submit"
            disabled={submitting || !token}
            style={{
              ...styles.button,
              ...(submitting || !token ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.helpText}>
          Already have an account?{" "}
          <Link to="/researcher/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "linear-gradient(135deg, #020617 0%, #041127 45%, #030b1d 100%)",
    color: "#ffffff",
  },

  card: {
    width: "100%",
    maxWidth: 460,
    padding: 36,
    borderRadius: 24,
    background: "rgba(7,13,31,0.78)",
    border: "1px solid rgba(148,163,184,0.24)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  },

  logo: {
    width: 42,
    height: 42,
    marginBottom: 22,
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  title: {
    margin: "12px 0 8px",
    fontSize: 32,
    fontWeight: 900,
    color: "#ffffff",
  },

  subtitle: {
    margin: "0 0 26px",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: 800,
    color: "#e5eefb",
  },

  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: 16,
    color: "#94a3b8",
  },

  input: {
    width: "100%",
    height: 48,
    padding: "0 16px 0 48px",
    borderRadius: 12,
    border: "1px solid rgba(59,130,246,0.35)",
    background: "rgba(2,6,23,0.62)",
    color: "#ffffff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },

  messageBox: {
    minHeight: 22,
  },

  error: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    fontSize: 13,
  },

  errorText: {
    margin: 0,
    color: "#fca5a5",
    fontSize: 13,
  },

  successText: {
    margin: 0,
    color: "#86efac",
    fontSize: 13,
  },

  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  helpText: {
    margin: "22px 0 0",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 13,
  },

  link: {
    color: "#38bdf8",
    fontWeight: 700,
    textDecoration: "none",
  },
};