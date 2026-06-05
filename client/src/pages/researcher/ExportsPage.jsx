// src/pages/researcher/ExportsPage.jsx

import { useEffect, useMemo, useState } from "react";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import StudySelector from "../../components/researcher/StudySelector";
import ExportButton from "../../components/researcher/ExportButton";
import { researcherApi } from "../../api/researcherApi";

const assessmentNameMap = {
  psqi: "PSQI",
  avlt: "AVLT",
  avltDelayedRecall: "AVLT Delayed Recall",
  avltRecognition: "AVLT Recognition",
  nback: "N-Back",
  fingerTap: "Finger Tapping",
  finger_tapping: "Finger Tapping",
  stroop: "Stroop",
  digitSpan: "Digit Span",
  digit_span: "Digit Span",
};

const getStudySessions = (study) =>
  study?.protocol?.sessions?.length
    ? study.protocol.sessions
    : study?.sessions || [];

const getSessionAssessments = (session) =>
  session?.assessments?.length ? session.assessments : session?.tasks || [];

const getAssessmentKey = (assessment) =>
  assessment?.assessmentId || assessment?.type || assessment?.name || "";

const getAssessmentLabel = (assessmentOrKey) => {
  const key =
    typeof assessmentOrKey === "string"
      ? assessmentOrKey
      : getAssessmentKey(assessmentOrKey);

  return assessmentNameMap[key] || assessmentOrKey?.name || key || "Assessment";
};

function ExportsPageSkeleton() {
  return (
    <>
      <section style={styles.card}>
        <div style={{ ...styles.skeletonLine, width: 180, height: 22 }} />

        <div
          style={{
            ...styles.skeletonBlock,
            height: 46,
            marginTop: 22,
          }}
        />

        <div style={styles.studySummary}>
          <div style={{ ...styles.skeletonLine, width: 240, height: 18 }} />

          <div style={styles.metaRow}>
            <div style={{ ...styles.skeletonPill, width: 120, height: 28 }} />
            <div style={{ ...styles.skeletonPill, width: 140, height: 28 }} />
            <div style={{ ...styles.skeletonPill, width: 130, height: 28 }} />
          </div>

          <div
            style={{
              ...styles.skeletonLine,
              width: 180,
              height: 13,
              marginTop: 14,
            }}
          />

          <div
            style={{
              ...styles.skeletonLine,
              width: "80%",
              height: 13,
              marginTop: 14,
            }}
          />
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ ...styles.skeletonLine, width: 200, height: 22 }} />

        <div
          style={{
            ...styles.skeletonLine,
            width: "70%",
            height: 13,
            marginTop: 16,
          }}
        />

        <div
          style={{
            ...styles.skeletonBlock,
            height: 46,
            marginTop: 22,
          }}
        />
      </section>

      <section style={styles.card}>
        <div style={{ ...styles.skeletonLine, width: 260, height: 22 }} />

        <div
          style={{
            ...styles.skeletonLine,
            width: "80%",
            height: 13,
            marginTop: 16,
          }}
        />

        <div style={{ ...styles.buttonGrid, marginTop: 22 }}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                ...styles.skeletonBlock,
                width: 220,
                height: 44,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

const getCompletedSessionOrders = (participant) => {
  const sessionRuns = participant?.sessionRuns || participant?.sessions || [];

  return new Set(
    sessionRuns
      .filter((session) => session.status === "completed")
      .map((session) => session.sessionOrder || session.order)
  );
};

const isSessionCompleted = (participant, order) => {
  return getCompletedSessionOrders(participant).has(order);
};

const getCompletedAssessmentKeys = (participant) => {
  const assessmentRuns =
    participant?.assessmentRuns ||
    participant?.taskRuns ||
    [];

  return new Set(
    assessmentRuns
      .filter((assessment) => assessment.status === "completed")
      .map(
        (assessment) =>
          assessment.taskType ||
          assessment.assessmentId ||
          assessment.type
      )
  );
};

const isAssessmentCompleted = (participant, assessmentKey) => {
  return getCompletedAssessmentKeys(participant).has(assessmentKey);
};

export default function ExportsPage() {
  const [studies, setStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(
    localStorage.getItem("selectedStudyId") || ""
  );

  const [participants, setParticipants] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");

  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

  const sessions = useMemo(() => {
    return getStudySessions(selectedStudy);
  }, [selectedStudy]);

  const uniqueAssessments = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      getSessionAssessments(session).forEach((assessment) => {
        const key = getAssessmentKey(assessment);

        if (!key || map.has(key)) return;

        map.set(key, {
          key,
          label: getAssessmentLabel(assessment),
        });
      });
    });

    return Array.from(map.values());
  }, [sessions]);

  const selectedParticipant = useMemo(() => {
    return participants.find(
      (participant) => participant._id === selectedParticipantId
    );
  }, [participants, selectedParticipantId]);

  const completedSessionCount = useMemo(() => {
    return getCompletedSessionOrders(selectedParticipant).size;
  }, [selectedParticipant]);

  const totalSessionCount = sessions.length;

  const hasCompletedSessions = completedSessionCount > 0;

  const allSessionsCompleted =
    totalSessionCount > 0 && completedSessionCount === totalSessionCount;

  const pageLoading = loading || participantsLoading;

  useEffect(() => {
    let ignore = false;

    async function fetchStudies() {
      try {
        setLoading(true);
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
            setParticipants([]);
            setParticipantsLoading(false);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Failed to load studies.");
          setStudies([]);
          setSelectedStudyId("");
          setParticipants([]);
          setParticipantsLoading(false);
          localStorage.removeItem("selectedStudyId");
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

  const handleStudyChange = (studyId) => {
    setSelectedStudyId(studyId);
    setSelectedParticipantId("");
    setParticipants([]);
    setParticipantsLoading(Boolean(studyId));

    if (studyId) {
      localStorage.setItem("selectedStudyId", studyId);
    } else {
      localStorage.removeItem("selectedStudyId");
    }
  };

  useEffect(() => {
    if (!selectedStudyId) {
      queueMicrotask(() => {
        setParticipants([]);
        setParticipantsLoading(false);
      });
      return;
    }

    let ignore = false;

    async function fetchParticipants() {
      try {
        setParticipantsLoading(true);

        const data = await researcherApi.getParticipants(selectedStudyId);
        const participantList = Array.isArray(data)
          ? data
          : data.participants || [];

        if (!ignore) {
          setParticipants(participantList);
        }
      } catch {
        if (!ignore) {
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

  return (
    <ResearcherLayout>
      <h1 style={styles.title}>Exports</h1>

      <p style={styles.subtitle}>
        Export participant, session, and assessment data for statistical
        analysis.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {pageLoading ? (
        <ExportsPageSkeleton />
      ) : (
        <>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Select Protocol</h2>

            <StudySelector
              studies={studies}
              selectedStudyId={selectedStudyId}
              onChange={handleStudyChange}
              loading={false}
            />

            {selectedStudy ? (
              <div style={styles.studySummary}>
                <p style={styles.studyTitle}>{selectedStudy.title}</p>

                <div style={styles.metaRow}>
                  <span style={styles.metaPill}>
                    {sessions.length} session
                    {sessions.length === 1 ? "" : "s"}
                  </span>

                  <span style={styles.metaPill}>
                    {uniqueAssessments.length} assessment
                    {uniqueAssessments.length === 1 ? "" : "s"}
                  </span>

                  <span style={styles.metaPill}>
                    {participants.length} participant
                    {participants.length === 1 ? "" : "s"}
                  </span>
                </div>

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
                Select a protocol to export participant and assessment data.
              </p>
            )}
          </section>

          {selectedStudyId && (
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Select Participant</h2>

              <p style={styles.cardText}>
                Choose a participant to export their complete dataset, specific
                sessions, or individual assessments.
              </p>

              <select
                value={selectedParticipantId}
                onChange={(e) => {
                  setSelectedParticipantId(e.target.value);
                }}
                style={styles.select}
                disabled={!selectedStudyId}
              >
                <option value="">Select participant</option>

                {participants.map((participant) => (
                  <option key={participant._id} value={participant._id}>
                    {participant.participantCode || participant.email}
                    {participant.email ? ` · ${participant.email}` : ""}
                  </option>
                ))}
              </select>
            </section>
          )}

          {selectedParticipantId && (
            <>
              <section style={styles.card}>
                <h2 style={styles.sectionTitle}>Full Participant Dataset</h2>

                <p style={styles.cardText}>
                  {allSessionsCompleted
                    ? "Export the complete participant dataset containing all completed sessions, assessments, scoring outputs, and trial-level responses."
                    : hasCompletedSessions
                    ? `This participant has completed ${completedSessionCount} of ${totalSessionCount} sessions. Exporting now will generate a partial dataset based on completed data only.`
                    : "This participant has not completed any sessions yet. Full participant export will become available once at least one session is completed."}
                </p>

                <ExportButton
                  label={
                    allSessionsCompleted
                      ? "Export Full Participant CSV"
                      : hasCompletedSessions
                      ? `Export Partial CSV (${completedSessionCount}/${totalSessionCount} sessions)`
                      : "No Completed Data Yet"
                  }
                  disabled={!hasCompletedSessions}
                  onExport={() =>
                    researcherApi.downloadStudyExport(
                      selectedStudyId,
                      {
                        participantId: selectedParticipantId,
                      },
                      allSessionsCompleted
                        ? `participant-${selectedParticipantId}.csv`
                        : `participant-${selectedParticipantId}-partial.csv`
                    )
                  }
                />
              </section>

              <section style={styles.card}>
                <h2 style={styles.sectionTitle}>Session Datasets</h2>

                <p style={styles.cardText}>
                  Export a single session for the selected participant.
                </p>

                <div style={styles.buttonGrid}>
                  {sessions.map((session, index) => {
                    const order = session.order || index + 1;
                    const completed = isSessionCompleted(selectedParticipant, order);

                    return (
                      <ExportButton
                        key={order}
                        label={completed ? `Session ${order}` : `Session ${order} · Not completed`}
                        disabled={!completed}
                        onExport={() =>
                          researcherApi.downloadStudyExport(
                            selectedStudyId,
                            {
                              participantId: selectedParticipantId,
                              sessionOrder: order,
                            },
                            `participant-${selectedParticipantId}-session-${order}.csv`
                          )
                        }
                      />
                    );
                  })}
                </div>
              </section>

              <section style={styles.card}>
                <h2 style={styles.sectionTitle}>Assessment Exports</h2>

                <p style={styles.cardText}>
                  Export a single assessment for the selected participant.
                </p>

                <div style={styles.buttonGrid}>
                  {uniqueAssessments.map((assessment) => {
                    const completed = isAssessmentCompleted(
                      selectedParticipant,
                      assessment.key
                    );

                    return (
                      <ExportButton
                        key={assessment.key}
                        label={
                          completed
                            ? assessment.label
                            : `${assessment.label} · Not completed`
                        }
                        disabled={!completed}
                        onExport={() =>
                          researcherApi.downloadStudyExport(
                            selectedStudyId,
                            {
                              participantId: selectedParticipantId,
                              taskType: assessment.key,
                            },
                            `participant-${selectedParticipantId}-${assessment.key}.csv`
                          )
                        }
                      />
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </>
      )}
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

  exportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
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

  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  metaPill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.18)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 800,
  },

  studyMeta: {
    marginTop: 12,
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

  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
  },

  exportButtonWrap: {
    marginTop: 16,
  },

  muted: {
    margin: 0,
    color: "#94a3b8",
    fontSize: 14,
  },

  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
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

  skeletonLine: {
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
  },

  skeletonBlock: {
    borderRadius: 12,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  skeletonPill: {
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
  },
};