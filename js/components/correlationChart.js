import { pearsonCorrelation } from "../utils/pearsonCorrelations.js";
import { DOM_ELEMENTS } from "../state.js";

/**
 * Correlation chart component.
 * @param {array} victimData victim data info.
 * @param {array} attackerData attacker data info.
 */
export function renderCorrelationChart(victimData, attackerData) {
  try {
    const map = new Map();

    victimData.forEach(({ time, count }) => {
      const timeKey = +time;
      map.set(timeKey, { time, victim: count, attacker: 0 });
    });

    attackerData.forEach(({ time, count }) => {
      const timeKey = +time;
      if (map.has(timeKey)) {
        map.get(timeKey).attacker = count;
      } else {
        map.set(timeKey, { time, victim: 0, attacker: count });
      }
    });

    const alignedData = Array.from(map.values()).sort(
      (a, b) => a.time - b.time
    );

    const windowSize = 5;
    const correlationData = [];

    if (alignedData.length >= windowSize) {
      for (let i = windowSize - 1; i < alignedData.length; i++) {
        const slice = alignedData.slice(i - windowSize + 1, i + 1);
        const x = slice.map((d) => d.victim);
        const y = slice.map((d) => d.attacker);
        const corr = pearsonCorrelation(x, y);

        if (!isNaN(corr) && corr !== undefined) {
          correlationData.push([slice[windowSize - 1].time, corr]);
        }
      }
    }

    if (correlationData.length > 0) {
      new Dygraph(DOM_ELEMENTS.correlationChart, correlationData, {
        labels: ["Time", "Correlation"],
        title: "Victim vs Attacker Packet Count Correlation",
        ylabel: "Correlation",
        xlabel: "Time",
        strokeWidth: 2,
        colors: ["purple"],
        valueRange: [-1.05, 1.05],
        drawPoints: true,
        pointSize: 3,
        highlightCircleSize: 5,
        legend: "always",
        legendFormatter: (data) => {
          if (data.x === null || data.series[0].y === undefined)
            return "Correlation";

          const corr = data.series[0].y.toFixed(3);
          let strength = "None";

          if (corr > 0.7) strength = "Strong positive";
          else if (corr > 0.3) strength = "Moderate positive";
          else if (corr > -0.3) strength = "Weak/No correlation";
          else if (corr > -0.7) strength = "Moderate negative";
          else strength = "Strong negative";

          return `${new Date(data.x).toLocaleString()}: ${corr} (${strength})`;
        },
      });
    } else {
      DOM_ELEMENTS.correlationChart.innerHTML =
        "Insufficient data points for correlation analysis";
    }
  } catch (error) {
    console.error("Error rendering correlation chart:", error);
    DOM_ELEMENTS.correlationChart.innerHTML =
      "Error generating correlation analysis";
  }
}
