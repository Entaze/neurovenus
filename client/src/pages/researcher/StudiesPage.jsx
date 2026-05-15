import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import StatCard from "../../components/researcher/StatCard";
import { researcherApi } from "../../api/researcherApi";

export default function StudiesPage() {
  const navigate = useNavigate();

  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchStudies() {
      try {
        setLoading(true);
        setError("");

        const data = await researcherApi.getStudies();
        const studyList = Array.isArray(data)
          ? data
          : data.studies || [];

        if (!ignore) {
          setStudies(studyList);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Failed to load studies.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStudies();

    return () => {
      ignore = true;
    };
  }, []);

  // Dashboard metrics
  const activeStudies = studies.length;

  const totalSessions = studies.reduce(
    (sum, study) => sum + (study.sessions?.length || study.protocol?.sessions?.length || 0),
    0
  );

  const totalAssessments = studies.reduce((sum, study) => {
    const sessions = study.sessions || study.protocol?.sessions || [];

    return (
      sum +
      sessions.reduce((sessionSum, session) => {
        const assessments = session.assessments || session.tasks || [];
        return sessionSum + assessments.length;
      }, 0)
    );
  }, 0);

  const latestStudy = studies[0]?.title || "None";

  return (
    <ResearcherLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Studies</h1>
          <p style={styles.subtitle}>
            Create, manage, and monitor all of your research studies.
          </p>
          <p style={styles.infoNote}>
            Protocols are locked after creation to preserve data integrity.
            To make changes, create a new study version.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/researcher/studies/new")}
          style={styles.primaryButton}
        >
          New Study
        </button>
      </div>

      {/* Stats */}
      {!loading && studies.length > 0 && (
        <div style={styles.statsGrid}>
          <StatCard
            label="Active Studies"
            value={activeStudies}
            subtitle="Studies currently available"
            accent="#38bdf8"
          />

          <StatCard
            label="Sessions"
            value={totalSessions}
            subtitle="Configured across all studies"
            accent="#6366f1"
          />

          <StatCard
            label="Assessments"
            value={totalAssessments}
            subtitle="Included across all protocols"
            accent="#22c55e"
          />

          <StatCard
            label="Latest Study"
            value={latestStudy}
            subtitle="Most recently created protocol"
            accent="#a855f7"
          />
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        {loading ? (
          <p style={styles.muted}>Loading studies...</p>
        ) : studies.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No studies yet</h3>
            <p style={styles.emptySubtitle}>
              Create your first study protocol to begin inviting participants.
            </p>

            <button
              type="button"
              onClick={() => navigate("/researcher/studies/new")}
              style={styles.primaryButton}
            >
              Create First Study
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {studies.map((study) => (
              <div key={study._id} style={styles.studyCard}>
                <h3 style={styles.studyTitle}>{study.title}</h3>

                <p style={styles.protocol}>
                  Protocol: {study.protocolVersion || "custom"}
                </p>

                <p style={styles.description}>
                  {study.description || "No description provided."}
                </p>

                <div style={styles.actions}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/researcher/studies/${study._id}`)
                    }
                    style={styles.secondaryButton}
                  >
                    Open Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ResearcherLayout>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  card: {
    padding: 24,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },

  studyCard: {
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  studyTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
  },

  protocol: {
    marginTop: 8,
    marginBottom: 0,
    color: "#67e8f9",
    fontSize: 13,
  },

  description: {
    marginTop: 12,
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  actions: {
    marginTop: 20,
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

  secondaryButton: {
    borderRadius: 10,
    padding: "10px 14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    cursor: "pointer",
  },

  emptyState: {
    padding: "36px 24px",
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
    marginBottom: 20,
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
  },

  muted: {
    color: "#94a3b8",
    fontSize: 14,
  },

  error: {
    padding: 14,
    marginBottom: 24,
    borderRadius: 12,
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    fontSize: 14,
  },

  infoNote: {
    marginTop: 12,
    marginBottom: 0,
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.14)",
    color: "#bae6fd",
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 760,
  },
};