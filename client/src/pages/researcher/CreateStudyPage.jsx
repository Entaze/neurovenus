import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    try {
      setSaving(true);

      const response = await researcherApi.createStudy({
        title: title.trim(),
        description: description.trim(),
        protocol,
      });

      const studyId = response?.study?._id;

      if (studyId) {
        navigate(`/researcher/studies/${studyId}`);
      } else {
        navigate("/researcher/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create study."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ResearcherLayout>
      <div style={styles.page}>
        <div style={styles.hero}>
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

          {error ? <div style={styles.error}>{error}</div> : null}

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/researcher/dashboard")}
              style={styles.secondaryButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={styles.primaryButton}
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
    gap: 8,
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
    color: "#ffffff",
    fontSize: 42,
    fontWeight: 950,
    letterSpacing: "-0.05em",
  },

  subtitle: {
    margin: 0,
    maxWidth: 760,
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.7,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  card: {
    padding: 28,
    borderRadius: 28,
    background: "rgba(7, 15, 35, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
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
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 14,
    background: "rgba(15, 23, 42, 0.7)",
    color: "#e2e8f0",
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    borderRadius: 14,
    background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
    color: "#ffffff",
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
};