// client/src/assessments/FingerTapTask.jsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/client";
import PrimaryButton from "../components/PrimaryButton";
import StatusCard from "../components/StatusCard";
import { TASK_TIMING } from "../config/taskTiming";
import { getProtocol } from "../config/protocols";

const ACTIVE_DURATION = TASK_TIMING.fingerTapping.activeDurationSeconds;
const REST_DURATION = TASK_TIMING.fingerTapping.restDurationSeconds;

export default function FingerTapTask({
  task,
  sessionRun,
  taskIndex,
  totalTasks,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const textareaRef = useRef(null);

  const [phase, setPhase] = useState("instructions");
  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(ACTIVE_DURATION);
  const [currentInput, setCurrentInput] = useState("");
  const [roundResults, setRoundResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const protocol = useMemo(() => {
    const protocolVersion =
      sessionRun?.protocolVersion ||
      task?.version ||
      sessionRun?.study?.protocolVersion ||
      "v2";

    return getProtocol(protocolVersion);
  }, [sessionRun, task?.version]);

  const TARGET_SEQUENCE = protocol.fingerTapping.targetSequence;

  const sessionName = sessionRun?.sessionName || "";
  const sessionOrder = Number(sessionRun?.sessionOrder || 1);

  const isFollowUpSession =
    sessionOrder > 1 ||
    sessionName.includes("Session B") ||
    sessionName.includes("Session D") ||
    sessionName.includes("Session 2") ||
    sessionName.includes("Session 4");

  const TOTAL_ROUNDS = isFollowUpSession
    ? protocol.fingerTapping.session2Rounds
    : protocol.fingerTapping.session1Rounds;

  // console.log("Finger Tapping Configuration:", {
  //   sessionName,
  //   sessionOrder,
  //   isFollowUpSession,
  //   TOTAL_ROUNDS,
  //   targetSequence: protocol.fingerTapping.targetSequence,
  // });

  const scoreRound = useCallback(
    (rawInput) => {
      const cleaned = rawInput.replace(/[^0-9]/g, "");
      const totalCharactersTyped = cleaned.length;

      let correctSequences = 0;

      for (let i = 0; i <= cleaned.length - TARGET_SEQUENCE.length; i += 1) {
        const chunk = cleaned.slice(i, i + TARGET_SEQUENCE.length);

        if (chunk === TARGET_SEQUENCE) {
          correctSequences += 1;
        }
      }

      const possibleSequences = Math.floor(
        totalCharactersTyped / TARGET_SEQUENCE.length
      );

      const accuracy =
        possibleSequences > 0 ? correctSequences / possibleSequences : 0;

      return {
        sequence: TARGET_SEQUENCE,
        rawInput,
        totalCharactersTyped,
        correctSequences,
        possibleSequences,
        accuracy,
      };
    },
    [TARGET_SEQUENCE]
  );

  const finishStudyTask = useCallback(
    async (allRounds) => {
      try {
        setSubmitting(true);
        setPhase("submitting");

        const totalCorrectSequences = allRounds.reduce(
          (sum, r) => sum + r.correctSequences,
          0
        );

        const totalPossibleSequences = allRounds.reduce(
          (sum, r) => sum + r.possibleSequences,
          0
        );

        const overallAccuracy =
          totalPossibleSequences > 0
            ? totalCorrectSequences / totalPossibleSequences
            : 0;

        await api.post("/tasks/complete", {
          sessionRunId: sessionRun._id,
          taskType: task.type,
          taskVersion: task.version,
          summary: {
            sequence: TARGET_SEQUENCE,
            roundsCompleted: allRounds.length,
            totalCorrectSequences,
            overallAccuracy,
          },
          trials: allRounds.map((result, index) => ({
            trialNumber: index + 1,
            stimulus: TARGET_SEQUENCE,
            expectedResponse: TARGET_SEQUENCE,
            actualResponse: result.rawInput,
            correct: result.accuracy === 1,
            reactionTimeMs: null,
          })),
        });

        window.location.href = `/participant/session?token=${token}&sessionRunId=${sessionRun._id}`;
      } catch (error) {
        console.error("Failed to submit finger tapping results:", error);
        alert(error.response?.data?.message || "Failed to submit task results.");
        setPhase("instructions");
      } finally {
        setSubmitting(false);
      }
    },
    [sessionRun._id, task.type, task.version, token, TARGET_SEQUENCE]
  );

  const completeActiveRound = useCallback(() => {
    const result = scoreRound(currentInput);

    const updatedResults = [
      ...roundResults,
      {
        round,
        ...result,
      },
    ];

    setRoundResults(updatedResults);
    setCurrentInput("");

    if (round >= TOTAL_ROUNDS) {
      finishStudyTask(updatedResults);
      return;
    }

    setPhase("rest");
    setSecondsLeft(REST_DURATION);
  }, [
    TOTAL_ROUNDS,
    currentInput,
    finishStudyTask,
    round,
    roundResults,
    scoreRound,
  ]);

  const completeRestRound = useCallback(() => {
    setRound((prev) => prev + 1);
    setPhase("active");
    setSecondsLeft(ACTIVE_DURATION);
    setCurrentInput("");
  }, []);

  useEffect(() => {
    if (phase !== "active" && phase !== "rest") return;

    if (secondsLeft <= 0) {
      const timeout = setTimeout(() => {
        if (phase === "active") {
          completeActiveRound();
        } else {
          completeRestRound();
        }
      }, 0);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phase, secondsLeft, completeActiveRound, completeRestRound]);

  useEffect(() => {
    if (phase === "active") {
      const timeout = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [phase]);

  const startTask = () => {
    setRound(1);
    setRoundResults([]);
    setCurrentInput("");
    setPhase("active");
    setSecondsLeft(ACTIVE_DURATION);
  };

  if (phase === "instructions") {
    return (
      <StatusCard
        title="Finger Tapping Task"
        subtitle={`Task ${taskIndex + 1} of ${totalTasks}`}
      >
        <div className="space-y-5 text-slate-300 leading-7">
          <p>
            You will be shown a sequence of numbers on the screen. Using your
            dominant hand (i.e., the hand you use to write with), type the
            sequence as fast and accurately as possible. Keep typing the
            sequence over and over until the numbers disappear.
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
            <img
              src="/images/finger-tapping-keyboard.png"
              alt="Keyboard showing which number keys to use and which number keypad not to use"
              className="w-full rounded-xl"
            />
          </div>

          <p>
            You will see a sequence of numbers several times. Each time
            remember to type them over and over as quickly and accurately as
            possible. In-between sequences there will be a chance for you to
            rest. This happens when you see a black screen with a white X in
            the middle.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton onClick={startTask}>Begin Task</PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  if (phase === "active") {
    return (
      <StatusCard>
        <div className="space-y-8">
          <div className="text-center text-7xl font-bold tracking-[0.35em] text-white">
            {TARGET_SEQUENCE}
          </div>

          <textarea
            ref={textareaRef}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            rows={6}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            placeholder="Type here..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none focus:border-cyan-400"
            style={{
              WebkitTextSecurity: "disc", // Shows typed characters as • bullets
            }}
          />
        </div>
      </StatusCard>
    );
  }

  if (phase === "rest") {
    return (
      <StatusCard>
        <div className="py-16 text-center text-8xl font-light text-white">
          X
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