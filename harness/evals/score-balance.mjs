export function getQuarterScoreSpread(inputs) {
  if (inputs.length === 0) {
    return 0;
  }

  const scores = inputs.map((input) => input.averageScore);
  return Math.max(...scores) - Math.min(...scores);
}

export function getAverageQuarterScore(inputs) {
  if (inputs.length === 0) {
    return 0;
  }

  return inputs.reduce((sum, input) => sum + input.averageScore, 0) / inputs.length;
}
