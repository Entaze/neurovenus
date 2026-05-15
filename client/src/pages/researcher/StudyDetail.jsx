// src/pages/researcher/StudyDetail.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  Layers,
  Users,
} from "lucide-react";

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

  const sessions = useMemo(() => {
    if (study?.protocol?.sessions?.length) return study.protocol.sessions;
    if (study?.sessions?.length) return study.sessions;
    return [];
  }, [study]);

  const allAssessments = useMemo(() => {
    return sessions.flatMap((session) => session.assessments || []);
  }, [sessions]);

  const uniqueAssessments = useMemo(() => {
    const map = new Map();

    allAssessments.forEach((assessment) => {
      const key = assessment.assessmentId || assessment.type || assessment.name;
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, assessment);
      }
    });

    return Array.from(map.values());
  }, [allAssessments]);

  const studyType = sessions.length > 1 ? "Multi-session" : "Single-session";

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
              value={study.protocolVersion || "custom"}
            />
            <DetailItem label="Participants" value={participants.length} />
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
        <h2 style={styles.sectionTitle}>Protocol Summary</h2>

        <div style={styles.summaryGrid}>
          <SummaryItem icon={Layers} label="Sessions" value={sessions.length} />
          <SummaryItem
            icon={ClipboardList}
            label="Assessments"
            value={allAssessments.length}
          />
          <SummaryItem
            icon={CalendarDays}
            label="Study Type"
            value={studyType}
          />
          <SummaryItem
            icon={Users}
            label="Participants"
            value={participants.length}
          />
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Assessment Inventory</h2>

        {uniqueAssessments.length === 0 ? (
          <p style={styles.muted}>No assessments configured for this study.</p>
        ) : (
          <div style={styles.assessmentGrid}>
            {uniqueAssessments.map((assessment, index) => (
              <div
                key={
                  assessment.assessmentId ||
                  assessment.type ||
                  assessment.name ||
                  index
                }
                style={styles.assessmentCard}
              >
                <p style={styles.assessmentName}>
                  {assessment.name ||
                    formatAssessmentName(
                      assessment.assessmentId || assessment.type
                    )}
                </p>

                <p style={styles.assessmentMeta}>
                  {formatLabel(assessment.category || assessment.type)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Session Timeline</h2>

        {sessions.length === 0 ? (
          <p style={styles.muted}>No sessions configured for this study.</p>
        ) : (
          <div style={styles.timeline}>
            {sessions.map((session, index) => (
              <div
                key={session.id || session._id || index}
                style={styles.timelineItem}
              >
                <div style={styles.timelineMarker}>
                  {session.order || index + 1}
                </div>

                <div style={styles.timelineContent}>
                  <div style={styles.timelineHeader}>
                    <div>
                      <p style={styles.timelineEyebrow}>
                        Session {session.order || index + 1}
                      </p>

                      <h3 style={styles.timelineTitle}>
                        {session.label || session.name || `Session ${index + 1}`}
                      </h3>
                    </div>

                    <span style={styles.delayBadge}>
                      {getSessionDelayLabel(session, index)}
                    </span>
                  </div>

                  {session.assessments?.length > 0 ? (
                    <div style={styles.sessionAssessments}>
                      {session.assessments.map((assessment, assessmentIndex) => (
                        <span
                          key={`${assessment.assessmentId || assessment.type}-${assessmentIndex}`}
                          style={styles.sessionAssessmentPill}
                        >
                          {assessment.name ||
                            formatAssessmentName(
                              assessment.assessmentId || assessment.type
                            )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.muted}>
                      No assessments configured for this session.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Participant Progress Snapshot</h2>

        <div style={styles.detailGrid}>
          <DetailItem label="Invited" value={participants.length} />
          <DetailItem
            label="Active"
            value={participants.filter((p) => p.status === "active").length}
          />
          <DetailItem
            label="Completed"
            value={participants.filter((p) => p.status === "completed").length}
          />
          <DetailItem
            label="Expired"
            value={participants.filter((p) => p.status === "expired").length}
          />
        </div>
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

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div style={styles.summaryItem}>
      <div style={styles.summaryIcon}>
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div>
        <p style={styles.detailLabel}>{label}</p>
        <p style={styles.detailValue}>{value}</p>
      </div>
    </div>
  );
}

function formatLabel(value = "") {
  if (!value) return "Not set";

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAssessmentName(value = "") {
  const map = {
    avlt: "AVLT",
    nback: "N-Back",
    fingerTapping: "Finger Tapping",
    finger_tapping: "Finger Tapping",
    psqi: "PSQI",
    stroop: "Stroop",
    digitSpan: "Digit Span",
    digit_span: "Digit Span",
  };

  return map[value] || formatLabel(value);
}

function getSessionDelayLabel(session, index) {
  if (index === 0 || session.order === 1) {
    return "Available immediately";
  }

  const value = session.delayValue ?? session.delay?.value;
  const unit = session.delayUnit ?? session.delay?.unit;

  if (!value || Number(value) === 0) {
    return "Opens immediately after previous session";
  }

  return `Opens after ${value} ${unit || "days"}`;
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

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    color: "#93c5fd",
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.18)",
    flexShrink: 0,
  },

  assessmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },

  assessmentCard: {
    padding: 16,
    borderRadius: 14,
    background: "rgba(15,23,42,0.48)",
    border: "1px solid rgba(148,163,184,0.12)",
  },

  assessmentName: {
    margin: 0,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 800,
  },

  assessmentMeta: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: 13,
  },

  timeline: {
    display: "grid",
    gap: 18,
  },

  timelineItem: {
    display: "grid",
    gridTemplateColumns: "42px 1fr",
    gap: 14,
  },

  timelineMarker: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.22)",
    color: "#93c5fd",
    fontWeight: 900,
  },

  timelineContent: {
    padding: 18,
    borderRadius: 16,
    background: "rgba(15,23,42,0.48)",
    border: "1px solid rgba(148,163,184,0.12)",
  },

  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 14,
  },

  timelineEyebrow: {
    margin: 0,
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },

  timelineTitle: {
    margin: "6px 0 0",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 850,
  },

  delayBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(14,165,233,0.10)",
    color: "#7dd3fc",
    border: "1px solid rgba(14,165,233,0.16)",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  sessionAssessments: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  sessionAssessmentPill: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(148,163,184,0.12)",
    color: "#cbd5e1",
    fontSize: 12,
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
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    background: "#2f4b88",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "none",
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