// src/pages/researcher/ExportsPage.jsx

import { useEffect, useMemo, useState } from "react";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import StudySelector from "../../components/researcher/StudySelector";
import ExportButton from "../../components/researcher/ExportButton";
import { researcherApi } from "../../api/researcherApi";

export default function ExportsPage() {
  const [studies, setStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(
    localStorage.getItem("selectedStudyId") || ""
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

  useEffect(() => {
    let ignore = false;

    async function fetchStudies() {
      try {
        setLoading(true);
        setError("");

        const data = await researcherApi.getStudies();
        const studyList = Array.isArray(data) ? data : data.studies || [];

        if (!ignore) {
          setStudies(studyList);

          if (!selectedStudyId && studyList.length > 0) {
            setSelectedStudyId(studyList[0]._id);
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedStudyId) {
      localStorage.setItem("selectedStudyId", selectedStudyId);
    }
  }, [selectedStudyId]);

  return (
    <ResearcherLayout>
      <h1 style={styles.title}>Exports</h1>
      <p style={styles.subtitle}>
        Download participant, session, task, and trial-level data for the
        selected study.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Select Study</h2>

        <StudySelector
          studies={studies}
          selectedStudyId={selectedStudyId}
          onChange={setSelectedStudyId}
          loading={loading}
        />

        {selectedStudy ? (
          <div style={styles.studySummary}>
            <p style={styles.studyTitle}>{selectedStudy.title}</p>
            <p style={styles.studyMeta}>
              Protocol version: {selectedStudy.protocolVersion || "Not set"}
            </p>
            {selectedStudy.description && (
              <p style={styles.studyDescription}>
                {selectedStudy.description}
              </p>
            )}
          </div>
        ) : (
          <p style={styles.muted}>
            Select a study to enable CSV export.
          </p>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Study CSV Export</h2>
        <p style={styles.cardText}>
          Export all available study data as a CSV file. This includes
          participant records, session runs, task runs, and trial-level results
          where available.
        </p>

        <ExportButton
          href={
            selectedStudyId
              ? researcherApi.getStudyExportUrl(selectedStudyId)
              : ""
          }
          disabled={!selectedStudyId}
          label="Export Study CSV"
        />
      </section>
    </ResearcherLayout>
  );
}

const styles = {
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#ffffff",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: "#94a3b8",
    fontSize: 14,
  },

  card: {
    padding: 24,
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
    marginBottom: 24,
  },

  sectionTitle: {
    margin: 0,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },

  cardText: {
    marginTop: 0,
    marginBottom: 20,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  studySummary: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  studyTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
  },

  studyMeta: {
    marginTop: 8,
    marginBottom: 0,
    color: "#67e8f9",
    fontSize: 13,
  },

  studyDescription: {
    marginTop: 10,
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  muted: {
    margin: 0,
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