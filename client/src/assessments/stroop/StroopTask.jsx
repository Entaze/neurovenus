// client/src/assessments/stroop/StroopTask.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import api from "../../api/client";
import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";

import { generateStroopTrials } from "./generateStroopTrials";
import { scoreStroop } from "./scoreStroop";

const DEFAULT_CONFIG = {
  includePractice: true,
  practiceTrials: 6,
  testTrials: 48,
  stimulusDurationMs: 3000,
  interTrialIntervalMs: 700,
  colors: ["red", "blue", "green", "yellow"],
  conditions: ["congruent", "incongruent", "neutral"],
};

const KEY_MAP = {
  r: "red",
  b: "blue",
  g: "green",
  y: "yellow",
};

const CARD_CLASS = "min-h-[520px]";

export default function StroopTask({ task, sessionRun }) {
  const stimulusTimerRef = useRef(null);
  const itiTimerRef = useRef(null);
  const trialStartedAtRef = useRef(null);
  const responsesRef = useRef([]);
  const respondedRef = useRef(false);
  const taskStartedAtRef = useRef(null);

  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...(task?.config || {}),
    }),
    [task?.config]
  );

  const trials = useMemo(() => generateStroopTrials(config), [config]);

  const [phase, setPhase] = useState("instructions");
  const [trialIndex, setTrialIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const currentTrial = trials[trialIndex];

  const sessionRunId = sessionRun?._id;
  const taskType = task?.type;
  const taskVersion = task?.version;

  const submitTask = useCallback(async () => {
    try {
      setSubmitting(true);
      setPhase("submitting");

      const summary = scoreStroop(responsesRef.current);

      const trialsPayload = responsesRef.current.map((row) => ({
        trialNumber: row.trialNumber,
        trialPhase: row.trialPhase,
        condition: row.condition,
        stimulus: row.stimulus,
        inkColor: row.inkColor,
        expectedResponse: row.expectedResponse,
        actualResponse: row.actualResponse,
        correct: row.correct,
        reactionTimeMs: row.reactionTimeMs,
        isPractice: row.isPractice,
        startedAt: row.startedAt,
        answeredAt: row.answeredAt,
      }));

      await api.post("/tasks/complete", {
        sessionRunId,
        taskType,
        taskVersion,
        startedAt: taskStartedAtRef.current,
        summary,
        trials: trialsPayload,
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to submit Stroop results:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit Stroop results. Please try again."
      );

      setPhase("submitError");
    } finally {
      setSubmitting(false);
    }
  }, [sessionRunId, taskType, taskVersion]);

  const recordResponse = useCallback(
    (selectedResponse) => {
      if (respondedRef.current || !currentTrial || submitting) return;

      respondedRef.current = true;
      clearTimeout(stimulusTimerRef.current);

      const answeredAt = Date.now();
      const startedAt = trialStartedAtRef.current;

      const response = {
        studyId: sessionRun?.study?._id,
        sessionRunId: sessionRun?._id,
        participantId: sessionRun?.participant?._id,
        assessmentId: "stroop",

        trialNumber: currentTrial.trialIndex + 1,
        trialIndex: currentTrial.trialIndex,
        trialPhase: currentTrial.isPractice ? "practice" : "test",

        condition: currentTrial.condition,
        stimulus: currentTrial.word,
        word: currentTrial.word,
        inkColor: currentTrial.inkColor,

        expectedResponse: currentTrial.correctResponse,
        correctResponse: currentTrial.correctResponse,

        actualResponse: selectedResponse,
        selectedResponse,

        correct: selectedResponse === currentTrial.correctResponse,

        reactionTimeMs:
          selectedResponse !== null && startedAt
            ? answeredAt - startedAt
            : null,

        isPractice: currentTrial.isPractice,

        startedAt: startedAt ? new Date(startedAt).toISOString() : null,
        answeredAt: new Date(answeredAt).toISOString(),
      };

      responsesRef.current.push(response);

      const isLastTrial = trialIndex >= trials.length - 1;

      if (isLastTrial) {
        setPhase("submitting");
        submitTask();
        return;
      }

      setPhase("iti");

      itiTimerRef.current = setTimeout(() => {
        setTrialIndex((prev) => prev + 1);
        setPhase("stimulus");
      }, config.interTrialIntervalMs);
    },
    [
      currentTrial,
      trialIndex,
      trials.length,
      sessionRun,
      config.interTrialIntervalMs,
      submitTask,
      submitting,
    ]
  );

  useEffect(() => {
    return () => {
      clearTimeout(stimulusTimerRef.current);
      clearTimeout(itiTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "stimulus" || !currentTrial) return;

    respondedRef.current = false;
    trialStartedAtRef.current = Date.now();

    stimulusTimerRef.current = setTimeout(() => {
      recordResponse(null);
    }, config.stimulusDurationMs);

    const handleKeyDown = (event) => {
      const selectedResponse = KEY_MAP[event.key.toLowerCase()];

      if (!selectedResponse) return;
      if (!config.colors.includes(selectedResponse)) return;

      recordResponse(selectedResponse);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(stimulusTimerRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    phase,
    currentTrial,
    config.stimulusDurationMs,
    config.colors,
    recordResponse,
  ]);

  const startTask = () => {
    taskStartedAtRef.current = new Date().toISOString();

    responsesRef.current = [];
    setTrialIndex(0);
    setPhase("ready");

    itiTimerRef.current = setTimeout(() => {
      setPhase("stimulus");
    }, config.interTrialIntervalMs);
  };

  if (phase === "instructions") {
    return (
      <StatusCard className={CARD_CLASS}>
        <div className="flex min-h-[420px] flex-col justify-center">
          <p className="leading-7 text-slate-300">
            In this task, colour words will appear on the screen.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            Your job is to respond to the colour of the ink, not the meaning of
            the word.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            For example, if the word “RED” appears in blue ink, the correct
            answer is blue.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            Respond as quickly and accurately as possible.
          </p>

          <div className="mt-8">
            <PrimaryButton onClick={startTask}>Begin Stroop Test</PrimaryButton>
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "ready") {
    return (
      <StatusCard
        title="Get Ready"
        subtitle="The task will begin shortly."
        className={CARD_CLASS}
      >
        <div className="flex h-[360px] items-center justify-center">
          <div className="text-4xl font-semibold text-white">+</div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "iti") {
    return (
      <StatusCard className={CARD_CLASS}>
        <div className="flex h-[420px] items-center justify-center">
          <div className="text-4xl font-semibold text-white">+</div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "submitting") {
    return (
      <StatusCard
        title="Submitting Results"
        subtitle="Please wait while your responses are being saved."
        className={CARD_CLASS}
      >
        <div className="flex h-[360px] items-center justify-center text-slate-300">
          Saving Stroop results...
        </div>
      </StatusCard>
    );
  }

  if (phase === "submitError") {
    return (
      <StatusCard
        title="Submission Failed"
        subtitle="Your responses could not be saved."
        className={CARD_CLASS}
      >
        <div className="flex min-h-[360px] flex-col justify-center">
          <p className="leading-7 text-slate-300">
            Please check your connection and try again.
          </p>

          <div className="mt-8">
            <PrimaryButton onClick={submitTask}>Try Again</PrimaryButton>
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "stimulus") {
    return (
      <StatusCard className={CARD_CLASS}>
        <div className="flex min-h-[420px] flex-col justify-center">
          <div
            className="mb-20 text-center text-6xl font-bold tracking-wide md:text-7xl"
            style={{ color: currentTrial.colorHex }}
          >
            {currentTrial.word}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {config.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => recordResponse(color)}
                disabled={submitting}
                className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-lg font-semibold capitalize text-white transition hover:border-cyan-400 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {color}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Keyboard shortcuts: R = Red, B = Blue, G = Green, Y = Yellow
          </p>
        </div>
      </StatusCard>
    );
  }

  return null;
}