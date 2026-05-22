import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { researcherApi } from "../../api/researcherApi";
import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import ProtocolBuilder from "../../components/protocol/ProtocolBuilder";

export default function CreateStudyPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [protocol, setProtocol] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a study title.");
      return;
    }

    if (!protocol?.sessions?.length) {
      setError("Please add at least one session.");
      return;
    }

    const hasAssessments = protocol.sessions.some(
      (session) => session.assessments?.length > 0
    );

    if (!hasAssessments) {
      setError("Please add at least one assessment.");
      return;
    }

    // Ensure every session contains at least one assessment
    const emptySessionIndex = protocol.sessions.findIndex(
      (session) => !session.assessments || session.assessments.length === 0
    );

    if (emptySessionIndex !== -1) {
      setError(
        `Session ${emptySessionIndex + 1} has no assessments. Please add at least one assessment or remove the session.`
      );
      return;
    }

    try {
      setSaving(true);

      const response = await researcherApi.createStudy({
        title: title.trim(),
        description: description.trim(),
        protocol,
      });

      const studyId = response?.study?._id;

      navigate(studyId ? `/researcher/studies/${studyId}` : "/researcher/studies");
    } catch (err) {
      const code = err?.response?.data?.code;
      const message = err?.response?.data?.message;

      if (code === "ACTIVE_STUDY_LIMIT_REACHED") {
        setError(
          message || "You have reached your active study limit for this plan."
        );
      } else {
        setError(
          message || err?.message || "Failed to create study."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResearcherLayout>
      <div style={styles.page}>
        <div style={styles.hero}>
          <div style={styles.breadcrumb}>
            <Link to="/researcher/studies" style={styles.breadcrumbLink}>
              Studies
            </Link>
            <span style={styles.breadcrumbSeparator}>›</span>
            <span style={styles.breadcrumbCurrent}>New Study</span>
          </div>

          <p style={styles.kicker}>New Study</p>
          <h1 style={styles.title}>Create a study protocol</h1>
          <p style={styles.subtitle}>
            Configure sessions, select assessments, and launch a fully remote
            cognitive and sleep research study.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Study Information</h2>

            <div style={styles.field}>
              <label style={styles.label}>Study Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sleep and Memory Pilot"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the study."
                rows={4}
                style={styles.textarea}
              />
            </div>
          </section>

          <section style={styles.card}>
            <ProtocolBuilder value={protocol} onChange={setProtocol} />
          </section>

          <div style={styles.errorContainer}>
            {error ? <div style={styles.error}>{error}</div> : null}
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/researcher/studies")}
              style={styles.secondaryButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.primaryButton,
                ...(saving ? styles.buttonDisabled : {}),
              }}
            >
              {saving ? "Creating Study..." : "Create Study"}
            </button>
          </div>
        </form>
      </div>
    </ResearcherLayout>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },

  hero: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
  },

  breadcrumbLink: {
    color: "#38bdf8",
    textDecoration: "none",
  },

  breadcrumbSeparator: {
    color: "#64748b",
  },

  breadcrumbCurrent: {
    color: "#94a3b8",
  },

  kicker: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
  },

  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#ffffff",
  },

  subtitle: {
    margin: 0,
    maxWidth: 760,
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.6,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  card: {
    padding: 24,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  sectionTitle: {
    margin: "0 0 20px",
    color: "#ffffff",
    fontSize: 22,
    fontWeight: 900,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 18,
  },

  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 800,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(59, 130, 246, 0.18)",
    background: "rgba(2, 6, 23, 0.8)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(59, 130, 246, 0.18)",
    background: "rgba(2, 6, 23, 0.8)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
  },

  error: {
    padding: "14px 16px",
    borderRadius: 14,
    background: "rgba(127, 29, 29, 0.18)",
    border: "1px solid rgba(248, 113, 113, 0.18)",
    color: "#fca5a5",
    fontSize: 14,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },

  secondaryButton: {
    borderRadius: 10,
    padding: "10px 14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    background: "#2f4b88",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },

  errorContainer: {
    minHeight: 56,
    display: "flex",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};