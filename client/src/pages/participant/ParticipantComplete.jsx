import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import AppShell from "../../components/AppShell";
import StatusCard from "../../components/StatusCard";
import PrimaryButton from "../../components/PrimaryButton";

export default function ParticipantComplete() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AppShell>
      <StatusCard
        title="Study Completed"
        subtitle="Thank you for completing all required sessions."
      >
        <div className="mb-8 flex items-start gap-4 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
            <CheckCircle2 size={32} className="text-emerald-300" />
          </div>

          <div>
            <p className="text-lg font-medium text-white">
              All study sessions are complete.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Your responses have been securely recorded for the research team.
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