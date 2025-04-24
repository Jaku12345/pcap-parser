/**
 * Return top 3 of each packets
 * @param  {array} list
 * @param  {number} limit
 * @return {object} top 3 packet entropy
 */

export function countTop(list, limit = 3) {
  if (!list || !list.length) return "N/A";

  const counts = list.reduce((acc, item) => {
    if (item === undefined || item === null) return acc;
    const key = String(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ") || "N/A"
  );
}
