// client/src/assessments/psqi/PSQITask.jsx

import { useMemo, useState } from "react";

import api from "../../api/client";
import PrimaryButton from "../../components/PrimaryButton";
import StatusCard from "../../components/StatusCard";
import { psqiItems } from "./psqiItems";
import { scorePSQI } from "./psqiScoring";

export default function PSQITask({ task, sessionRun, taskIndex, totalTasks }) {
  const [started, setStarted] = useState(false);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [startedAt, setStartedAt] = useState(null);

  const missingRequiredItems = useMemo(() => {
    return psqiItems.filter((item) => {
      if (!item.required) return false;

      const value = responses[item.id];

      return value === undefined || value === null || value === "";
    });
  }, [responses]);

  const updateResponse = (itemId, value) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: value,
    }));

    setError("");
  };

  const buildTrials = () => {
    const now = new Date().toISOString();

    return psqiItems.map((item, index) => ({
      trialNumber: index + 1,
      itemId: item.id,
      itemLabel: item.label,
      section: item.section,
      responseType: item.type,
      stimulus: item.label,
      expectedResponse: null,
      actualResponse:
        responses[item.id] !== undefined ? String(responses[item.id]) : null,
      correct: null,
      reactionTimeMs: null,
      startedAt,
      answeredAt: now,
      validationStatus:
        responses[item.id] === undefined ||
        responses[item.id] === null ||
        responses[item.id] === ""
          ? "missing"
          : "valid",
    }));
  };

  const submitTask = async () => {
    if (missingRequiredItems.length > 0) {
      setError("Please complete all required questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const scored = scorePSQI(responses);

      await api.post("/tasks/complete", {
        sessionRunId: sessionRun._id,
        taskType: task.type,
        taskVersion: task.version || "v1",
        startedAt,
        summary: {
          assessmentName: "Pittsburgh Sleep Quality Index",
          componentScores: scored.componentScores,
          globalScore: scored.globalScore,
          classification: scored.classification,
          metadata: scored.metadata,
          responses,
        },
        trials: buildTrials(),
      });

      window.location.reload();
    } catch (err) {
      console.error("Failed to submit PSQI:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit questionnaire. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!started) {
    return (
      <StatusCard
        title="Pittsburgh Sleep Quality Index"
        subtitle={`Task ${taskIndex + 1} of ${totalTasks}`}
      >
        <div className="space-y-5 leading-7 text-slate-300">
          <p>
            This questionnaire asks about your usual sleep habits during the past
            month.
          </p>

          <p>
            Please answer each question as accurately as possible based on your
            typical experience over the last month. There are no right or wrong
            answers.
          </p>

          <p className="text-sm text-slate-400">
            Your responses will be used to calculate sleep quality component
            scores for the study team.
          </p>
        </div>

        <div className="mt-8">
          <PrimaryButton
            onClick={() => {
              setStartedAt(new Date().toISOString());
              setStarted(true);
            }}
          >
            Begin Questionnaire
          </PrimaryButton>
        </div>
      </StatusCard>
    );
  }

  return (
    <StatusCard
      title="Pittsburgh Sleep Quality Index"
      subtitle={`Task ${taskIndex + 1} of ${totalTasks}`}
    >
      <div className="space-y-6">
        {psqiItems.map((item, index) => (
          <QuestionItem
            key={item.id}
            item={item}
            index={index}
            value={responses[item.id]}
            onChange={(value) => updateResponse(item.id, value)}
          />
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          {psqiItems.length - missingRequiredItems.length} of {psqiItems.length}{" "}
          required fields completed
        </p>

        <PrimaryButton onClick={submitTask} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Questionnaire"}
        </PrimaryButton>
      </div>
    </StatusCard>
  );
}

function QuestionItem({ item, index, value, onChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300/70">
            {item.section}
          </p>

          <label className="mt-2 block text-base font-semibold leading-7 text-white">
            {index + 1}. {item.label}
          </label>
        </div>

        {item.required && (
          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
            Required
          </span>
        )}
      </div>

      {item.type === "time" && (
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
        />
      )}

      {item.type === "number" && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={item.min}
            max={item.max}
            step={item.step || 1}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          {item.suffix && (
            <span className="min-w-fit text-sm font-semibold text-slate-400">
              {item.suffix}
            </span>
          )}
        </div>
      )}

      {item.type === "radio" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {item.options.map((option) => {
            const selected = Number(value) === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  selected
                    ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                    : "border-white/10 bg-slate-950/50 text-slate-300 hover:border-cyan-400/40"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}