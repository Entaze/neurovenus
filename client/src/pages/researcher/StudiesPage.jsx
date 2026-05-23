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
  const [usage, setUsage] = useState(null);
  const [, setUsageLoading] = useState(true);

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

  useEffect(() => {
    let ignore = false;

    async function fetchUsage() {
      try {
        setUsageLoading(true);

        const data = await researcherApi.getOrganizationUsage();

        if (!ignore) {
          setUsage(data);
        }
      } catch (err) {
        console.error("Failed to load organization usage:", err);
      } finally {
        if (!ignore) {
          setUsageLoading(false);
        }
      }
    }

    fetchUsage();

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

  const isUnlimitedPlan = ["institutional", "custom"].includes(
    usage?.organization?.plan
  );

  const activeStudyLimitReached = !isUnlimitedPlan &&
    usage?.usage?.activeStudiesUsed >=
    usage?.limits?.maxActiveStudies;

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

        <div style={styles.headerActions}>
          <button
            type="button"
            onClick={() => navigate("/researcher/studies/new")}
            disabled={activeStudyLimitReached}
            style={{
              ...styles.primaryButton,
              ...(activeStudyLimitReached ? styles.buttonDisabled : {}),
            }}
          >
            New Protocol
          </button>

         {activeStudyLimitReached && (
          <div style={styles.limitPill}>
            <span style={styles.limitIcon}>ⓘ</span>
            <span>Study limit reached for Standard plan</span>
          </div>
        )}
        </div>
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
            <p style={styles.emptyEyebrow}>WELCOME TO NEUROVENUS</p>

            <h3 style={styles.emptyTitle}>
              Create your first research protocol
            </h3>

            <p style={styles.emptySubtitle}>
              Neurovenus helps researchers design structured assessment workflows,
              recruit participants remotely, and export analysis-ready datasets.
            </p>

            <div style={styles.workflowCard}>
              <p style={styles.workflowTitle}>
                Most researchers begin by:
              </p>

              <div style={styles.workflowList}>
                <div style={styles.workflowStep}>
                  <span style={styles.workflowNumber}>1</span>
                  <span>Create a protocol</span>
                </div>

                <div style={styles.workflowStep}>
                  <span style={styles.workflowNumber}>2</span>
                  <span>Add sessions and assessments</span>
                </div>

                <div style={styles.workflowStep}>
                  <span style={styles.workflowNumber}>3</span>
                  <span>Recruit participants remotely</span>
                </div>

                <div style={styles.workflowStep}>
                  <span style={styles.workflowNumber}>4</span>
                  <span>Export analysis-ready data</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/researcher/studies/new")}
              disabled={activeStudyLimitReached}
              style={{
                ...styles.primaryButton,
                ...(activeStudyLimitReached ? styles.buttonDisabled : {}),
              }}
            >
              Create First Protocol
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

  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  limitMessage: {
    margin: 0,
    color: "#fca5a5",
    fontSize: 12,
    textAlign: "right",
    lineHeight: 1.4,
    maxWidth: 280,
    opacity: 0.9,
  },

  emptyEyebrow: {
    margin: 0,
    marginBottom: 14,
    color: "#60a5fa",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  workflowCard: {
    marginTop: 24,
    marginBottom: 26,
    padding: 18,
    borderRadius: 14,
    background: "rgba(15,23,42,0.55)",
    border: "1px solid rgba(148,163,184,0.12)",
    textAlign: "left",
    maxWidth: 520,
    marginInline: "auto",
  },

  workflowTitle: {
    margin: 0,
    marginBottom: 14,
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
  },

  workflowList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  workflowStep: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#cbd5e1",
    fontSize: 14,
  },

  workflowNumber: {
    width: 24,
    height: 24,
    borderRadius: 999,
    background: "rgba(59,130,246,0.18)",
    color: "#93c5fd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    flexShrink: 0,
  },

  headerActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
    minWidth: 320,
    paddingTop: 24,
  },

  limitPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(245, 158, 11, 0.10)",
    border: "1px solid rgba(245, 158, 11, 0.18)",
    color: "#fcd34d",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
  },

  limitIcon: {
    fontSize: 12,
    opacity: 0.9,
  },
};