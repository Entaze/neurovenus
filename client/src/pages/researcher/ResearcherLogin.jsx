import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users, Activity, Download } from "lucide-react";

import api from "../../api/client";
import { useResearcherAuth } from "../../hooks/useResearcherAuth";

export default function ResearcherLogin() {
  const navigate = useNavigate();
  const { login } = useResearcherAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

      navigate("/researcher/participants", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={styles.gridOverlay} />

      <section style={styles.shell}>
        <div style={styles.hero}>
          <div style={styles.logoRow}>
            <img
              src="/neurovenus-icon.svg"
              alt="Neurovenus icon"
              style={styles.logoIcon}
            />

            <span style={styles.logoText}>NEUROVENUS</span>
          </div>

          <div style={styles.badge}>Researcher Portal</div>

          <h1 style={styles.heroTitle}>
            Research-grade cognitive testing,{" "}
            <span style={styles.gradientText}>delivered remotely.</span>
          </h1>

          <p style={styles.heroText}>
            Build and run remote cognitive and sleep studies. Invite participants,
            monitor sessions, collect high-quality data, and export analysis-ready
            datasets from one secure platform.
          </p>

          <div style={styles.featuresGrid}>
            <Feature
              icon={<ShieldCheck size={26} />}
              title="Secure by design"
              text="Protected researcher access and secure participant links."
            />
            <Feature
              icon={<Users size={26} />}
              title="Flexible studies"
              text="Configure sessions, assessments, schedules, and reminders."
            />
            <Feature
              icon={<Activity size={26} />}
              title="Progress tracking"
              text="Monitor participant completion and session activity."
            />
            <Feature
              icon={<Download size={26} />}
              title="Clean exports"
              text="Export structured datasets for downstream analysis."
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <p style={styles.kicker}>Researcher Portal</p>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your Neurovenus account.</p>

          <label style={styles.field}>
            <span style={styles.label}>Email</span>
            <div style={styles.inputWrap}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                disabled={submitting}
                autoComplete="email"
              />
            </div>
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Password</span>
            <div style={styles.inputWrap}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                disabled={submitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                style={styles.eyeButton}
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div style={styles.optionsRow}>
            <label style={styles.rememberRow}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>

            <button type="button" style={styles.linkButton}>
              Forgot password?
            </button>
          </div>

          <p
            style={{
              ...styles.error,
              visibility: error ? "visible" : "hidden",
            }}
          >
            {error || "Placeholder"}
          </p>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <button type="button" style={styles.secondaryButton}>
            Sign in with SSO
          </button>

          <p style={styles.helpText}>
            Need access?{" "}
            <span style={styles.helpLink}>Contact your study administrator.</span>
          </p>
        </form>
      </section>

      <footer style={styles.footer}>
        <span>© 2026 Neurovenus. All rights reserved.</span>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div style={styles.feature}>
      <div style={styles.featureIcon}>{icon}</div>
      <div>
        <h3 style={styles.featureTitle}>{title}</h3>
        <p style={styles.featureText}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 56px 72px",
    background:
      "linear-gradient(135deg, #020617 0%, #041127 38%, #030b1d 68%, #0b0820 100%)",
    color: "#ffffff",
    boxSizing: "border-box",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  glowOne: {
    display: "none",
  },

  glowTwo: {
    display: "none",
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
    `,
    backgroundSize: "64px 64px",
    opacity: 0.42,
    pointerEvents: "none",
  },

  shell: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 1280,
    display: "grid",
    gridTemplateColumns: "minmax(0, 700px) 420px",
    alignItems: "center",
    justifyContent: "center",
    gap: 110,
    marginTop: "-56px",
  },

  hero: {
    maxWidth: 700,
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 56,
  },

  logoIcon: {
    width: 34,
    height: 34,
    display: "block",
    flexShrink: 0,
  },

  logoText: {
    fontSize: 17,
    fontWeight: 900,
    letterSpacing: "0.34em",
    color: "#ffffff",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 16px",
    marginBottom: 28,
    borderRadius: 999,
    background: "rgba(15,23,42,0.45)",
    border: "1px solid rgba(148,163,184,0.18)",
    color: "#b9d7ff",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
  },

  heroTitle: {
    margin: 0,
    maxWidth: 700,
    fontSize: "clamp(64px, 4.8vw, 76px)",
    lineHeight: 1.02,
    letterSpacing: "-0.065em",
    fontWeight: 950,
    color: "#ffffff",
  },

  gradientText: {
    display: "inline",
    background:
      "linear-gradient(90deg, #38bdf8 0%, #4f8cff 45%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  },

  heroText: {
    margin: "28px 0 0",
    maxWidth: 620,
    color: "#d4deeb",
    fontSize: 18,
    lineHeight: 1.9,
  },

  featuresGrid: {
    marginTop: 48,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: 56,
    rowGap: 28,
    maxWidth: 650,
  },

  feature: {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    gap: 16,
    alignItems: "flex-start",
  },

  featureIcon: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    color: "#38bdf8",
  },

  featureTitle: {
    margin: "0 0 8px",
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#ffffff",
  },

  featureText: {
    margin: 0,
    color: "#b8c4d6",
    fontSize: 15,
    lineHeight: 1.7,
  },

  card: {
    width: "100%",
    padding: "40px 36px",
    borderRadius: 28,
    background: "rgba(7,13,31,0.74)",
    border: "1px solid rgba(148,163,184,0.24)",
    boxShadow:
      "0 30px 100px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    boxSizing: "border-box",
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
  },

  title: {
    margin: "14px 0 8px",
    fontSize: 34,
    fontWeight: 950,
    letterSpacing: "-0.06em",
    color: "#ffffff",
  },

  subtitle: {
    margin: "0 0 28px",
    color: "#c3ccda",
    fontSize: 14,
    lineHeight: 1.6,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
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
    height: 50,
    padding: "0 48px",
    borderRadius: 12,
    border: "1px solid rgba(59,130,246,0.45)",
    background: "rgba(2,6,23,0.58)",
    color: "#ffffff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
  },

  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    margin: "2px 0 22px",
  },

  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#d7deea",
    fontSize: 12,
  },

  checkbox: {
    width: 15,
    height: 15,
    accentColor: "#3b82f6",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },

  error: {
    height: 20,
    margin: "0 0 16px",
    color: "#fca5a5",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: "20px",
  },

  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background:
      "linear-gradient(90deg, #2ea8ff 0%, #4d7cff 52%, #8b2cf5 100%)",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 14,
    boxShadow: "0 8px 24px rgba(79,124,255,0.22)",
    transition: "all 0.25s ease",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  divider: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 16,
    margin: "24px 0",
  },

  dividerLine: {
    height: 1,
    background: "rgba(148,163,184,0.22)",
  },

  dividerText: {
    color: "#94a3b8",
    fontSize: 13,
  },

  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(15,23,42,0.25)",
    color: "#f1f5f9",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },

  helpText: {
    margin: "26px 0 0",
    textAlign: "center",
    color: "#9aa7bb",
    fontSize: 13,
    lineHeight: 1.6,
  },

  helpLink: {
    color: "#38bdf8",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    gap: 32,
    color: "#7f8ca3",
    fontSize: 12,
  },
};