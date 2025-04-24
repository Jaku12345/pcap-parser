import { handleFileSelect } from "../services/fileUpload.js";
import { DOM_ELEMENTS } from "../state.js";

/**
 * Initializes upload file event listeners
 */
export function initializeEventListeners() {
  if (DOM_ELEMENTS.victimFileInput) {
    DOM_ELEMENTS.victimFileInput.addEventListener("change", (event) =>
      handleFileSelect(event, "victim")
    );
  }

  if (DOM_ELEMENTS.attackerFileInput) {
    DOM_ELEMENTS.attackerFileInput.addEventListener("change", (event) =>
      handleFileSelect(event, "attacker")
    );
  }
}
