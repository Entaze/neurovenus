// src/pages/researcher/StudyDetail.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import ExportButton from "../../components/researcher/ExportButton";
import { researcherApi } from "../../api/researcherApi";

export default function StudyDetail() {
  const { studyId } = useParams();

  const [studies, setStudies] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const study = useMemo(() => {
    return studies.find((item) => item._id === studyId);
  }, [studies, studyId]);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const studiesData = await researcherApi.getStudies();
        const studyList = Array.isArray(studiesData)
          ? studiesData
          : studiesData.studies || [];

        const participantsData = await researcherApi.getParticipants(studyId);
        const participantList = Array.isArray(participantsData)
          ? participantsData
          : participantsData.participants || [];

        if (!ignore) {
          setStudies(studyList);
          setParticipants(participantList);
          localStorage.setItem("selectedStudyId", studyId);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Failed to load study details.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [studyId]);

  return (
    <ResearcherLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {loading ? "Loading study..." : study?.title || "Study Detail"}
          </h1>
          <p style={styles.subtitle}>Study ID: {studyId}</p>
        </div>

        <ExportButton
          href={researcherApi.getStudyExportUrl(studyId)}
          label="Export Study CSV"
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Study Overview</h2>

        {loading ? (
          <p style={styles.muted}>Loading study details...</p>
        ) : study ? (
          <div style={styles.detailGrid}>
            <DetailItem label="Title" value={study.title} />
            <DetailItem
              label="Protocol Version"
              value={study.protocolVersion || "Not set"}
            />
            <DetailItem
              label="Participants"
              value={participants.length}
            />
            <DetailItem
              label="Created"
              value={
                study.createdAt
                  ? new Date(study.createdAt).toLocaleDateString()
                  : "Not available"
              }
            />
          </div>
        ) : (
          <p style={styles.muted}>Study not found.</p>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Description</h2>
        <p style={styles.cardText}>
          {study?.description || "No study description has been added yet."}
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Study Actions</h2>

        <div style={styles.actions}>
          <Link to="/researcher/participants" style={styles.linkButton}>
            Manage Participants
          </Link>

          <Link to="/researcher/exports" style={styles.secondaryButton}>
            Open Export Center
          </Link>
        </div>
      </section>
    </ResearcherLayout>
  );
}

function DetailItem({ label, value }) {
  return (
    <div style={styles.detailItem}>
      <p style={styles.detailLabel}>{label}</p>
      <p style={styles.detailValue}>{value}</p>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
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

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  detailItem: {
    padding: 16,
    borderRadius: 14,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  detailLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  detailValue: {
    marginTop: 8,
    marginBottom: 0,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 700,
  },

  cardText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.6,
  },

  muted: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  linkButton: {
    padding: "12px 20px",
    borderRadius: 10,
    background: "linear-gradient(90deg, #06b6d4, #2563eb)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
  },

  secondaryButton: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
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