const COLOR_WORDS = {
  red: "RED",
  blue: "BLUE",
  green: "GREEN",
  yellow: "YELLOW",
};

const NEUTRAL_WORDS = ["XXXX", "WORD", "ITEM", "TEXT"];

const colorStyles = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
};

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createTrial({ index, condition, colors, isPractice }) {
  const inkColor = pickRandom(colors);

  let word;

  if (condition === "congruent") {
    word = COLOR_WORDS[inkColor];
  }

  if (condition === "incongruent") {
    const possibleWords = colors.filter((color) => color !== inkColor);
    word = COLOR_WORDS[pickRandom(possibleWords)];
  }

  if (condition === "neutral") {
    word = pickRandom(NEUTRAL_WORDS);
  }

  return {
    trialIndex: index,
    condition,
    word,
    inkColor,
    correctResponse: inkColor,
    colorHex: colorStyles[inkColor],
    isPractice,
  };
}

export function generateStroopTrials(config = {}) {
  const {
    includePractice = true,
    practiceTrials = 6,
    testTrials = 48,
    colors = ["red", "blue", "green", "yellow"],
    conditions = ["congruent", "incongruent", "neutral"],
  } = config;

  const trials = [];

  if (includePractice) {
    for (let i = 0; i < practiceTrials; i++) {
      trials.push(
        createTrial({
          index: trials.length,
          condition: pickRandom(conditions),
          colors,
          isPractice: true,
        })
      );
    }
  }

  for (let i = 0; i < testTrials; i++) {
    trials.push(
      createTrial({
        index: trials.length,
        condition: conditions[i % conditions.length],
        colors,
        isPractice: false,
      })
    );
  }

  return shuffle(trials).map((trial, index) => ({
    ...trial,
    trialIndex: index,
  }));
}