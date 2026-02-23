import { CoolingEntry } from "../types/types";

export const COOLING_TABLE: CoolingEntry[] = [
  { thresholdSecs: 30, cost: 0, label: "Raw Dog - No Cooling" },
  { thresholdSecs: 35, cost: 500, label: "some fan found in a dumpster" },
  { thresholdSecs: 40, cost: 5000, label: "Some Toothpaste, that's thermal paste, right?" },
  { thresholdSecs: 45, cost: 128000, label: "Budget cooler" },
  { thresholdSecs: 50, cost: 6e3, label: "Tower cooler" },
  { thresholdSecs: 55, cost: 6e4, label: "Liquid loop" },
  { thresholdSecs: 60, cost: 6e5, label: "Custom loop" },
  { thresholdSecs: 65, cost: 6e6, label: "Phase change" },
  { thresholdSecs: 70, cost: 6e7, label: "LN\u2082 rig" },
];