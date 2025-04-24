/**
 * Find victim and attacker correlation
 * @param  {number} x victim data
 * @param  {number} y attacker data
 * @return {number} denominator correlation result
 */
export function pearsonCorrelation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return 0;
  }

  try {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  } catch (error) {
    console.error("Error calculating correlation:", error);
    return 0;
  }
}
