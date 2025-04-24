import { appState } from "../state.js";
import { handleChartClick } from "../services/chartClick.js";

/**
 * Chart component.
 * @param {array} data data info for graph paiting.
 * @param {string} tooltipElement document element in which the graph will be painted
 * @param {string} title graph title
 */
export function renderChart(data, tooltipElement, title) {
  appState.dygraph = new Dygraph(tooltipElement, data, {
    labels: ["Time", "Packet Count"],
    title: title || "Packet Frequency Over Time",
    ylabel: "Packet Count",
    xlabel: "Time",
    strokeWidth: 2,
    pointSize: 4,
    highlightCircleSize: 6,
    drawPoints: true,
    hideOverlayOnMouseOut: false,
    colors: ["#00A0B0"],
    axes: {
      y: { axisLabelWidth: 70 },
    },
    interactionModel: {
      ...Dygraph.defaultInteractionModel,
      click: handleChartClick,
    },
    drawPointCallback: (g, seriesName, ctx, cx, cy, color, pointSize, idx) => {
      ctx.fillStyle = appState.pointColors[idx] || color;
      ctx.beginPath();
      ctx.arc(cx, cy, pointSize, 0, 2 * Math.PI);
      ctx.fill();
    },
  });
}
