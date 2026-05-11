// client/src/tasks/AVLTRecognitionTask.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import api from "../api/client";
import PrimaryButton from "../components/PrimaryButton";
import StatusCard from "../components/StatusCard";
import { getProtocol } from "../config/protocols";

const normalise = (word) => word.trim().toLowerCase();

export default function AVLTRecognitionTask({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  const [phase, setPhase] = useState("instructions");
  const [wordIndex, setWordIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const startedAtRef = useRef(null);

  // Resolve protocol version dynamically
  const protocol = useMemo(() => {
    const protocolVersion =
      sessionRun?.protocolVersion ||
      task?.version ||
      sessionRun?.study?.protocolVersion ||
      "v2";

    return getProtocol(protocolVersion);
  }, [sessionRun, task?.version]);

  // Pull Version 2 word lists from the protocol config
  const originalWords = protocol.avlt.listA;
  const recognitionWords = protocol.avlt.recognitionWords;

  const currentWord = recognitionWords[wordIndex];

  const isOriginalWord = useCallback(
    (word) => {
      const originalSet = new Set(
        originalWords.map((w) => normalise(w))
      );

      return originalSet.has(normalise(word));
    },
    [originalWords]
  );

  const submitTask = useCallback(
    async (finalResponses) => {
      try {
        setSubmitting(true);
        setPhase("submitting");

        const totalCorrect = finalResponses.filter(
          (r) => r.correct
        ).length;

        const hits = finalResponses.filter(
          (r) =>
            r.expectedResponse === "y" &&
            r.actualResponse === "y"
        ).length;

        const falseAlarms = finalResponses.filter(
          (r) =>
            r.expectedResponse === "n" &&
            r.actualResponse === "y"
        ).length;

        const misses = finalResponses.filter(
          (r) =>
            r.expectedResponse === "y" &&
            r.actualResponse === "n"
        ).length;

        const correctRejections = finalResponses.filter(
          (r) =>
            r.expectedResponse === "n" &&
            r.actualResponse === "n"
        ).length;

        await api.post("/tasks/complete", {
          sessionRunId: sessionRun._id,
          taskType: task.type,
          taskVersion: task.version,
          summary: {
            totalCorrect,
            totalTrials: finalResponses.length,
            accuracy:
              finalResponses.length > 0
                ? totalCorrect / finalResponses.length
                : 0,
            hits,
            falseAlarms,
            misses,
            correctRejections,
          },
          trials: finalResponses.map((response, index) => ({
            trialNumber: index + 1,
            stimulus: response.word,
            expectedResponse: response.expectedResponse,
            actualResponse: response.actualResponse,
            correct: response.correct,
            reactionTimeMs: response.reactionTimeMs,
          })),
        });

        window.location.reload();
      } catch (error) {
        console.error(
          "Failed to submit recognition results:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to submit recognition results."
        );

        setPhase("instructions");
      } finally {
        setSubmitting(false);
      }
    },
    [sessionRun._id, task.type, task.version]
  );

  const recordResponse = useCallback(
    (key) => {
      if (phase !== "recognition") return;
      if (!["y", "n"].includes(key)) return;

      const expectedResponse = isOriginalWord(currentWord)
        ? "y"
        : "n";

      const actualResponse = key;

      const reactionTimeMs = startedAtRef.current
        ? Date.now() - startedAtRef.current
        : null;

      const response = {
        word: currentWord,
        expectedResponse,
        actualResponse,
        correct: expectedResponse === actualResponse,
        reactionTimeMs,
      };

      const nextResponses = [...responses, response];
      setResponses(nextResponses);

      if (wordIndex + 1 >= recognitionWords.length) {
        submitTask(nextResponses);
        return;
      }

      setWordIndex((prev) => prev + 1);
      startedAtRef.current = Date.now();
    },
    [
      phase,
      currentWord,
      responses,
      wordIndex,
      recognitionWords.length,
      isOriginalWord,
      submitTask,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (phase === "recognition") {
        recordResponse(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, recordResponse]);

  const beginRecognition = () => {
    setPhase("recognition");
    startedAtRef.current = Date.now();
  };

  if (phase === "instructions") {
    return (
      <StatusCard
        title="Recognition Memory Test"
        subtitle={`Task ${taskIndex + 1} of ${totalTasks} · ${sessionRun.sessionName}`}
      >
        <div className="space-y-5 leading-7 text-slate-300">
          <p>You will now be shown words one at a time.</p>

          <p>
            Press{" "}
            <span className="font-semibold text-white">
              Y
            </span>{" "}
            if the word was on the original list.
          </p>

          <p>
            Press{" "}
            <span className="font-semibold text-white">
              N
            </span>{" "}
            if the word was not on the original list.
          </p>

          <p className="text-sm text-slate-400">
            Click the button when you are ready to begin.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton onClick={beginRecognition}>
            Begin Recognition Test
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  if (phase === "recognition") {
    return (
      <StatusCard>
        <div className="py-24 text-center text-7xl font-bold text-white">
          {currentWord}
        </div>
      </StatusCard>
    );
  }

  if (phase === "submitting") {
    return (
      <StatusCard
        title="Submitting Results"
        subtitle={
          submitting
            ? "Please wait while your responses are saved."
            : "Please wait..."
        }
      />
    );
  }

  return null;
}