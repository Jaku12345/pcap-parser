/**
 * Finds the packets captured at the exact same second
 * @param {string} timestamp packet timestamp
 * @param {array} frequencyMap frequencyMap
 * @param {array} packetData packetData
 */

export function findSamePacketsEachSecond(timestamp, frequencyMap, packetData) {
  const second = timestamp.split(".")[0]; // Remove milliseconds for grouping by second

  if (!frequencyMap.has(second)) {
    frequencyMap.set(second, { count: 0, packets: [] });
  }

  const entry = frequencyMap.get(second);
  entry.count += 1;
  entry.packets.push(packetData);
}
