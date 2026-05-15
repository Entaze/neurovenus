// client/src/assessments/stroop/stroopExport.js

export function buildStroopTrialExportRows(responses = []) {
  return responses.map((row) => ({
    studyId: row.studyId,
    sessionRunId: row.sessionRunId,
    participantId: row.participantId,
    assessmentId: row.assessmentId || "stroop",

    trialNumber: row.trialNumber,
    trialIndex: row.trialIndex,
    trialPhase: row.trialPhase,

    condition: row.condition,
    stimulus: row.stimulus || row.word,
    word: row.word,
    inkColor: row.inkColor,

    expectedResponse: row.expectedResponse || row.correctResponse,
    correctResponse: row.correctResponse,

    actualResponse: row.actualResponse || row.selectedResponse,
    selectedResponse: row.selectedResponse,

    correct: row.correct,
    reactionTimeMs: row.reactionTimeMs,
    isPractice: row.isPractice,

    startedAt: row.startedAt,
    answeredAt: row.answeredAt,
  }));
}

export function buildStroopSummaryExportRow({
  studyId,
  sessionRunId,
  participantId,
  summary = {},
}) {
  return {
    studyId,
    sessionRunId,
    participantId,
    assessmentId: "stroop",

    totalTrials: summary.totalTrials ?? null,
    correctTrials: summary.correctTrials ?? null,
    incorrectTrials: summary.incorrectTrials ?? null,
    accuracy: summary.accuracy ?? null,

    meanReactionTime: summary.meanReactionTime ?? null,

    congruentMeanRt: summary.congruentMeanRt ?? null,
    incongruentMeanRt: summary.incongruentMeanRt ?? null,
    neutralMeanRt: summary.neutralMeanRt ?? null,

    stroopInterferenceRt: summary.stroopInterferenceRt ?? null,
    stroopInterferenceAccuracy:
      summary.stroopInterferenceAccuracy ?? null,
  };
}