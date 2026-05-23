import { useEffect, useMemo, useState } from "react";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import StudySelector from "../../components/researcher/StudySelector";
import InviteParticipantModal from "../../components/researcher/InviteParticipantModal";
import ParticipantsTable from "../../components/researcher/ParticipantsTable";
import { researcherApi } from "../../api/researcherApi";

const assessmentNameMap = {
  psqi: "PSQI",
  avlt: "AVLT",
  avltDelayedRecall: "AVLT Delayed Recall",
  avltRecognition: "AVLT Recognition",
  nback: "N-Back",
  fingerTap: "Finger Tapping",
  stroop: "Stroop",
  digitSpan: "Digit Span",
  pvt: "PVT",
  ess: "ESS",
  kss: "KSS",
};

const getStudySessions = (study) =>
  study?.protocol?.sessions?.length
    ? study.protocol.sessions
    : study?.sessions || [];

const getSessionAssessments = (session) =>
  session?.assessments?.length ? session.assessments : session?.tasks || [];

const getAssessmentLabel = (assessment) => {
  const key = assessment?.assessmentId || assessment?.type || assessment?.name;
  return assessmentNameMap[key] || assessment?.name || key || "Assessment";
};

const formatDelayValue = (value, unit) => {
  const number = Number(value || 0);

  if (number <= 0) return null;

  const clean = Number.isInteger(number) ? number : Number(number.toFixed(2));

  return `Opens after ${clean} ${unit}${clean === 1 ? "" : "s"}`;
};

const getSessionDelayLabel = (session) => {
  const delayValue = Number(session?.delayValue || 0);
  const delayUnit = String(session?.delayUnit || "").toLowerCase();

  if (delayValue > 0 && delayUnit) {
    if (delayUnit.startsWith("minute")) return formatDelayValue(delayValue, "minute");
    if (delayUnit.startsWith("hour")) return formatDelayValue(delayValue, "hour");
    if (delayUnit.startsWith("day")) return formatDelayValue(delayValue, "day");
  }

  const unlockMinutes = Number(session?.unlockAfterMinutes || 0);

  if (unlockMinutes > 0) {
    return formatDelayValue(unlockMinutes, "minute");
  }

  const unlockHours = Number(session?.unlockAfterHours || 0);

  if (unlockHours > 0) {
    if (unlockHours < 1) return formatDelayValue(unlockHours * 60, "minute");
    if (unlockHours % 24 === 0) return formatDelayValue(unlockHours / 24, "day");

    return formatDelayValue(unlockHours, "hour");
  }

  const offsetDays = Number(session?.offsetDays || 0);

  if (offsetDays > 0) {
    if (offsetDays < 1) return formatDelayValue(offsetDays * 24 * 60, "minute");

    return formatDelayValue(offsetDays, "day");
  }

  return "Available immediately";
};

export default function ParticipantsPage() {
  const [studies, setStudies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudyId, setSelectedStudyId] = useState(
    localStorage.getItem("selectedStudyId") || ""
  );

  const [participants, setParticipants] = useState([]);
  const [studiesLoading, setStudiesLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

  const studySessions = useMemo(
    () => getStudySessions(selectedStudy),
    [selectedStudy]
  );

  const totalAssessments = useMemo(
    () =>
      studySessions.reduce(
        (sum, session) => sum + getSessionAssessments(session).length,
        0
      ),
    [studySessions]
  );

  const filteredParticipants = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return participants;

    return participants.filter((participant) =>
      participant.email?.toLowerCase().includes(query)
    );
  }, [participants, searchTerm]);

  useEffect(() => {
    let ignore = false;

    async function fetchStudies() {
      try {
        setStudiesLoading(true);
        setError("");

        const data = await researcherApi.getStudies();
        const studyList = Array.isArray(data) ? data : data.studies || [];

        if (ignore) return;

        setStudies(studyList);

        const validStudyIds = studyList.map((study) => study._id);

        if (!selectedStudyId || !validStudyIds.includes(selectedStudyId)) {
          const firstStudyId = studyList[0]?._id || "";

          setSelectedStudyId(firstStudyId);

          if (firstStudyId) {
            localStorage.setItem("selectedStudyId", firstStudyId);
          } else {
            localStorage.removeItem("selectedStudyId");
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load studies."
          );
          setStudies([]);
          setSelectedStudyId("");
          setParticipants([]);
          localStorage.removeItem("selectedStudyId");
        }
      } finally {
        if (!ignore) {
          setStudiesLoading(false);
        }
      }
    }

    fetchStudies();

    return () => {
      ignore = true;
    };
    // We intentionally only run this on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedStudyId || !selectedStudy) {
      queueMicrotask(() => {
        setParticipants([]);
      });
      return;
    }

    let ignore = false;

    async function fetchParticipants() {
      try {
        localStorage.setItem("selectedStudyId", selectedStudyId);

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
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load participants."
          );
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
  }, [selectedStudyId, selectedStudy]);

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

  const handleStudyChange = (studyId) => {
    setSelectedStudyId(studyId);
    setParticipants([]);
    setSearchTerm("");

    if (studyId) {
      localStorage.setItem("selectedStudyId", studyId);
    } else {
      localStorage.removeItem("selectedStudyId");
    }
  };

  const isUnlimitedPlan = ["institutional", "custom"].includes(
    usage?.organization?.plan
  );

  const participantLimitReached =
    !isUnlimitedPlan &&
    usage &&
    usage.usage.participantsThisMonth >=
      usage.limits.maxParticipantsPerMonth;

  const handleInvite = async ({ email, studyId }) => {
    try {
      setInviteLoading(true);
      setError("");

      await researcherApi.inviteParticipant(studyId, email);

      const usageData = await researcherApi.getOrganizationUsage();
      setUsage(usageData);

      const data = await researcherApi.getParticipants(studyId);
      const participantList = Array.isArray(data)
        ? data
        : data.participants || [];

      setParticipants(participantList);
      setSearchTerm("");
    } catch (err) {
      const code = err?.response?.data?.code;
      const message = err?.response?.data?.message;

      if (code === "PARTICIPANT_LIMIT_REACHED") {
        setError(
          message || "You have reached your monthly participant limit."
        );
      } else {
        setError(
          message || err?.message || "Failed to invite participant."
        );
      }

      throw err;
    } finally {
      setInviteLoading(false);
    }
  };

  const handleExportParticipant = async (participant) => {
    if (!selectedStudyId || !participant?._id) return;

    await researcherApi.downloadParticipantExport(
      selectedStudyId,
      participant._id,
      `participant-${participant.participantCode || participant._id}.csv`
    );
  };

  return (
    <ResearcherLayout>
      <h1 style={styles.title}>Participants</h1>
      <p style={styles.subtitle}>
        Invite participants, monitor status, and export participant-level data.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <div style={styles.studyHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Selected Protocol</h2>
          </div>

          {selectedStudy && (
            <div style={styles.studyStats}>
              <span>{studySessions.length} sessions</span>
              <span>{totalAssessments} assessments</span>
            </div>
          )}
        </div>

        {!studiesLoading && studies.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No protocols yet</p>
            <p style={styles.emptySubtitle}>
              Create your first research protocol to begin recruiting participants and collecting assessment data remotely.
            </p>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => (window.location.href = "/researcher/studies/new")}
            >
              Create First Protocol
            </button>
          </div>
        ) : (
          <StudySelector
            studies={studies}
            selectedStudyId={selectedStudyId}
            onChange={handleStudyChange}
            loading={studiesLoading}
          />
        )}

        {selectedStudy && (
          <>
            <p style={styles.muted}>
              Managing participants for{" "}
              <span style={styles.highlight}>{selectedStudy.title}</span>
            </p>

            <div style={styles.protocolSummary}>
              {studySessions.map((session, index) => {
                const assessments = getSessionAssessments(session);

                return (
                  <div
                    key={`${session.order || index}-${index}`}
                    style={styles.sessionPill}
                  >
                    <div style={styles.sessionTopRow}>
                      <p style={styles.sessionName}>
                        {session.label || session.name || `Session ${index + 1}`}
                      </p>

                      <span style={styles.sessionBadge}>
                        {assessments.length} assessment
                        {assessments.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <p style={styles.sessionDelay}>
                      {getSessionDelayLabel(session)}
                    </p>

                    <p style={styles.assessmentList}>
                      {assessments.length
                        ? assessments.map(getAssessmentLabel).join(" · ")
                        : "No assessments configured"}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {usageLoading && (
        <p style={styles.muted}>Loading usage information...</p>
      )}

      <InviteParticipantModal
        studyId={selectedStudyId}
        loading={inviteLoading}
        disabled={!selectedStudy || participantLimitReached}
        disabledMessage={
          participantLimitReached
            ? "You have reached your monthly participant limit for this plan."
            : ""
        }
        onInvite={handleInvite}
      />

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Participant List</h2>
            <p style={styles.muted}>
              {filteredParticipants.length} participant
              {filteredParticipants.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search participant by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />

        {participantsLoading ? (
          <p style={styles.muted}>Loading participants...</p>
        ) : (
          <ParticipantsTable
            participants={filteredParticipants}
            onExport={handleExportParticipant}
          />
        )}
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

  studyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    margin: 0,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
  },

  eyebrow: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },

  studyStats: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 16,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },

  muted: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  highlight: {
    color: "#e2e8f0",
    fontWeight: 700,
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

  protocolSummary: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 12,
  },

  sessionPill: {
    padding: 16,
    borderRadius: 14,
    background: "rgba(15, 23, 42, 0.62)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },

  sessionTopRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },

  sessionName: {
    margin: 0,
    color: "#ffffff",
    fontSize: 13,
    fontWeight: 800,
  },

  sessionBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(56, 189, 248, 0.12)",
    color: "#67e8f9",
    fontSize: 11,
    fontWeight: 800,
  },

  sessionDelay: {
    margin: "8px 0 0",
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 700,
  },

  assessmentList: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.5,
  },

  emptyState: {
    padding: "36px 24px",
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    textAlign: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
  },

  emptySubtitle: {
    marginTop: 10,
    marginBottom: 20,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.7,
    maxWidth: 560,
    marginInline: "auto",
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
};