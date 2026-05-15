import { Link } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020817",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },

  card: {
    width: "100%",
    maxWidth: "640px",
    background: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(59, 130, 246, 0.18)",
    borderRadius: "24px",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
  },

  eyebrow: {
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#38bdf8",
    marginBottom: "1rem",
  },

  title: {
    fontSize: "3rem",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: "1rem",
    color: "#f8fafc",
  },

  description: {
    fontSize: "1.1rem",
    lineHeight: 1.8,
    color: "#94a3b8",
    marginBottom: "2rem",
  },

  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.9rem 1.75rem",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1rem",
    boxShadow: "0 12px 30px rgba(37, 99, 235, 0.35)",
  },
};

export default function UnauthorizedPage() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>Access Restricted</div>

        <h1 style={styles.title}>You do not have permission to view this page</h1>

        <p style={styles.description}>
          This area is only available to authorized administrators.
          If you believe you should have access, please contact your
          organization administrator.
        </p>

        <Link to="/researcher/dashboard" style={styles.button}>
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}