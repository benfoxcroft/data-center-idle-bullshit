export enum CONTRACT_UPGRADE_COSTS {
  MICRO = 500,
  SMALL = 5000,
  STANDARD = 256000,
  LARGE = 50000000,
  ENTERPRISE = 51200000000,
  CLASSIFIED = 512000000000,
}

export function getUpgradeCostForLevel(level: number): number {
  const costs = Object.values(CONTRACT_UPGRADE_COSTS).filter(
    (val) => typeof val === "number"
  );
  return costs[Math.min(level, costs.length - 1)] as number;
}
