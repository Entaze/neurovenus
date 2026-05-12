import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../../api/client";
import AppShell from "../../components/AppShell";
import LoadingScreen from "../../components/LoadingScreen";
import StatusCard from "../../components/StatusCard";
import AssessmentRenderer from "../../assessments/AssessmentRenderer";

export default function ParticipantSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const sessionRunId = searchParams.get("sessionRunId");

  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    const loadCurrentTask = async () => {
      try {
        if (!sessionRunId) {
          setState({
            loading: false,
            error: "Missing session ID.",
            data: null,
          });
          return;
        }

        const response = await api.get(`/sessions/${sessionRunId}/current-task`);

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
            "Unable to load the current task.",
          data: null,
        });
      }
    };

    loadCurrentTask();
  }, [sessionRunId]);

  useEffect(() => {
    if (state.data?.completed) {
      navigate(`/participant/complete?token=${token}`);
    }
  }, [state.data, navigate, token]);

  if (state.loading) {
    return <LoadingScreen message="Loading current task..." />;
  }

  if (state.error) {
    return (
      <AppShell>
        <StatusCard title="Session could not be loaded" subtitle={state.error} />
      </AppShell>
    );
  }

  if (state.data?.completed) {
    return null;
  }

  return (
    <AppShell>
      <AssessmentRenderer
        task={state.data.task}
        sessionRun={state.data.sessionRun}
        taskIndex={state.data.taskIndex}
        totalTasks={state.data.totalTasks}
      />
    </AppShell>
  );
}