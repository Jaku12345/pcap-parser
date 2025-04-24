/**
 * Extracts the global header info from packet
 * @param  view global header in bits
 * @return {object} global header data
 */
export function extractGlobalHeader(view) {
  const magicNumber = view.getUint32(0, true);
  const versionMajor = view.getUint16(4, true);
  const versionMinor = view.getUint16(6, true);
  const thisZone = view.getInt32(8, true);
  const sigfigs = view.getUint32(12, true);
  const snapLen = view.getUint32(16, true);
  const network = view.getUint32(20, true);

  let magicNumberDescription = "";
  if (magicNumber === 0xa1b2c3d4) {
    magicNumberDescription = "Little-endian format (0xa1b2c3d4)";
  } else if (magicNumber === 0xd4c3b2a1) {
    magicNumberDescription = "Big-endian format (0xd4c3b2a1)";
  } else {
    magicNumberDescription = `Unknown magic number: 0x${magicNumber.toString(
      16
    )}`;
  }

  const networkTypes = {
    1: "Ethernet",
    101: "Wi-Fi (IEEE 802.11)",
    105: "PPP (Point-to-Point Protocol)",
    12: "Token Ring",
  };
  const networkDescription =
    networkTypes[network] || `Unknown network type (${network})`;

  const timezoneDescription =
    thisZone === 0
      ? "No timezone offset (GMT)"
      : `Timezone offset: ${thisZone} seconds from GMT`;

  const timestampAccuracyDescription =
    sigfigs === 0
      ? "Timestamp accuracy: 0 significant figures"
      : `Timestamp accuracy: ${sigfigs} significant figures`;

  return {
    magicNumber: magicNumberDescription,
    version: `PCAP version ${versionMajor}.${versionMinor}`,
    timezoneOffset: timezoneDescription,
    timestampAccuracy: timestampAccuracyDescription,
    maxCaptureLength: `${snapLen} bytes`,
    linkLayerType: networkDescription,
  };
}
