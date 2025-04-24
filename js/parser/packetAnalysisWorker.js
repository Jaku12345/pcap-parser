import { extractGlobalHeader } from "../parser/utils/globalHeader.js";
import { parsePacketData } from "../parser/utils/packetParsing.js";
import { findSamePacketsEachSecond } from "../parser/utils/frequency.js";
import { calculateEntropy } from "../parser/utils/entropy.js";
import { assessSeverity } from "../parser/utils/severity.js";
import { findPacketCaptureTimeInIso } from "../parser/utils/captureTime.js";

self.onmessage = function (e) {
  const buffer = e.data;
  const { packetsData, globalHeader } = parsePcap(buffer);
  self.postMessage({ packetsData, globalHeader });
};

/**
 * Main pcap parse function
 * @param  {object} buffer buffer
 * @return {object} { packetsData, globalHeader } data of packets captured each second and their severity scores
 * and the gloabl packet header data
 */
function parsePcap(buffer) {
  const view = new DataView(buffer);

  const globalHeader = extractGlobalHeader(view);

  let offset = 24;
  const packetsDataMap = new Map();

  while (offset < buffer.byteLength) {
    const { captureTimeIso, newOffset } = findPacketCaptureTimeInIso(
      view,
      offset
    );
    offset = newOffset;

    const inclLen = view.getUint32(offset, true);
    const packetStartOffset = offset + 8;
    const rawPacketData = new Uint8Array(buffer, packetStartOffset, inclLen);
    offset += 8 + inclLen;

    const parsedPacketData = parsePacketData(rawPacketData);

    const { protocol, srcPort, destPort, srcIP, destIP, ttl, payload } =
      parsedPacketData;

    const entropy = calculateEntropy(payload);
    const severity = assessSeverity(parsedPacketData);

    const packet = {
      protocol,
      srcIP,
      destIP,
      srcPort,
      destPort,
      ttl,
      payload,
      entropy,
      severity,
      timestamp: captureTimeIso,
    };

    findSamePacketsEachSecond(captureTimeIso, packetsDataMap, packet);
  }

  const packetsData = [...packetsDataMap.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([time, { count, packets }]) => ({
      time: new Date(time),
      count,
      packets,
    }));

  return { packetsData, globalHeader };
}
