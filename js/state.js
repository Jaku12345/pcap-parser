export const DOM_ELEMENTS = {
  victimFileInput: document.getElementById("victimFileInput"),
  attackerFileInput: document.getElementById("attackerFileInput"),
  globalVictimHeaderContainer: document.getElementById(
    "globalVictimHeaderContainer"
  ),
  globalAttackerHeaderContainer: document.getElementById(
    "globalAttackerHeaderContainer"
  ),
  victimChartTooltip: document.getElementById("victimChartTooltip"),
  victimChartContainer: document.getElementById("victimPacketChart"),
  attackerChartContainer: document.getElementById("attackerPacketChart"),
  attackerChartTooltip: document.getElementById("attackerChartTooltip"),
  correlationChart: document.getElementById("correlationChart"),
  victimSection: document.querySelector(".victim-section"),
  attackerSection: document.querySelector(".attacker-section"),
};

export const appState = {
  dygraph: null,
  timeData: [],
  pointColors: [],
  currentPacketDetails: null,
  victimData: null,
  attackerData: null,
  chartTooltip: null,
  chartContainer: null,
};
