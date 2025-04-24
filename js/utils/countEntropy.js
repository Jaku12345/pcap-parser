/**
 * Calculates the entrophy
 * @param  {array} packets
 * @return {string} packet entropy
 */

export function countEntropy(packets) {
  const entropies = packets
    .map((p) => p.entropy)
    .filter((e) => typeof e === "number" && !isNaN(e));

  if (entropies.length === 0) return "N/A";

  const min = Math.min(...entropies).toFixed(2);
  const max = Math.max(...entropies).toFixed(2);
  const avg = entropies.reduce((sum, e) => sum + e, 0) / entropies.length;

  return `min: ${min}, max: ${max}, avg: ${avg.toFixed(2)}`;
}
