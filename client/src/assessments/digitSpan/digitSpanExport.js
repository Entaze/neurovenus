export function buildDigitSpanTrialExportRows(responses = []) {
  return responses.map((row) => ({
    studyId: row.studyId,
    sessionRunId: row.sessionRunId,
    participantId: row.participantId,
    assessmentId: row.assessmentId || "digitSpan",

    trialNumber: row.trialNumber,
    trialPhase: row.trialPhase,
    mode: row.mode,
    spanLength: row.spanLength,

    stimulus: Array.isArray(row.sequence)
      ? row.sequence.join("-")
      : row.sequence,

    expectedResponse: row.expectedResponse,
    actualResponse: row.actualResponse,
    correct: row.correct,

    responseTimeMs: row.responseTimeMs,
    startedAt: row.startedAt,
    answeredAt: row.answeredAt,
  }));
}

export function buildDigitSpanSummaryExportRow({
  studyId,
  sessionRunId,
  participantId,
  summary = {},
}) {
  return {
    studyId,
    sessionRunId,
    participantId,
    assessmentId: "digitSpan",

    forwardLongestSpan: summary.forwardLongestSpan ?? null,
    backwardLongestSpan: summary.backwardLongestSpan ?? null,

    forwardCorrectTrials: summary.forwardCorrectTrials ?? null,
    backwardCorrectTrials: summary.backwardCorrectTrials ?? null,

    forwardTotalTrials: summary.forwardTotalTrials ?? null,
    backwardTotalTrials: summary.backwardTotalTrials ?? null,

    totalCorrectTrials: summary.totalCorrectTrials ?? null,
    totalTrials: summary.totalTrials ?? null,
    overallAccuracy: summary.overallAccuracy ?? null,
  };
}