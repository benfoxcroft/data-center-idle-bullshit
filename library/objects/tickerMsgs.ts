import { GameState } from "../types/types";
import utilities from "../helpers/utilities";

export default function idleTickerMessages(state: GameState, processingRate: number): string[] {
  const msgs: string[] = [
    "Awaiting contract selection...",
    `Processing rate: ${utilities.fmtBytes(processingRate)}/s`,
    `${state.contractsCompleted} contract${state.contractsCompleted !== 1 ? "s" : ""} completed`,
    `Total credits earned: ${utilities.fmt(state.totalEarned)}`,
    "Select a contract to begin processing.",
  ];
  if (state.bits >= 8) msgs.push("8-BIT ARCHITECTURE ONLINE — clients are taking notice");
  if (state.bits >= 16) msgs.push("16-BIT ARCHITECTURE — you're in serious territory now");
  if (state.contractsCompleted >= 10) msgs.push("Reputation growing. Better clients incoming.");
  if (state.contractsCompleted >= 50) msgs.push("They're starting to ask for you by name.");
  if (state.coreCount >= 4) msgs.push(`Running ${state.coreCount} cores. Neighbours are complaining about the noise.`);
  if (state.coreCount >= 8) msgs.push("The cooling bill is becoming a problem.");
  if (processingRate >= 1e6) msgs.push("Processing at scale. Some clients are getting nervous.");
  return msgs;
}