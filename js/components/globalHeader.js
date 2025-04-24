/**
 * chart header component.
 * @param {string} globalHeader document header element.
 * @param {string} containerElement document global header container element
 */

export function displayGlobalHeader(globalHeader, containerElement) {
  if (!globalHeader) {
    containerElement.innerHTML = "No header information available.";
    return;
  }

  containerElement.innerHTML = `
      <h3>Global Header Properties</h3>
      <ul>
        <li><strong>Link Layer Type:</strong> ${
          globalHeader.linkLayerType || "N/A"
        }</li>
        <li><strong>Magic Number:</strong> ${
          globalHeader.magicNumber || "N/A"
        }</li>
        <li><strong>Max Capture Length:</strong> ${
          globalHeader.maxCaptureLength || "N/A"
        }</li>
        <li><strong>Timestamp Accuracy:</strong> ${
          globalHeader.timestampAccuracy || "N/A"
        }</li>
        <li><strong>Timezone Offset:</strong> ${
          globalHeader.timezoneOffset || "N/A"
        }</li>
        <li><strong>Version:</strong> ${globalHeader.version || "N/A"}</li>
      </ul>
    `;
}
