import StatusCard from "../components/StatusCard";
import PrimaryButton from "../components/PrimaryButton";
import { getAssessmentDefinition } from "./registry";

export default function AssessmentRenderer({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  const assessment = getAssessmentDefinition(task?.type);

  if (!assessment) {
    const assessmentLabel = task?.type || "Unknown assessment";

    return (
      <StatusCard
        title={assessmentLabel}
        subtitle={`Assessment ${taskIndex + 1} of ${totalTasks} · ${
          sessionRun?.sessionName || "Session"
        }`}
      >
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">
            Protocol Module
          </p>

          <p className="mt-3 text-lg text-white">
            {task?.type || "unknown"}
            {task?.version ? ` · ${task.version}` : ""}
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            This assessment has not yet been implemented. The protocol engine
            has loaded the correct module successfully, but no runner is
            currently registered for this assessment type.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton disabled>Coming Soon</PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  const AssessmentComponent = assessment.component;

  return (
    <AssessmentComponent
      task={task}
      sessionRun={sessionRun}
      taskIndex={taskIndex}
      totalTasks={totalTasks}
    />
  );
}