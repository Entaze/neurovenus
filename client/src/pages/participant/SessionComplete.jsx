import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import api from "../../api/client";
import AppShell from "../../components/AppShell";
import LoadingScreen from "../../components/LoadingScreen";
import StatusCard from "../../components/StatusCard";
import PrimaryButton from "../../components/PrimaryButton";

export default function SessionComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkCompletionState = async () => {
      try {
        if (!token) {
          if (!cancelled) setChecking(false);
          return;
        }

        const response = await api.get(`/participants/access?token=${token}`, {
          timeout: 8000,
        });

        if (cancelled) return;

        if (response.data?.nextAction?.type === "completed") {
          navigate(`/participant/complete?token=${token}`, { replace: true });
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Failed to check completion state:", error);
        if (!cancelled) setChecking(false);
      }
    };

    checkCompletionState();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (checking) {
    return <LoadingScreen message="Saving session progress..." />;
  }

  return (
    <AppShell>
      <StatusCard
        title="Session Completed"
        subtitle="Thank you for completing this session."
      >
        <div className="mb-8 flex items-start gap-4 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
            <CheckCircle2 size={32} className="text-emerald-300" />
          </div>

          <div>
            <p className="text-lg font-medium text-white">
              Your responses have been securely recorded.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Your next session will appear in the participant portal when it is
              available.
            </p>
          </div>
        </div>

        <Link to={`/participant/start?token=${token}`}>
          <PrimaryButton>Return to Participant Portal</PrimaryButton>
        </Link>
      </StatusCard>
    </AppShell>
  );
}