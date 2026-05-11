import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/client";
import { useResearcherAuth } from "../../hooks/useResearcherAuth";

export default function ResearcherLogin() {
  const navigate = useNavigate();
  const { login } = useResearcherAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("researcher@cognimeo.com");
  // const [password, setPassword] = useState("password123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      login({
        token: response.data.token,
        user: response.data.user,
      });

      navigate("/researcher/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.hero}>
          <p style={styles.brand}>COGNIMEO</p>

          <h1 style={styles.heroTitle}>
            Research-grade cognitive testing, delivered remotely.
          </h1>

          <p style={styles.heroText}>
            Manage studies, invite participants, monitor sessions, and export
            clean research data from one secure dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <p style={styles.kicker}>Researcher Portal</p>
          <h2 style={styles.title}>Sign in</h2>

          <label style={styles.field}>
            <span style={styles.label}>Email</span>
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              disabled={submitting}
              autoComplete="email"
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Password</span>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={submitting}
              autoComplete="current-password"
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background:
      "radial-gradient(circle at 12% 25%, rgba(6,182,212,0.18), transparent 28%), radial-gradient(circle at 80% 18%, rgba(37,99,235,0.18), transparent 30%), #080d1a",
    color: "#ffffff",
    boxSizing: "border-box",
  },

  shell: {
    width: "100%",
    maxWidth: 1320,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 420px",
    alignItems: "center",
    gap: 96,
  },

  hero: {
    maxWidth: 720,
  },

  brand: {
    margin: "0 0 28px",
    color: "#22d3ee",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.32em",
  },

  heroTitle: {
    margin: 0,
    maxWidth: 700,
    fontSize: "clamp(40px, 5vw, 68px)",
    lineHeight: 1.02,
    letterSpacing: "-0.055em",
    fontWeight: 850,
  },

  heroText: {
    margin: "28px 0 0",
    maxWidth: 640,
    color: "#b8c4d6",
    fontSize: 18,
    lineHeight: 1.75,
  },

  card: {
    width: "100%",
    padding: 34,
    borderRadius: 28,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 34px 110px rgba(0,0,0,0.44)",
    backdropFilter: "blur(18px)",
    boxSizing: "border-box",
  },

  kicker: {
    margin: 0,
    color: "#22d3ee",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },

  title: {
    margin: "8px 0 30px",
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#cbd5e1",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: 14,
    boxShadow: "0 0 0 1px rgba(34,211,238,0.35)",
    background: "rgba(15,23,42,0.78)",
    color: "#ffffff",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
    transition: "all 0.2s ease"
  },

  error: {
    margin: "4px 0 16px",
    color: "#f87171",
    fontSize: 13,
  },

  button: {
    width: "100%",
    marginTop: 4,
    padding: "14px 18px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #06b6d4, #2563eb)",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 15,
    boxShadow: "0 14px 32px rgba(37,99,235,0.38)",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};