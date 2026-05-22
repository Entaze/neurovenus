// src/pages/researcher/ResearcherDashboard.jsx

import { useEffect, useMemo, useState } from "react";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import InviteParticipantModal from "../../components/researcher/InviteParticipantModal";
import ParticipantsTable from "../../components/researcher/ParticipantsTable";
import ExportButton from "../../components/researcher/ExportButton";
import { researcherApi } from "../../api/researcherApi";

const TARGET_STUDY_TITLE =
  import.meta.env.VITE_TARGET_STUDY_TITLE ||
  "Sleep Memory Consolidation Study – QA (2-Minute Delays)";

const DISPLAY_STUDY_TITLE =
  import.meta.env.VITE_DISPLAY_STUDY_TITLE ||
  "Sleep Memory Consolidation Study";

export default function ResearcherDashboard() {
  const [studies, setStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState("");

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

  const recentParticipants = participants.slice(0, 5);

  useEffect(() => {
    let ignore = false;

    async function fetchProductionStudy() {
      try {
        setLoading(true);
        setError("");

        const data = await researcherApi.getStudies();
        const studyList = Array.isArray(data) ? data : data.studies || [];

        const productionStudy = studyList.find(
          (study) => study.title === TARGET_STUDY_TITLE
        );

        if (!ignore) {
          setStudies(studyList);

          if (productionStudy?._id) {
            setSelectedStudyId(productionStudy._id);
            localStorage.setItem("selectedStudyId", productionStudy._id);
          } else {
            setSelectedStudyId("");
            setError(
              "Production study not found. Please seed Sleep Memory Consolidation Study – Production."
            );
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Failed to load production study.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProductionStudy();

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

  useEffect(() => {
    if (!selectedStudyId) return;

    let ignore = false;

    async function fetchParticipants() {
      try {
        setParticipantsLoading(true);
        setError("");

        const data = await researcherApi.getParticipants(selectedStudyId);
        const participantList = Array.isArray(data)
          ? data
          : data.participants || [];

        if (!ignore) {
          setParticipants(participantList);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Failed to load participants.");
          setParticipants([]);
        }
      } finally {
        if (!ignore) {
          setParticipantsLoading(false);
        }
      }
    }

    fetchParticipants();

    return () => {
      ignore = true;
    };
  }, [selectedStudyId]);

  const handleInvite = async ({ email, studyId }) => {
    try {
      setInviteLoading(true);
      setError("");

      await researcherApi.inviteParticipant(studyId, email);

      // Refresh usage after successful invite
      const usageData = await researcherApi.getOrganizationUsage();
      setUsage(usageData);

      const data = await researcherApi.getParticipants(studyId);
      const participantList = Array.isArray(data)
        ? data
        : data.participants || [];

      setParticipants(participantList);
    } catch (err) {
      const code = err?.response?.data?.code;
      const message = err?.response?.data?.message;

      if (code === "PARTICIPANT_LIMIT_REACHED") {
        setError(message || "You have reached your monthly participant limit.");
      } else {
        setError(message || err?.message || "Failed to invite participant.");
      }

      throw err;
    } finally {
      setInviteLoading(false);
    }
  };

  const handleExportParticipant = (participant) => {
    if (!selectedStudyId || !participant?._id) return;

    window.location.href = researcherApi.getParticipantExportUrl(
      selectedStudyId,
      participant._id
    );
  };

  return (
    <ResearcherLayout>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Researcher Dashboard</h1>
          <p style={styles.subtitle}>
            Invite participants to complete the Sleep Memory Consolidation Study
            and export their study data.
          </p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Plan Usage</h2>

        {usageLoading ? (
          <p style={styles.muted}>Loading usage metrics...</p>
        ) : usage ? (
          <div style={styles.usageGrid}>
            <div style={styles.usageItem}>
              <span style={styles.usageLabel}>Plan</span>
              <span style={styles.usageValue}>
                {usage.organization?.plan?.toUpperCase()}
              </span>
            </div>

            <div style={styles.usageItem}>
              <span style={styles.usageLabel}>Seats</span>
              <span style={styles.usageValue}>
                {usage.usage.seatsUsed} / {usage.limits.maxSeats}
              </span>
            </div>

            <div style={styles.usageItem}>
              <span style={styles.usageLabel}>Active Studies</span>
              <span style={styles.usageValue}>
                {usage.usage.activeStudiesUsed} /{" "}
                {usage.limits.maxActiveStudies}
              </span>
            </div>

            <div style={styles.usageItem}>
              <span style={styles.usageLabel}>Participants This Month</span>
              <span style={styles.usageValue}>
                {usage.usage.participantsThisMonth} /{" "}
                {usage.limits.maxParticipantsPerMonth}
              </span>
            </div>
          </div>
        ) : (
          <p style={styles.muted}>Usage information unavailable.</p>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Current Study</h2>

        {loading ? (
          <p style={styles.muted}>Loading study protocol...</p>
        ) : selectedStudy ? (
          <div style={styles.studySummary}>
            <p style={styles.studyTitle}>{DISPLAY_STUDY_TITLE}</p>

            <p style={styles.studyMeta}>
              Protocol version: {selectedStudy.protocolVersion || "Not set"}
            </p>

            <p style={styles.studyDescription}>
              {selectedStudy.description ||
                "A four-session longitudinal cognitive assessment protocol."}
            </p>
          </div>
        ) : (
          <p style={styles.muted}>
            No production study protocol found. Please seed the production study
            first.
          </p>
        )}
      </section>

      <InviteParticipantModal
        studyId={selectedStudyId}
        loading={inviteLoading}
        onInvite={handleInvite}
      />

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Recent Participants</h2>
            <p style={styles.muted}>
              Showing the latest participants invited to this study.
            </p>
          </div>

          {selectedStudyId && (
            <ExportButton
              href={researcherApi.getStudyExportUrl(selectedStudyId)}
              label="Export Study CSV"
            />
          )}
        </div>

        {participantsLoading ? (
          <p style={styles.muted}>Loading participants...</p>
        ) : (
          <ParticipantsTable
            participants={recentParticipants}
            onExport={handleExportParticipant}
          />
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
  },

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

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },

  studySummary: {
    padding: 18,
    borderRadius: 14,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  studyTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 800,
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

  usageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  usageItem: {
    padding: 18,
    borderRadius: 14,
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  usageLabel: {
    display: "block",
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  usageValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
  },
};