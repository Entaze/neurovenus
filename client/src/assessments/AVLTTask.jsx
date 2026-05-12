// client/src/assessments/AVLTTask.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import api from "../api/client";
import PrimaryButton from "../components/PrimaryButton";
import StatusCard from "../components/StatusCard";
import { TASK_TIMING } from "../config/taskTiming";
import { getProtocol } from "../config/protocols";

const WORD_DISPLAY_MS = TASK_TIMING.avlt.wordDisplayMs;
const READY_DELAY_MS = TASK_TIMING.avlt.readyDelayMs;

export default function AVLTTask({ task, sessionRun, taskIndex, totalTasks }) {
  const readyTimerRef = useRef(null);
  const allTrialsRef = useRef([]);

  const protocol = useMemo(() => {
    const protocolVersion =
      sessionRun?.protocolVersion ||
      task?.version ||
      sessionRun?.study?.protocolVersion ||
      "v2";

    return getProtocol(protocolVersion);
  }, [sessionRun, task?.version]);

  const listA = useMemo(
    () => protocol.avlt.listA.slice(0, TASK_TIMING.avlt.maxWords),
    [protocol]
  );

  const listB = useMemo(
    () => protocol.avlt.listB.slice(0, TASK_TIMING.avlt.maxWords),
    [protocol]
  );

  const trialSequence = useMemo(
    () => [
      { key: "A1", label: "List A - Trial 1", words: listA, listType: "A", presentation: true },
      { key: "A2", label: "List A - Trial 2", words: listA, listType: "A", presentation: true },
      { key: "A3", label: "List A - Trial 3", words: listA, listType: "A", presentation: true },
      { key: "A4", label: "List A - Trial 4", words: listA, listType: "A", presentation: true },
      { key: "A5", label: "List A - Trial 5", words: listA, listType: "A", presentation: true },
      { key: "B", label: "Interference List B", words: listB, listType: "B", presentation: true },
      {
        key: "A6",
        label: "Immediate Recall of Original List A",
        words: listA,
        listType: "A",
        presentation: false,
      },
    ],
    [listA, listB]
  );

  const [phase, setPhase] = useState("instructions");
  const [trialIndex, setTrialIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recallText, setRecallText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentTrial = trialSequence[trialIndex];

  useEffect(() => {
    return () => {
      if (readyTimerRef.current) {
        clearTimeout(readyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "presentation" || !currentTrial) return;

    if (currentWordIndex >= currentTrial.words.length) {
      const timer = setTimeout(() => {
        setPhase("recall");
      }, 0);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentWordIndex((prev) => prev + 1);
    }, WORD_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [phase, currentWordIndex, currentTrial]);

  const startTrial = () => {
    setCurrentWordIndex(0);
    setRecallText("");

    if (!currentTrial.presentation) {
      setPhase("recall");
      return;
    }

    setPhase("ready");

    readyTimerRef.current = setTimeout(() => {
      setPhase("presentation");
    }, READY_DELAY_MS);
  };

  const scoreRecall = (text, expectedWords) => {
    const responses = text
      .split(/[\n,]+/)
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean);

    const uniqueResponses = [...new Set(responses)];
    const correctWords = expectedWords.map((word) => word.toLowerCase());

    const totalCorrect = uniqueResponses.filter((word) =>
      correctWords.includes(word)
    ).length;

    return {
      totalCorrect,
      totalTrials: expectedWords.length,
      recalledWords: uniqueResponses,
      correctWords,
      rawRecallText: text,
    };
  };

  const handleRecallSubmit = async () => {
    const result = scoreRecall(recallText, currentTrial.words);

    allTrialsRef.current.push({
      trialKey: currentTrial.key,
      trialLabel: currentTrial.label,
      listType: currentTrial.listType,
      ...result,
    });

    if (trialIndex < trialSequence.length - 1) {
      setTrialIndex((prev) => prev + 1);
      setRecallText("");
      setCurrentWordIndex(0);
      setPhase("instructions");
      return;
    }

    await submitTask();
  };

  const submitTask = async () => {
    try {
      setSubmitting(true);

      const getScore = (key) =>
        allTrialsRef.current.find((t) => t.trialKey === key)?.totalCorrect ?? 0;

      const summary = {
        A1: getScore("A1"),
        A2: getScore("A2"),
        A3: getScore("A3"),
        A4: getScore("A4"),
        A5: getScore("A5"),
        B: getScore("B"),
        A6ImmediateRecall: getScore("A6"),
        totalLearning: ["A1", "A2", "A3", "A4", "A5"].reduce(
          (sum, key) => sum + getScore(key),
          0
        ),
      };

      const trials = [];

      allTrialsRef.current.forEach((trial) => {
        trial.recalledWords.forEach((word, index) => {
          trials.push({
            trialNumber: index + 1,
            trialPhase: trial.trialKey,
            trialLabel: trial.trialLabel,
            stimulus: null,
            expectedResponse: null,
            actualResponse: word,
            correct: trial.correctWords.includes(word),
            reactionTimeMs: null,
            rawRecallText: trial.rawRecallText,
          });
        });
      });

      await api.post("/tasks/complete", {
        sessionRunId: sessionRun._id,
        taskType: task.type,
        taskVersion: task.version,
        summary,
        trials,
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to submit AVLT results:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit AVLT results. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getInstructionText = () => {
    if (currentTrial.key === "A6") {
      return "Now, please enter all the words you remember from the original list you saw 5 times. The original list will not be shown again.";
    }

    if (currentTrial.key === "B") {
      return "You will now be shown a different list of words. Try and remember all the words from this new list.";
    }

    if (currentTrial.key === "A1") {
      if (protocol.version === "v1") {
        return "You will be shown a list of 15 words. This same list will be shown to you 5 times. Each time after you see the list you will be asked to type all the words you remember from the list.";
      }

      return "You will be shown a list of words. This same list will be shown to you 5 times. Each time after you see the list you will be asked to type all the words you remember from the list.";
    }

    return null;
  };

  if (phase === "instructions") {
    const instructionText = getInstructionText();

    return (
      <StatusCard
        title="Auditory-Verbal Learning Test"
        subtitle={`${currentTrial.label} • Task ${taskIndex + 1} of ${totalTasks}`}
      >
        {instructionText && (
          <p className="leading-7 text-slate-300">{instructionText}</p>
        )}

        {instructionText && currentTrial.presentation && (
          <p className="mt-4 leading-7 text-slate-300">
            After the words are presented, type all the words you can remember.
          </p>
        )}

        <div className={instructionText ? "mt-8" : "mt-2"}>
          <PrimaryButton onClick={startTrial}>
            {currentTrial.presentation
              ? `Begin ${currentTrial.label}`
              : "Begin Immediate Recall"}
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  if (phase === "ready") {
    return (
      <StatusCard title="Get Ready" subtitle="The word list will begin shortly.">
        <div className="py-16 text-center text-4xl font-semibold text-white">
          +
        </div>
      </StatusCard>
    );
  }

  if (phase === "presentation") {
    const word = currentTrial.words[currentWordIndex];

    return (
      <StatusCard>
        <div className="py-24 text-center text-5xl font-semibold text-white">
          {word}
        </div>
      </StatusCard>
    );
  }

  if (phase === "recall") {
    const isFinalTrial = trialIndex === trialSequence.length - 1;

    return (
      <StatusCard
        title={`Recall - ${currentTrial.label}`}
        subtitle="Type all the words you remember."
      >
        <textarea
          value={recallText}
          onChange={(e) => setRecallText(e.target.value)}
          rows={10}
          placeholder="Enter one word per line or separate with commas"
          className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none focus:border-cyan-400"
        />

        <div className="mt-8">
          <PrimaryButton
            onClick={handleRecallSubmit}
            disabled={submitting || !recallText.trim()}
          >
            {submitting
              ? "Submitting..."
              : isFinalTrial
                ? "Submit AVLT Task"
                : "Continue"}
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  return null;
}