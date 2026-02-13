const calculateFinalScore = (attempts) => {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  attempts.forEach(a => {
    totalWeightedScore += a.score * a.weight;
    totalWeight += a.weight;
  });

  if (totalWeight === 0) return 0;

  return Math.round(totalWeightedScore / totalWeight);
};

export default calculateFinalScore;
