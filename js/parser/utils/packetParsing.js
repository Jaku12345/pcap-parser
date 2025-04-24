/**
 * Parse each packet data
 * @param  {array} packetData packet data
 * @return {object} packet data extracted to human readible format
 */
export function parsePacketData(packetData) {
  const view = new DataView(
    packetData.buffer,
    packetData.byteOffset,
    packetData.byteLength
  );
  let offset = 0;

  // ===== Ethernet Header =====
  offset += 12;
  const etherType = view.getUint16(offset, false);
  offset += 2;

  if (etherType !== 0x0800) return null; // Not IPv4

  const ipHeaderStart = offset;
  const versionAndHeaderLength = view.getUint8(offset);
  const headerLength = (versionAndHeaderLength & 0x0f) * 4;
  offset += 1; // Move past version/header length
  offset += 1; // DSCP/ECN
  const totalLength = view.getUint16(offset, false);
  offset += 2;
  offset += 2; // ID
  offset += 2; // Flags + Fragment Offset

  const ttl = view.getUint8(offset);
  offset += 1;

  const protocolNum = view.getUint8(offset);
  offset += 1;

  offset += 2; // Header checksum

  const srcIP = Array.from({ length: 4 }, () => view.getUint8(offset++)).join(
    "."
  );
  const destIP = Array.from({ length: 4 }, () => view.getUint8(offset++)).join(
    "."
  );

  const protocol =
    protocolNum === 6 ? "TCP" : protocolNum === 17 ? "UDP" : "OTHER";
  offset = ipHeaderStart + headerLength;

  let srcPort,
    destPort,
    flags = null;

  if (protocol === "TCP") {
    srcPort = view.getUint16(offset, false);
    offset += 2;
    destPort = view.getUint16(offset, false);
    offset += 2;
    offset += 8; // Sequence + Ack
    const offsetAndFlags = view.getUint16(offset, false);
    offset += 2;
    const tcpFlags = offsetAndFlags & 0x01ff;
    flags = {
      fin: !!(tcpFlags & 0x01),
      syn: !!(tcpFlags & 0x02),
      rst: !!(tcpFlags & 0x04),
      psh: !!(tcpFlags & 0x08),
      ack: !!(tcpFlags & 0x10),
      urg: !!(tcpFlags & 0x20),
    };
  } else if (protocol === "UDP") {
    srcPort = view.getUint16(offset, false);
    offset += 2;
    destPort = view.getUint16(offset, false);
    offset += 2;
    offset += 2; // UDP length
  }

  const payloadOffset =
    ipHeaderStart +
    headerLength +
    (protocol === "TCP" || protocol === "UDP" ? 8 : 0);
  const payloadLength = totalLength - (payloadOffset - ipHeaderStart);
  const payloadBytes = new Uint8Array(
    packetData.buffer,
    packetData.byteOffset + payloadOffset,
    Math.max(0, payloadLength)
  );
  const payload = Array.from(payloadBytes)
    .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
    .join("");

  return {
    protocol,
    srcPort,
    destPort,
    srcIP,
    destIP,
    ttl,
    flags,
    length: payloadLength,
    payload,
  };
}
