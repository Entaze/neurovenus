import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResearcherLayout from "../../components/researcher/ResearcherLayout";
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

  return (
    <ResearcherLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Studies</h1>
          <p style={styles.subtitle}>
            Create, manage, and monitor all of your research studies.
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

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        {loading ? (
          <p style={styles.muted}>Loading studies...</p>
        ) : studies.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No studies yet</h3>
            <p style={styles.muted}>
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
    background: "linear-gradient(90deg, #0ea5e9, #2563eb)",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.22)",
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
    textAlign: "center",
    padding: "48px 24px",
  },

  emptyTitle: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: 22,
    color: "#ffffff",
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
};