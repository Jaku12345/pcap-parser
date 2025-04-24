/**
 * Finds the packet capture time.
 * @param {string} view current slice of bits
 * @param {string} offset offset
 * @return {object} {captureTimeIso, newOffset}
 */
export function findPacketCaptureTimeInIso(view, offset) {
  const captureTimeSecUnix = view.getUint32(offset, true);
  offset += 4;

  const captureTimeMicroSecUnix = view.getUint32(offset, true);
  offset += 4;

  const captureTimeIso = new Date(
    captureTimeSecUnix * 1000 + Math.floor(captureTimeMicroSecUnix / 1000)
  ).toISOString();

  return { captureTimeIso, newOffset: offset };
}
