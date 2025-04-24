import { initializeEventListeners } from "../js/services/eventListeners.js";
import { appState } from "../js/state.js";

document.addEventListener("DOMContentLoaded", initializeEventListeners);

// Event listeners for chart click, for correct chart tool tip to display info.
// (Attacker => Attacker_tooltip), (Victim => Victim_tooltip)
// This approach is not recommended, since 2 event listeners take up more memory space than a single one,
// but because this is app does not have too much interactivity, this solution is acceptable.
document
  .getElementById("victimPacketChart")
  .addEventListener("mouseenter", () => {
    appState.chartTooltip = document.getElementById("victimChartTooltip");
  });

document
  .getElementById("attackerPacketChart")
  .addEventListener("mouseenter", () => {
    appState.chartTooltip = document.getElementById("attackerChartTooltip");
  });
