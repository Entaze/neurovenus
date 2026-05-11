import { useSearchParams, Link } from "react-router-dom";
import { Clock } from "lucide-react";

import AppShell from "../../components/AppShell";
import StatusCard from "../../components/StatusCard";
import PrimaryButton from "../../components/PrimaryButton";

export default function SessionWait() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AppShell>
      <StatusCard
        title="Next Session Not Yet Available"
        subtitle="Your next session has been scheduled but is currently locked."
      >
        <div className="mb-8 flex items-start gap-4 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3">
            <Clock size={32} className="text-amber-300" />
          </div>

          <div>
            <p className="text-lg font-medium text-white">
              Please return when the next session becomes available.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              The study protocol controls when each session unlocks.
            </p>
          </div>
        </div>

        <Link to={`/participant/start?token=${token}`}>
          <PrimaryButton>
            Return to Participant Portal
          </PrimaryButton>
        </Link>
      </StatusCard>
    </AppShell>
  );
}