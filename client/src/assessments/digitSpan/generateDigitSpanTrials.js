function randomDigit(previousDigit = null) {
  let digit = Math.floor(Math.random() * 10);

  while (digit === previousDigit) {
    digit = Math.floor(Math.random() * 10);
  }

  return digit;
}

function generateSequence(length) {
  const sequence = [];

  for (let i = 0; i < length; i++) {
    sequence.push(randomDigit(sequence[i - 1]));
  }

  return sequence;
}

function buildExpectedResponse(sequence, mode) {
  if (mode === "backward") {
    return [...sequence].reverse().join("");
  }

  return sequence.join("");
}

function createTrial({
  trialNumber,
  mode,
  spanLength,
  isPractice,
}) {
  const sequence = generateSequence(spanLength);

  return {
    trialNumber,
    trialPhase: isPractice ? "practice" : "test",
    mode,
    spanLength,
    sequence,
    expectedResponse: buildExpectedResponse(sequence, mode),
    isPractice,
  };
}

export function generateDigitSpanTrials(config = {}) {
  const {
    includePractice = true,
    practiceTrialsPerMode = 2,
    forwardSpanLengths = [3, 4, 5, 6, 7, 8],
    backwardSpanLengths = [2, 3, 4, 5, 6, 7],
    trialsPerSpan = 2,
    includeForward = true,
    includeBackward = true,
  } = config;

  const trials = [];
  let trialNumber = 1;

  const addPracticeTrials = (mode, spanLength) => {
    for (let i = 0; i < practiceTrialsPerMode; i++) {
      trials.push(
        createTrial({
          trialNumber,
          mode,
          spanLength,
          isPractice: true,
        })
      );

      trialNumber += 1;
    }
  };

  const addTestTrials = (mode, spanLengths) => {
    spanLengths.forEach((spanLength) => {
      for (let i = 0; i < trialsPerSpan; i++) {
        trials.push(
          createTrial({
            trialNumber,
            mode,
            spanLength,
            isPractice: false,
          })
        );

        trialNumber += 1;
      }
    });
  };

  if (includeForward) {
    if (includePractice) {
      addPracticeTrials("forward", 3);
    }

    addTestTrials("forward", forwardSpanLengths);
  }

  if (includeBackward) {
    if (includePractice) {
      addPracticeTrials("backward", 2);
    }

    addTestTrials("backward", backwardSpanLengths);
  }

  return trials;
}