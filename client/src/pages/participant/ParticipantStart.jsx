import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

import api from "../../api/client";
import AppShell from "../../components/AppShell";
import LoadingScreen from "../../components/LoadingScreen";
import StatusCard from "../../components/StatusCard";
import PrimaryButton from "../../components/PrimaryButton";

const cleanStudyTitle = (title = "") =>
  title
    .replace(/\s*-\s*Combined V1 V2\s*$/i, "")
    .replace(/\s*-\s*Version\s*\d+\s*$/i, "")
    .trim();

const getSessionNumber = (sessionRun) => sessionRun?.sessionOrder || 1;

export default function ParticipantStart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    const validateAccess = async () => {
      try {
        if (!token) {
          setState({
            loading: false,
            error: "Missing participant access token.",
            data: null,
          });
          return;
        }

        const response = await api.get(`/participants/access?token=${token}`);

        setState({
          loading: false,
          error: "",
          data: response.data,
        });
      } catch (error) {
        setState({
          loading: false,
          error:
            error.response?.data?.message ||
            "Unable to validate participant access.",
          data: null,
        });
      }
    };

    validateAccess();
  }, [token]);

  const participantView = useMemo(() => {
    if (!state.data) return null;

    const { participant, study, nextAction } = state.data;
    const currentSession = nextAction?.sessionRun;
    const sessionNumber = getSessionNumber(currentSession);
    const totalSessions = study?.sessions?.length || 4;

    const studyTitle = cleanStudyTitle(study?.title);

    if (nextAction.type === "start_session") {
      return {
        icon: <ShieldCheck className="text-cyan-300" size={34} />,
        title: studyTitle,
        subtitle: `Participant ID: ${participant.participantCode}`,
        heading: `Session ${sessionNumber} of ${totalSessions} is now available.`,
        body:
          "This session includes memory, motor, and attention tasks. Please complete it in a quiet environment with minimal interruptions.",
        note:
          "Your progress is securely linked to your participant ID and saved as you move through the session.",
        button: `Begin Session ${sessionNumber}`,
      };
    }

    if (nextAction.type === "wait_for_session") {
      return {
        icon: <Clock className="text-amber-300" size={34} />,
        title: studyTitle,
        subtitle: `Participant ID: ${participant.participantCode}`,
        heading: `Your next session is not available yet.`,
        body:
          "Please return when your next session opens. You will receive an email reminder when it is time to continue.",
        note:
          "Completing sessions at the correct time is important for the study results.",
        button: "View Session Timing",
      };
    }

    return {
      icon: <CheckCircle2 className="text-emerald-300" size={34} />,
      title: studyTitle,
      subtitle: `Participant ID: ${participant.participantCode}`,
      heading: "All study sessions are complete.",
      body:
        "Thank you for completing all required sessions for this study.",
      note:
        "Your responses have been securely recorded for the research team.",
      button: "View Completion",
    };
  }, [state.data]);

  if (state.loading) {
    return <LoadingScreen message="Validating secure participant link..." />;
  }

  if (state.error) {
    return (
      <AppShell>
        <StatusCard
          title="Access could not be verified"
          subtitle={state.error}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-200">
            <AlertTriangle size={22} />
            <span>Please contact the research team for a new link.</span>
          </div>
        </StatusCard>
      </AppShell>
    );
  }

  const { nextAction } = state.data;

  const handleContinue = async () => {
    if (nextAction.type === "start_session") {
      await api.post(`/sessions/${nextAction.sessionRun._id}/start`);

      navigate(
        `/participant/session?token=${token}&sessionRunId=${nextAction.sessionRun._id}`
      );
    }

    if (nextAction.type === "wait_for_session") {
      navigate(
        `/participant/wait?token=${token}&sessionRunId=${nextAction.sessionRun._id}`
      );
    }

    if (nextAction.type === "completed") {
      navigate(`/participant/complete?token=${token}`);
    }
  };

  return (
    <AppShell>
      <StatusCard
        title={participantView.title}
        subtitle={participantView.subtitle}
      >
        <div className="mb-8 flex items-start gap-4 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            {participantView.icon}
          </div>

          <div>
            <p className="text-lg font-medium text-white">
              {participantView.heading}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {participantView.body}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {participantView.note}
            </p>
          </div>
        </div>

        <PrimaryButton onClick={handleContinue}>
          {participantView.button}
        </PrimaryButton>
      </StatusCard>
    </AppShell>
  );
}