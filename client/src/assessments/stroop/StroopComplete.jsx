// client/src/assessments/stroop/StroopComplete.jsx

import StatusCard from "../../components/StatusCard";
import PrimaryButton from "../../components/PrimaryButton";

export default function StroopComplete({
  summary,
  onContinue,
  onRestart,
}) {
  const accuracy =
    summary?.accuracy !== null &&
    summary?.accuracy !== undefined
      ? `${Math.round(summary.accuracy * 100)}%`
      : "N/A";

  const meanReactionTime =
    summary?.meanReactionTime !== null &&
    summary?.meanReactionTime !== undefined
      ? `${Math.round(summary.meanReactionTime)} ms`
      : "N/A";

  const stroopInterference =
    summary?.stroopInterferenceRt !== null &&
    summary?.stroopInterferenceRt !== undefined
      ? `${Math.round(summary.stroopInterferenceRt)} ms`
      : "N/A";

  return (
    <StatusCard
      title="Stroop Test Complete"
      subtitle="Thank you. Your responses have been recorded."
    >
      <div className="space-y-3 text-slate-300">
        <div className="flex items-center justify-between">
          <span>Total Trials</span>
          <span className="font-semibold text-white">
            {summary?.totalTrials ?? "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Correct Trials</span>
          <span className="font-semibold text-white">
            {summary?.correctTrials ?? "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Accuracy</span>
          <span className="font-semibold text-white">
            {accuracy}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Mean Reaction Time</span>
          <span className="font-semibold text-white">
            {meanReactionTime}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Stroop Interference</span>
          <span className="font-semibold text-white">
            {stroopInterference}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {onContinue && (
          <PrimaryButton onClick={onContinue}>
            Continue
          </PrimaryButton>
        )}

        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3 font-medium text-white transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            Restart Test
          </button>
        )}
      </div>
    </StatusCard>
  );
}