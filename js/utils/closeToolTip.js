import { appState } from "../state.js";

/**
 * Closes the tooltip
 */
export function closeTooltip() {
  if (appState.chartTooltip) {
    appState.chartTooltip.style.display = "none";
  }

  if (appState.currentPacketDetails) {
    appState.currentPacketDetails.clicked = false;
  }
}
