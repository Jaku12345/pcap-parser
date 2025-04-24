/**
 * Calculates the entropy
 * @param {array} payload
 * @return {string} entropy
 */
export function calculateEntropy(payload) {
  const frequencyMap = new Map();
  const len = payload.length;

  for (const char of payload) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }

  let entropy = 0;
  for (const [char, count] of frequencyMap) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}
