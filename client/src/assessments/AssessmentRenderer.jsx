import AVLTTask from "./AVLTTask";
import AVLTDelayedRecallTask from "./AVLTDelayedRecallTask";
import AVLTRecognitionTask from "./AVLTRecognitionTask";
import FingerTapTask from "./FingerTapTask";
import NBackTask from "./NBackTask";

import StatusCard from "../components/StatusCard";
import PrimaryButton from "../components/PrimaryButton";

export default function AssessmentRenderer({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  if (task.type === "avlt") {
    return (
      <AVLTTask
        task={task}
        sessionRun={sessionRun}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
      />
    );
  }

  if (task.type === "avltDelayedRecall") {
    return (
      <AVLTDelayedRecallTask
        task={task}
        sessionRun={sessionRun}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
      />
    );
  }

  if (task.type === "avltRecognition") {
    return (
      <AVLTRecognitionTask
        task={task}
        sessionRun={sessionRun}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
      />
    );
  }

  if (task.type === "fingerTap") {
    return (
      <FingerTapTask
        task={task}
        sessionRun={sessionRun}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
      />
    );
  }

  if (task.type === "nback") {
    return (
      <NBackTask
        task={task}
        sessionRun={sessionRun}
        taskIndex={taskIndex}
        totalTasks={totalTasks}
      />
    );
  }

  const taskLabel = {
    avlt: "Auditory-Verbal Learning Test",
    avltDelayedRecall: "Delayed Recall",
    avltRecognition: "Recognition Memory Test",
    fingerTap: "Finger Tapping Task",
    nback: "N-Back Task",
  }[task.type] || task.type;

  return (
    <StatusCard
      title={taskLabel}
      subtitle={`Task ${taskIndex + 1} of ${totalTasks} · ${sessionRun.sessionName}`}
    >
      <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">
          Protocol Module
        </p>

        <p className="mt-3 text-lg text-white">
          {task.type} · {task.version}
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          This task has not yet been implemented. The protocol engine has loaded
          the correct module successfully.
        </p>
      </div>

      <div className="mt-8">
        <PrimaryButton disabled>Coming Soon</PrimaryButton>
      </div>
    </StatusCard>
  );
}