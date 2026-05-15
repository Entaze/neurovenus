function mean(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getConditionRows(rows, condition) {
  return rows.filter(
    (row) =>
      !row.isPractice &&
      row.condition === condition &&
      row.correct === true &&
      typeof row.reactionTimeMs === "number"
  );
}

export function scoreStroop(responses) {
  const testRows = responses.filter((row) => !row.isPractice);

  const correctRows = testRows.filter((row) => row.correct);
  const incorrectRows = testRows.filter((row) => row.correct === false);

  const congruentRows = getConditionRows(testRows, "congruent");
  const incongruentRows = getConditionRows(testRows, "incongruent");
  const neutralRows = getConditionRows(testRows, "neutral");

  const congruentMeanRt = mean(congruentRows.map((row) => row.reactionTimeMs));
  const incongruentMeanRt = mean(incongruentRows.map((row) => row.reactionTimeMs));
  const neutralMeanRt = mean(neutralRows.map((row) => row.reactionTimeMs));

  const meanReactionTime = mean(
    correctRows
      .filter((row) => typeof row.reactionTimeMs === "number")
      .map((row) => row.reactionTimeMs)
  );

  return {
    totalTrials: testRows.length,
    correctTrials: correctRows.length,
    incorrectTrials: incorrectRows.length,
    accuracy: testRows.length ? correctRows.length / testRows.length : null,

    meanReactionTime,
    congruentMeanRt,
    incongruentMeanRt,
    neutralMeanRt,

    stroopInterferenceRt:
      congruentMeanRt !== null && incongruentMeanRt !== null
        ? incongruentMeanRt - congruentMeanRt
        : null,

    stroopInterferenceAccuracy: null,
  };
}