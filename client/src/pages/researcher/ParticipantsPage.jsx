// src/pages/researcher/ParticipantsPage.jsx

import { useEffect, useMemo, useState } from "react";

import ResearcherLayout from "../../components/researcher/ResearcherLayout";
import StudySelector from "../../components/researcher/StudySelector";
import InviteParticipantModal from "../../components/researcher/InviteParticipantModal";
import ParticipantsTable from "../../components/researcher/ParticipantsTable";
import { researcherApi } from "../../api/researcherApi";

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

  const selectedStudy = useMemo(() => {
    return studies.find((study) => study._id === selectedStudyId);
  }, [studies, selectedStudyId]);

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
          setStudiesLoading(false);
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
    if (!selectedStudyId) return;

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

      const data = await researcherApi.getParticipants(studyId);
      const participantList = Array.isArray(data)
        ? data
        : data.participants || [];

      setParticipants(participantList);
      setSearchTerm("");
    } catch (err) {
      setError(err?.message || "Failed to invite participant.");
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
      <h1 style={styles.title}>Participants</h1>
      <p style={styles.subtitle}>
        Invite participants, monitor status, and export participant-level data.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Selected Study</h2>

        <StudySelector
          studies={studies}
          selectedStudyId={selectedStudyId}
          onChange={setSelectedStudyId}
          loading={studiesLoading}
        />

        {selectedStudy && (
          <p style={styles.muted}>
            Managing participants for {selectedStudy.title}
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