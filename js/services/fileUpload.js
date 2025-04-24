import { createLoadingIndicator } from "../utils/loadingIndicator.js";
import { initializeWorker } from "../services/worker.js";
import { DOM_ELEMENTS } from "../state.js";

/**
 * Handles file upload, sets containers for graph based on clicked button
 * @param  {object} event target the selected document element
 * @param  {string} type setting the victom/ attacker type based on file upload
 */
export function handleFileSelect(event, type) {
  if (!event.target.files || !event.target.files[0]) {
    console.log(`No file selected for ${type}`, "error");
    return;
  }

  const file = event.target.files[0];
  const containerElement =
    type === "victim"
      ? DOM_ELEMENTS.globalVictimHeaderContainer
      : DOM_ELEMENTS.globalAttackerHeaderContainer;

  const loadingIndicator = createLoadingIndicator();
  containerElement.innerHTML = "";
  containerElement.appendChild(loadingIndicator);

  initializeWorker(file, containerElement, type);
}
