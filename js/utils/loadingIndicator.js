/**
 * create loading indicator
 * @return {object} indicator
 */
export function createLoadingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "loading-indicator";
  indicator.textContent = "Processing file...";
  return indicator;
}
