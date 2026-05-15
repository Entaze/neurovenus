// client/src/assessments/AVLTDelayedRecallTask.jsx

import { useMemo, useRef, useState } from "react";
import api from "../../api/client";
import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";
import { getProtocol } from "../../config/protocols";

export default function AVLTDelayedRecallTask({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  const [recallText, setRecallText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const startedAtRef = useRef(new Date().toISOString());

  // Resolve the correct protocol version for this study.
  // Falls back to v2 if not provided.
  const protocol = useMemo(() => {
    const protocolVersion =
      sessionRun?.protocolVersion ||
      task?.version ||
      sessionRun?.study?.protocolVersion ||
      "v2";

    return getProtocol(protocolVersion);
  }, [sessionRun, task?.version]);

  // Original List A words from the protocol configuration
  const originalWordList = protocol.avlt.listA;

  const scoreRecall = () => {
    const responses = recallText
      .split(/[\n,]+/)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    const uniqueResponses = [...new Set(responses)];

    const correctWords = originalWordList.map((word) =>
      word.toLowerCase()
    );

    const totalCorrect = uniqueResponses.filter((word) =>
      correctWords.includes(word)
    ).length;

    return {
      totalCorrect,
      totalTrials: originalWordList.length,
      recalledWords: uniqueResponses,
      correctWords,
    };
  };

  const submitTask = async () => {
    try {
      setSubmitting(true);

      const result = scoreRecall();

      const payload = {
        sessionRunId: sessionRun._id,
        taskType: task.type,
        taskVersion: task.version,
        startedAt: startedAtRef.current,
        summary: {
          totalCorrect: result.totalCorrect,
          totalTrials: result.totalTrials,
        },
        trials: result.recalledWords.map((word, index) => ({
          trialNumber: index + 1,
          stimulus: null,
          expectedResponse: null,
          actualResponse: word,
          correct: result.correctWords.includes(word),
          reactionTimeMs: null,
        })),
      };

      await api.post("/tasks/complete", payload);

      // Refresh to load next task/session state
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit delayed recall:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit results. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StatusCard
      title="Delayed Recall"
      subtitle={`Task ${taskIndex + 1} of ${totalTasks}`}
    >
      <p className="leading-7 text-slate-300">
        Yesterday you were shown a list of words five times.
        Please type all the words you remember from that original list.
      </p>

      <textarea
        value={recallText}
        onChange={(e) => setRecallText(e.target.value)}
        rows={10}
        placeholder="Enter one word per line or separate with commas"
        className="mt-6 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none focus:border-cyan-400"
      />

      <div className="mt-8">
        <PrimaryButton
          onClick={submitTask}
          disabled={submitting || !recallText.trim()}
        >
          {submitting ? "Submitting..." : "Submit Recall"}
        </PrimaryButton>
      </div>
    </StatusCard>
  );
}