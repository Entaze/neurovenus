// client/src/assessments/stroop/StroopTrial.jsx

import StatusCard from "../../components/StatusCard";

export default function StroopTrial({
  trial,
  trialIndex,
  totalTrials,
  colors = ["red", "blue", "green", "yellow"],
  onResponse,
}) {
  if (!trial) return null;

  return (
    <StatusCard
      title={trial.isPractice ? "Practice Trial" : "Stroop Test"}
      subtitle={`Trial ${trialIndex + 1} of ${totalTrials}`}
    >
      <div
        className="py-20 text-center text-6xl font-bold tracking-wide"
        style={{ color: trial.colorHex }}
      >
        {trial.word}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onResponse(color)}
            className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-lg font-semibold capitalize text-white transition hover:border-cyan-400 hover:bg-cyan-400/10"
          >
            {color}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Keyboard shortcuts: R = Red, B = Blue, G = Green, Y = Yellow
      </p>
    </StatusCard>
  );
}