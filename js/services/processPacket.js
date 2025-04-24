import { renderChart } from "../components/chart.js";
import { renderCorrelationChart } from "../components/correlationChart.js";
import { appState } from "../state.js";

/**
 * Processes the file data, sets data to corresponding victim or attacker,
 * initializes the needed data for graphs, paints the coreleation graph if both
 * attacker and victim files are uploaded
 * @param  {array} parsedPcapData parsed data from the pcap file
 * @param  {string} tooltipElement document element container for displaying each single packet data
 * @param  {string} chartTitle graph title
 * @param  {string} dataType allows for the app to know what type of data is currently needed to paint
 * @param  {string} chartElement document element container for displaying the graph
 */
export function processPacketData(
  parsedPcapData,
  tooltipElement,
  chartTitle,
  dataType,
  chartElement
) {
  appState.chartTooltip = tooltipElement;
  appState.chartContainer = chartElement;

  if (dataType === "victim") {
    appState.victimData = parsedPcapData;
  } else if (dataType === "attacker") {
    appState.attackerData = parsedPcapData;
  }

  appState.pointColors = [];
  const graphData = [];

  for (const item of parsedPcapData) {
    graphData.push([item.time, item.count]);

    // Calculate severity ratios
    const totalPackets = item.packets.length;
    if (totalPackets === 0) {
      appState.pointColors.push("blue");
      continue;
    }

    const highCount = item.packets.filter((p) => p.severity === "High").length;
    const mediumCount = item.packets.filter(
      (p) => p.severity === "Medium"
    ).length;

    if (highCount > totalPackets * 0.3) {
      appState.pointColors.push("red");
    } else if (mediumCount > totalPackets * 0.3) {
      appState.pointColors.push("gold");
    } else {
      appState.pointColors.push("green");
    }
  }

  renderChart(graphData, chartElement, chartTitle);

  if (appState.victimData && appState.attackerData) {
    renderCorrelationChart(appState.victimData, appState.attackerData);
  }
}
