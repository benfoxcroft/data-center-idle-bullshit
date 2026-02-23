export interface CoreState {
  progress: number;
  flash: boolean;
}

export interface Contract {
  id: string;
  clientName: string;
  fileName: string;
  description: string;
  bytes: number;
  payout: number;
  tierLabel: string;
  urgent: boolean;
}

export interface ActiveContract extends Contract {
  bytesProcessed: number;
}

export interface GameState {
  bits: number;
  coreCount: number;
  opsLvl: number;
  bitLvl: number;
  coreLvl: number;
  coolingLvl: number;
  credits: number;
  totalEarned: number;
  contractsCompleted: number;
  cores: CoreState[];
  activeContract: ActiveContract | null;
  availableContracts: Contract[];
  tickerQueue: string[];
  heatSeconds: number;
}

export interface DisplayState {
  bits: number;
  coreCount: number;
  opsLvl: number;
  bitLvl: number;
  coreLvl: number;
  coolingLvl: number;
  credits: number;
  totalEarned: number;
  contractsCompleted: number;
  coreDisplays: { progress: number; counter: number; flash: boolean; idle: boolean; overheated: boolean }[];
  maxVal: number;
  processingRate: number;
  activeContract: ActiveContract | null;
  availableContracts: Contract[];
  tickerMsg: string;
  heatSeconds: number;
  overheatedCores: number;
}

export interface OpsEntry { speed: number; cost: number; label: string; }


export interface ContractTier {
  label: string;
  contractLevel: number;
  byteRange: [number, number];
  payPerByte: [number, number];
  clients: string[];
  fileNames: string[];
  descriptions: string[];
  urgentChance: number;
}

export interface CoolingEntry { thresholdSecs: number; cost: number; label: string; }
