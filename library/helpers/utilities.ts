import { OVERHEAT_SPEED_PENALTY } from "../globals";
import { CONTRACT_TIERS } from "../objects/contractTiers";
import { Contract } from "../types/types";

let contractIdCounter = 0;
function makeId(): string {
  return `c${++contractIdCounter}`;
}

function fmt(n: number): string {
  if (!isFinite(n) || n < 0) return "0";
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "P";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "G";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return Math.floor(n).toLocaleString();
}

function fmtBytes(b: number): string {
  if (b >= 1073741824) return (b / 1073741824).toFixed(2) + " GB";
  if (b >= 1048576) return (b / 1048576).toFixed(2) + " MB";
  if (b >= 1024) return (b / 1024).toFixed(1) + " KB";
  return Math.floor(b) + " B";
}

function fmtETA(sec: number): string | null {
  if (!isFinite(sec) || sec <= 0) return null;
  if (sec < 60) return `${Math.ceil(sec)}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${Math.ceil(sec % 60)}s`;
  return `${Math.floor(sec / 3600)}h`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function toBin(val: number, bits: number): string {
  const s = Math.floor(Math.max(0, val)).toString(2).padStart(bits, "0");
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 4 === 0) out += " ";
    out += s[i];
  }
  return out;
}

function toHex(val: number, bits: number): string {
  return (
    "0x" +
    Math.floor(Math.max(0, val))
      .toString(16)
      .toUpperCase()
      .padStart(Math.ceil(bits / 4), "0")
  );
}

function displayCounter(val: number, bits: number): string {
  return bits <= 16 ? toBin(val, bits) : toHex(val, bits);
}

function pow2(n: number) {
  return Math.pow(2, n);
}

function calcProcessingRate(speed: number, cores: number, bits: number, overheatedCores = 0): number {
  const normalCores = cores - overheatedCores;
  return speed * (normalCores + overheatedCores * OVERHEAT_SPEED_PENALTY) * utilities.pow2(bits);
}

function generateContract(processingRate: number, contractLevel: number): Contract {
  const unlockedTier = CONTRACT_TIERS.filter((t) => t.contractLevel === contractLevel);
  const tier = unlockedTier[0] || CONTRACT_TIERS[0];

  const bytes = Math.floor(utilities.randRange(tier.byteRange[0], tier.byteRange[1]));
  const urgent = Math.random() < tier.urgentChance;
  const payCalc = Math.floor(utilities.randRange(tier.payPerByte[0], tier.payPerByte[1]) * 100) / 100;
  let payout = Math.floor(bytes * payCalc * (urgent ? utilities.randRange(1.6, 2.4) : 1.0));

  if (payout < 1) {
    payout = 1;
  }

  return {
    id: utilities.makeId(),
    clientName: utilities.pick(tier.clients),
    fileName: utilities.pick(tier.fileNames),
    description: utilities.pick(tier.descriptions),
    bytes,
    payout,
    tierLabel: tier.label,
    urgent,
  };
}

function generateContractPool(processingRate: number, contractLevel: number): Contract[] {
  return [generateContract(processingRate, contractLevel), generateContract(processingRate, contractLevel), generateContract(processingRate, contractLevel)];
}

const utilities = {
  makeId,
  fmt,
  fmtBytes,
  fmtETA,
  pick,
  randRange,
  toBin,
  toHex,
  displayCounter,
  pow2,
  calcProcessingRate,
  generateContractPool,
};

export default utilities;
