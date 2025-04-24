const COMMON_PORTS = new Set([
  80, 443, 53, 22, 21, 25, 110, 143, 465, 993, 995, 20, 21, 69, 989, 990, 445,
  3306, 5432, 27017, 1432, 1521, 3389, 5900, 161, 162, 137, 138, 139,
]);
const BLACKLISTED_IPS = new Set(["192.168.13.37", "10.0.0.5", "10.5.28.229"]); //TODO IMPORT FILE OF BAD IPS
const LOW_TTL_THRESHOLD = 10;
const LARGE_PACKET_SIZE = 1000;
const DNS_SUSPICIOUS_LENGTH = 200;
const SQL_INJECTION_PATTERN = /SELECT.*FROM.*WHERE/i;
const HIGH_ENTROPY_THRESHOLD = 6.5;
const FLAG_SCORE_MAP = {
  synfin: 4,
  rst: 3,
  psh: 2,
  ack: 1,
};

/**
 * Give each packet a severity score increment based on flags
 * @param  {object} flags packet flags
 * @return {number} score severity score based on flags
 */
function assessTcpFlags(flags) {
  let score = 0;
  const { syn, fin, rst, psh, ack, urg } = flags;

  if (syn && fin) score += FLAG_SCORE_MAP.synfin;
  if (rst) score += FLAG_SCORE_MAP.rst;
  if (psh) score += FLAG_SCORE_MAP.psh;
  if (ack) score += FLAG_SCORE_MAP.ack;

  return score;
}

/**
 * Increase the severity score of packets based on tpc flags
 * @param  {object} packet flag
 * @return {string} score return packet severity score
 */
export function assessSeverity(packet) {
  let score = 0;

  // Validate packet input
  if (!packet || !packet.protocol) return "Low";

  // Check if the destination port is uncommon
  if (!COMMON_PORTS.has(packet.destPort)) {
    score += 3;
  }

  // Protocol-specific checks (TCP)
  if (packet.protocol === "TCP" && packet.flags) {
    score += assessTcpFlags(packet.flags);
  }

  // Check for malicious DNS traffic
  if (
    packet.protocol === "UDP" &&
    packet.destPort === 53 &&
    packet.length > DNS_SUSPICIOUS_LENGTH
  ) {
    score += 3; // Suspicious DNS packet
  }

  // Check for large payload size
  if (packet.length > LARGE_PACKET_SIZE) {
    score += 3;
  }

  // Check if the source IP is blacklisted
  if (BLACKLISTED_IPS.has(packet.srcIP)) {
    score += 5;
  }

  // Look for SQL injection patterns in HTTP traffic
  if (
    packet.protocol === "HTTP" &&
    SQL_INJECTION_PATTERN.test(packet.payload)
  ) {
    score += 5;
  }

  // Check for low TTL (Time To Live)
  if (packet.ttl < LOW_TTL_THRESHOLD) {
    score += 2;
  }

  // Assess packet entropy (higher entropy may indicate irregular or encrypted traffic)
  if (packet.entropy && packet.entropy > HIGH_ENTROPY_THRESHOLD) {
    score += 7;
  }

  if (score >= 9) {
    return "High";
  } else if (score >= 6) {
    return "Medium";
  } else {
    return "Low";
  }
}
