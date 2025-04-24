import { countEntropy } from "../utils/countEntropy.js";
import { countTop } from "../utils/countTop.js";
import { appState } from "../state.js";

/**
 * Handle clicking on cart
 * @param  {object} context unused dygraph param
 * @param  {object} g allows row selection
 * @param  {object} context unused dygraph param
 */
export function handleChartClick(event, g, context) {
  const row = g.getSelection();
  if (row === null) return;

  const entry = appState.timeData[row];
  if (!entry || !entry.packets || !entry.packets.length) {
    console.log("No packet data available for this point", "info");
    return;
  }

  const packets = entry.packets;
  const high = packets.filter((p) => p.severity === "High").length;
  const medium = packets.filter((p) => p.severity === "Medium").length;
  const low = packets.filter((p) => p.severity === "Low").length;

  const protocols = countTop(packets.map((p) => p.protocol));
  const srcIPs = countTop(packets.map((p) => p.srcIP));
  const destIPs = countTop(packets.map((p) => p.destIP));
  const destPorts = countTop(packets.map((p) => p.destPort));
  const ttls = countTop(packets.map((p) => p.ttl));
  const entropyStats = countEntropy(packets);

  appState.chartTooltip.innerHTML = `
    <div class="tooltip-header">Time: ${entry.time.toLocaleString()}</div>
    <div class="tooltip-row">
      <span class="tooltip-label">Total Packets:</span>
      <span>${packets.length}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Severity:</span>
      <span>
        <span class="severity-high">${high} High</span>,
        <span class="severity-medium">${medium} Medium</span>,
        <span class="severity-low">${low} Low</span>
      </span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Top Protocols:</span>
      <span>${protocols}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Top Source IPs:</span>
      <span>${srcIPs}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Top Dest IPs:</span>
      <span>${destIPs}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Top Dest Ports:</span>
      <span>${destPorts}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">TTL Distribution:</span>
      <span>${ttls}</span>
    </div>
    <div class="tooltip-row">
      <span class="tooltip-label">Entropy Range:</span>
      <span>${entropyStats}</span>
    </div>
  `;

  appState.chartTooltip.style.display = "block";
  appState.currentPacketDetails = { row, clicked: true };
}
