// client/src/assessments/NBackTask.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../api/client";
import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";
import { TASK_TIMING } from "../../config/taskTiming";
import { getProtocol } from "../../config/protocols";

const FIXATION_MS = TASK_TIMING.nBack.fixationMs;
const LETTER_MS = TASK_TIMING.nBack.letterMs;

const buildInstructions = (n, mode) => {
  if (n === 0) {
    return mode === "practice"
      ? "In this condition the letter 'Z' is the target and all other letters are non-targets. So if you see a Z on the screen you should press 1 (target), and if you see any other letter you should press 2 (non-target). Lets go through an example to see how it works."
      : "In this condition the letter 'Z' is the target and all other letters are non-targets. So if you see a Z on the screen you should press 1 (target), and if you see any other letter you should press 2 (non-target).";
  }

  if (n === 1) {
    return mode === "practice"
      ? "In this next condition a letter is a target if it is the same as the letter that came one before it. Lets go through an example to see how it works."
      : "In this next condition a letter is a target if it is the same as the letter that came one before it. Remember to press 1 if the letter is a target and 2 if the letter is not a target.";
  }

  return mode === "practice"
    ? "In this last condition a letter is a target if it is the same as the letter that came two before it. Lets go through an example to see how it works."
    : "In this last condition a letter is a target if it is the same as the letter that came two before it. Remember to press 1 if the letter is a target and 2 if the letter is not a target.";
};

const formatConditionName = (name) =>
  name
    .replace("0-back practice", "0-Back Practice")
    .replace("1-back practice", "1-Back Practice")
    .replace("2-back practice", "2-Back Practice")
    .replace("0-back", "0-Back")
    .replace("1-back", "1-Back")
    .replace("2-back", "2-Back");

const applyDevLimit = (sequence) => {
  const maxTrials = TASK_TIMING.nBack.maxTrialsPerCondition;
  return maxTrials === null ? sequence : sequence.slice(0, maxTrials);
};

const isTarget = (sequence, index, n) => {
  if (n === 0) return sequence[index] === "Z";
  if (index < n) return false;
  return sequence[index] === sequence[index - n];
};

export default function NBackTask({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const timeoutRef = useRef(null);
  const respondedRef = useRef(false);
  const stimulusStartedAtRef = useRef(null);
  const responsesRef = useRef([]);
  const taskStartedAtRef = useRef(null);

  const [phase, setPhase] = useState("intro");
  const [conditionIndex, setConditionIndex] = useState(0);
  const [trialIndex, setTrialIndex] = useState(0);
  const [, setResponses] = useState([]);
  const [, setSubmitting] = useState(false);

  const sessionName = sessionRun?.sessionName || "";

  const includePractice =
    sessionName.includes("Session A") ||
    sessionName.includes("Session C") ||
    sessionName === "Session 1";

  const sessionOrder = Number(sessionRun?.sessionOrder || 1);

  const isSessionTwo =
    sessionOrder > 1 ||
    sessionName.includes("Session B") ||
    sessionName.includes("Session D") ||
    sessionName.includes("Session 2") ||
    sessionName.includes("Session 4");

  console.log("N-Back Session Detection:", {
    sessionName,
    sessionOrder,
    isSessionTwo,
  });

  const protocol = useMemo(() => {
    const protocolVersion =
      sessionRun?.protocolVersion ||
      task?.version ||
      sessionRun?.study?.protocolVersion ||
      "v2";

    return getProtocol(protocolVersion);
  }, [sessionRun, task?.version]);

  const conditions = useMemo(() => {
    const nBack = protocol.nBack;

    const realConditions = [
      {
        name: "0-back",
        n: 0,
        mode: "real",
        instructions: buildInstructions(0, "real"),
        sequence: applyDevLimit(
          isSessionTwo
            ? nBack.real.zeroBackSession2
            : nBack.real.zeroBackSession1
        ),
      },
      {
        name: "1-back",
        n: 1,
        mode: "real",
        instructions: buildInstructions(1, "real"),
        sequence: applyDevLimit(
          isSessionTwo
            ? nBack.real.oneBackSession2
            : nBack.real.oneBackSession1
        ),
      },
      {
        name: "2-back",
        n: 2,
        mode: "real",
        instructions: buildInstructions(2, "real"),
        sequence: applyDevLimit(
          isSessionTwo
            ? nBack.real.twoBackSession2
            : nBack.real.twoBackSession1
        ),
      },
    ];

    if (!includePractice) return realConditions;

    const practiceConditions = [
      {
        name: "0-back practice",
        n: 0,
        mode: "practice",
        instructions: buildInstructions(0, "practice"),
        sequence: applyDevLimit(nBack.practice.zeroBack),
      },
      {
        name: "1-back practice",
        n: 1,
        mode: "practice",
        instructions: buildInstructions(1, "practice"),
        sequence: applyDevLimit(nBack.practice.oneBack),
      },
      {
        name: "2-back practice",
        n: 2,
        mode: "practice",
        instructions: buildInstructions(2, "practice"),
        sequence: applyDevLimit(nBack.practice.twoBack),
      },
    ];

    return [...practiceConditions, ...realConditions];
  }, [protocol, includePractice, isSessionTwo]);

  const condition = conditions[conditionIndex];

  const submitResults = useCallback(
    async (finalResponses) => {
      try {
        setSubmitting(true);
        setPhase("submitting");

        const realResponses = finalResponses.filter((r) => r.mode === "real");
        const totalCorrect = realResponses.filter((r) => r.correct).length;

        const accuracy =
          realResponses.length > 0 ? totalCorrect / realResponses.length : 0;

        await api.post("/tasks/complete", {
          sessionRunId: sessionRun._id,
          taskType: task.type,
          taskVersion: task.version,
          startedAt: taskStartedAtRef.current,
          summary: {
            totalCorrect,
            totalTrials: realResponses.length,
            accuracy,
            conditionsCompleted: 3,
            practiceIncluded: includePractice,
          },
          trials: realResponses.map((response, index) => ({
            trialNumber: index + 1,
            stimulus: `${response.condition}:${response.letter}`,
            expectedResponse: response.expectedResponse,
            actualResponse: response.actualResponse,
            correct: response.correct,
            reactionTimeMs: response.reactionTimeMs,
          })),
        });

        window.location.href = `/participant/session?token=${token}&sessionRunId=${sessionRun._id}`;
      } catch (error) {
        console.error("Failed to submit N-back results:", error);

        alert(
          error.response?.data?.message ||
            "Failed to submit N-back results. Please try again."
        );

        setPhase("intro");
      } finally {
        setSubmitting(false);
      }
    },
    [sessionRun._id, task.type, task.version, token, includePractice]
  );

  const moveToNextTrial = useCallback(
    (latestResponses) => {
      const nextTrialIndex = trialIndex + 1;

      if (nextTrialIndex < condition.sequence.length) {
        setTrialIndex(nextTrialIndex);
        setPhase("fixation");
        return;
      }

      const nextConditionIndex = conditionIndex + 1;

      if (nextConditionIndex < conditions.length) {
        setConditionIndex(nextConditionIndex);
        setTrialIndex(0);
        setPhase("instructions");
        return;
      }

      submitResults(latestResponses);
    },
    [
      trialIndex,
      condition,
      conditionIndex,
      conditions.length,
      submitResults,
    ]
  );

  const recordResponse = useCallback(
    (keyValue) => {
      if (respondedRef.current) return;

      respondedRef.current = true;

      const target = isTarget(condition.sequence, trialIndex, condition.n);
      const expectedResponse = target ? "1" : "2";
      const actualResponse = keyValue || null;
      const correct = actualResponse === expectedResponse;

      const reactionTimeMs =
        stimulusStartedAtRef.current && actualResponse
          ? Date.now() - stimulusStartedAtRef.current
          : null;

      const response = {
        mode: condition.mode,
        condition: condition.name,
        n: condition.n,
        trialIndex,
        letter: condition.sequence[trialIndex],
        expectedResponse,
        actualResponse,
        correct,
        reactionTimeMs,
      };

      const latestResponses = [...responsesRef.current, response];

      responsesRef.current = latestResponses;
      setResponses(latestResponses);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setTimeout(() => {
        moveToNextTrial(latestResponses);
      }, 0);
    },
    [condition, trialIndex, moveToNextTrial]
  );

  useEffect(() => {
    if (phase === "fixation") {
      respondedRef.current = false;
      stimulusStartedAtRef.current = null;

      timeoutRef.current = setTimeout(() => {
        setPhase("stimulus");
      }, FIXATION_MS);

      return () => clearTimeout(timeoutRef.current);
    }

    if (phase === "stimulus") {
      stimulusStartedAtRef.current = Date.now();

      timeoutRef.current = setTimeout(() => {
        recordResponse(null);
      }, LETTER_MS);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [phase, recordResponse]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (phase === "stimulus" && ["1", "2"].includes(event.key)) {
        recordResponse(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, recordResponse]);

  if (phase === "intro") {
    return (
      <StatusCard
        title="N-Back Task"
        subtitle={`Task ${taskIndex + 1} of ${totalTasks} · ${sessionName}`}
      >
        <div className="space-y-5 leading-7 text-slate-300">
          <p>
            This task involves viewing single letters presented one at a time.
          </p>

          <p>
            Your job is to determine whether or not the letter currently on the
            screen is a target or a non-target.
          </p>

          <p>
            Press <span className="font-semibold text-white">1</span> if the
            letter is a target.
          </p>

          <p>
            Press <span className="font-semibold text-white">2</span> if the
            letter is a non-target.
          </p>

          {includePractice ? (
            <p className="text-sm text-slate-400">
              Let&apos;s try a few practice trials of each condition you will
              see.
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Now let&apos;s move on to the real trials. The test will take
              about 10 minutes to complete.
            </p>
          )}
        </div>

        <div className="mt-8">
          <PrimaryButton
            onClick={() => {
              taskStartedAtRef.current = new Date().toISOString();
              setPhase("instructions");
            }}
          >
            Continue
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  if (phase === "instructions") {
    const isPractice = condition.mode === "practice";

    const practiceIndex = isPractice ? conditionIndex + 1 : null;
    const realIndex = isPractice
      ? null
      : includePractice
        ? conditionIndex - 2
        : conditionIndex + 1;

    const title = formatConditionName(condition.name);

    const subtitle = isPractice
      ? `Practice ${practiceIndex} of 3`
      : `Condition ${realIndex} of 3`;

    const buttonLabel = isPractice
      ? "Begin Practice"
      : `Begin ${formatConditionName(condition.name)}`;

    return (
      <StatusCard title={title} subtitle={subtitle}>
        <div className="space-y-5 leading-7 text-slate-300">
          <p>{condition.instructions}</p>

          <p>
            Before each letter, you will see a fixation cross. The letter will
            then appear briefly.
          </p>

          <p className="text-sm text-slate-400">
            Click the button when you are ready to begin this condition.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton onClick={() => setPhase("fixation")}>
            {buttonLabel}
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  if (phase === "fixation") {
    return (
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl shadow-black/20">
        <div className="py-24 text-center text-8xl font-semibold leading-none text-black">
          +
        </div>
      </div>
    );
  }

  if (phase === "stimulus") {
    return (
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl shadow-black/20">
        <div className="py-24 text-center text-8xl font-semibold leading-none text-black">
          {condition.sequence[trialIndex]}
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <StatusCard
        title="Submitting Results"
        subtitle="Please wait while your responses are saved."
      />
    );
  }

  return null;
}