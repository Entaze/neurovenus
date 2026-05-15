// client/src/assessments/stroop/StroopInstructions.jsx

import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";

export default function StroopInstructions({
  taskIndex = 0,
  totalTasks = 1,
  onStart,
}) {
  return (
    <StatusCard
      title="Stroop Test"
      subtitle={`Task ${taskIndex + 1} of ${totalTasks}`}
    >
      <p className="leading-7 text-slate-300">
        In this task, colour words will appear on the screen.
      </p>

      <p className="mt-4 leading-7 text-slate-300">
        Your job is to respond to the colour of the ink, not the meaning of the
        word.
      </p>

      <p className="mt-4 leading-7 text-slate-300">
        For example, if the word “RED” appears in blue ink, the correct answer
        is blue.
      </p>

      <p className="mt-4 leading-7 text-slate-300">
        Respond as quickly and accurately as possible.
      </p>

      <div className="mt-8">
        <PrimaryButton onClick={onStart}>Begin Stroop Test</PrimaryButton>
      </div>
    </StatusCard>
  );
}