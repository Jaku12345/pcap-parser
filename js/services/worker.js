import { displayGlobalHeader } from "../components/globalHeader.js";
import { processPacketData } from "../services/processPacket.js";
import { appState, DOM_ELEMENTS } from "../state.js";

/**
 * Initializing the worker, setting the data based on whether attacker or victim file uploaded
 * @param  {object} file uploaded file
 * @param  {object} containerElement document element that contains the header of packet info display
 * @param  {string} graphType victim or attacker
 */
export function initializeWorker(file, containerElement, graphType) {
  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const arrayBuffer = event.target.result;
      const worker = new Worker("../js/parser/packetAnalysisWorker.js", {
        type: "module",
      });

      // Set timeout for worker termination in case of long-running tasks
      const workerTimeout = setTimeout(() => {
        worker.terminate();
        containerElement.innerHTML =
          "Processing timed out. Please try with a smaller file.";
        console.log("Worker processing timed out", "error");
      }, 30000); // 30 seconds timeout

      worker.onerror = (e) => {
        console.error("Worker error:", e);
        containerElement.innerHTML = "Error processing file.";
        console.log("Error in packet analysis worker", "error");
      };

      worker.onmessage = (e) => {
        try {
          console.time("parsing");
          const { packetsData, globalHeader } = e.data;
          console.timeEnd("parsing");
          console.time("drawing");

          if (!packetsData || !globalHeader) {
            throw new Error("Invalid data received from worker");
          }
          displayGlobalHeader(globalHeader, containerElement);

          // Process the data based on graph type
          appState.timeData = packetsData;

          if (graphType === "victim") {
            processPacketData(
              packetsData,
              DOM_ELEMENTS.victimChartTooltip,
              "Victim Packet Frequency",
              "victim",
              DOM_ELEMENTS.victimChartContainer
            );
          } else if (graphType === "attacker") {
            processPacketData(
              packetsData,
              DOM_ELEMENTS.attackerChartTooltip,
              "Attacker Packet Frequency",
              "attacker",
              DOM_ELEMENTS.attackerChartContainer
            );
          }
        } catch (error) {
          console.error("Error processing worker data:", error);
          console.log("Error processing packet data", "error");
        }
        console.timeEnd("drawing");
      };

      worker.postMessage(arrayBuffer);
    } catch (error) {
      console.error("Error initializing worker:", error);
      containerElement.innerHTML = "Error initializing packet analysis.";
      console.log("Failed to initialize packet analysis", "error");
    }
  };

  reader.onerror = function () {
    containerElement.innerHTML = "Error reading the file.";
    console.log("Error reading file", "error");
  };

  reader.readAsArrayBuffer(file);
}
