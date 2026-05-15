function getCorrectTestRows(responses = [], mode) {
  return responses.filter(
    (row) =>
      row.mode === mode &&
      row.trialPhase === "test" &&
      row.correct === true
  );
}

function getTestRows(responses = [], mode) {
  return responses.filter(
    (row) => row.mode === mode && row.trialPhase === "test"
  );
}

function getLongestSpan(responses = [], mode) {
  const correctRows = getCorrectTestRows(responses, mode);

  if (!correctRows.length) return null;

  return Math.max(...correctRows.map((row) => row.spanLength));
}

export function scoreDigitSpan(responses = []) {
  const forwardRows = getTestRows(responses, "forward");
  const backwardRows = getTestRows(responses, "backward");

  const forwardCorrectRows = getCorrectTestRows(responses, "forward");
  const backwardCorrectRows = getCorrectTestRows(responses, "backward");

  const totalRows = [...forwardRows, ...backwardRows];
  const totalCorrectRows = [...forwardCorrectRows, ...backwardCorrectRows];

  return {
    forwardLongestSpan: getLongestSpan(responses, "forward"),
    backwardLongestSpan: getLongestSpan(responses, "backward"),

    forwardCorrectTrials: forwardCorrectRows.length,
    backwardCorrectTrials: backwardCorrectRows.length,

    forwardTotalTrials: forwardRows.length,
    backwardTotalTrials: backwardRows.length,

    totalCorrectTrials: totalCorrectRows.length,
    totalTrials: totalRows.length,

    overallAccuracy:
      totalRows.length > 0
        ? totalCorrectRows.length / totalRows.length
        : null,
  };
}