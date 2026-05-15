// client/src/assessments/digitSpan/DigitSpanTask.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import api from "../../api/client";
import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";

import { generateDigitSpanTrials } from "./generateDigitSpanTrials";
import { scoreDigitSpan } from "./scoreDigitSpan";

const DEFAULT_CONFIG = {
  includePractice: true,
  practiceTrialsPerMode: 2,

  digitDisplayMs: 1000,
  interDigitIntervalMs: 500,
  interTrialIntervalMs: 1000,

  forwardSpanLengths: [3, 4, 5, 6, 7, 8],
  backwardSpanLengths: [2, 3, 4, 5, 6, 7],

  trialsPerSpan: 2,

  includeForward: true,
  includeBackward: true,
};

const CARD_CLASS = "min-h-[520px]";

export default function DigitSpanTask({ task, sessionRun }) {
  const displayTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const trialStartedAtRef = useRef(null);
  const taskStartedAtRef = useRef(null);
  const responsesRef = useRef([]);

  const [phase, setPhase] = useState("instructions");
  const [trialIndex, setTrialIndex] = useState(0);
  const [digitIndex, setDigitIndex] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [, setSubmitting] = useState(false);

  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...(task?.config || {}),
    }),
    [task?.config]
  );

  const trials = useMemo(
    () => generateDigitSpanTrials(config),
    [config]
  );

  const currentTrial = trials[trialIndex];
  const currentDigit =
    currentTrial?.sequence?.[digitIndex] ?? null;

  const sessionRunId = sessionRun?._id;
  const taskType = task?.type;
  const taskVersion = task?.version;

  useEffect(() => {
    return () => {
      clearTimeout(displayTimerRef.current);
      clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "presentation" || !currentTrial) return;

    if (digitIndex >= currentTrial.sequence.length) {
      displayTimerRef.current = setTimeout(() => {
        trialStartedAtRef.current = Date.now();
        setPhase("recall");
      }, 0);

      return () => clearTimeout(displayTimerRef.current);
    }

    displayTimerRef.current = setTimeout(() => {
      setDigitIndex((prev) => prev + 1);
    }, config.digitDisplayMs + config.interDigitIntervalMs);

    return () => clearTimeout(displayTimerRef.current);
  }, [
    phase,
    digitIndex,
    currentTrial,
    config.digitDisplayMs,
    config.interDigitIntervalMs,
  ]);

  const submitTask = useCallback(async () => {
    try {
      setSubmitting(true);
      setPhase("submitting");

      const summary = scoreDigitSpan(responsesRef.current);

      const trialsPayload = responsesRef.current.map((row) => ({
        trialNumber: row.trialNumber,
        trialPhase: row.trialPhase,
        mode: row.mode,
        spanLength: row.spanLength,
        stimulus: row.sequence.join("-"),
        expectedResponse: row.expectedResponse,
        actualResponse: row.actualResponse,
        correct: row.correct,
        responseTimeMs: row.responseTimeMs,
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
      console.error("Failed to submit Digit Span results:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit Digit Span results. Please try again."
      );

      setPhase("submitError");
    } finally {
      setSubmitting(false);
    }
  }, [sessionRunId, taskType, taskVersion]);

  const startTrial = () => {
    if (!taskStartedAtRef.current) {
      taskStartedAtRef.current = new Date().toISOString();
    }

    setDigitIndex(0);
    setResponseText("");
    setPhase("ready");

    transitionTimerRef.current = setTimeout(() => {
      setPhase("presentation");
    }, config.interTrialIntervalMs);
  };

  const handleSubmitResponse = () => {
    const normalizedResponse = responseText.replace(/\s+/g, "");
    const answeredAt = Date.now();
    const startedAt = trialStartedAtRef.current;

    const response = {
      studyId: sessionRun?.study?._id,
      sessionRunId: sessionRun?._id,
      participantId: sessionRun?.participant?._id,
      assessmentId: "digitSpan",

      trialNumber: currentTrial.trialNumber,
      trialPhase: currentTrial.trialPhase,
      mode: currentTrial.mode,
      spanLength: currentTrial.spanLength,
      sequence: currentTrial.sequence,

      expectedResponse: currentTrial.expectedResponse,
      actualResponse: normalizedResponse,
      correct:
        normalizedResponse === currentTrial.expectedResponse,

      responseTimeMs:
        startedAt && normalizedResponse
          ? answeredAt - startedAt
          : null,

      startedAt: startedAt
        ? new Date(startedAt).toISOString()
        : null,
      answeredAt: new Date(answeredAt).toISOString(),
    };

    responsesRef.current.push(response);

    const isLastTrial = trialIndex >= trials.length - 1;

    if (isLastTrial) {
      submitTask();
      return;
    }

    setTrialIndex((prev) => prev + 1);
    setPhase("instructions");
  };

  if (phase === "instructions") {
    const modeLabel =
      currentTrial.mode === "forward"
        ? "same order"
        : "reverse order";

    return (
      <StatusCard className={CARD_CLASS}>
        <div className="flex min-h-[420px] flex-col justify-center">
          <p className="leading-7 text-slate-300">
            You will see a sequence of digits presented one at a
            time.
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            After the sequence ends, type the digits in the{" "}
            <span className="font-semibold text-white">
              {modeLabel}
            </span>
            .
          </p>

          <p className="mt-4 leading-7 text-slate-300">
            Work as accurately as possible.
          </p>

          <div className="mt-8">
            <PrimaryButton onClick={startTrial}>
              Begin Digit Span
            </PrimaryButton>
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "ready") {
    return (
      <StatusCard
        title="Get Ready"
        subtitle="The digit sequence will begin shortly."
        className={CARD_CLASS}
      >
        <div className="flex h-[360px] items-center justify-center">
          <div className="text-4xl font-semibold text-white">
            +
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "presentation") {
    return (
      <StatusCard className={CARD_CLASS}>
        <div className="flex h-[420px] items-center justify-center">
          <div className="text-7xl font-bold text-white">
            {currentDigit}
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "recall") {
    return (
      <StatusCard
        title="Recall"
        subtitle="Type the digits in the correct order."
        className={CARD_CLASS}
      >
        <div className="flex min-h-[420px] flex-col justify-center">
          <input
            type="text"
            value={responseText}
            onChange={(e) =>
              setResponseText(
                e.target.value.replace(/[^0-9]/g, "")
              )
            }
            placeholder="Enter digits"
            autoFocus
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-3xl tracking-[0.3em] text-white outline-none focus:border-cyan-400"
          />

          <div className="mt-8">
            <PrimaryButton
              onClick={handleSubmitResponse}
              disabled={!responseText.trim()}
            >
              Submit Response
            </PrimaryButton>
          </div>
        </div>
      </StatusCard>
    );
  }

  if (phase === "submitting") {
    return (
      <StatusCard
        title="Submitting Results"
        subtitle="Please wait while your responses are saved."
        className={CARD_CLASS}
      >
        <div className="flex h-[360px] items-center justify-center text-slate-300">
          Saving Digit Span results...
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
            <PrimaryButton onClick={submitTask}>
              Try Again
            </PrimaryButton>
          </div>
        </div>
      </StatusCard>
    );
  }

  return null;
}