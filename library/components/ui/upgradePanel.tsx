"use client";

import UpgradeCard from "../upgradeCard";
import utilities from "../../helpers/utilities";
import { BIT_COSTS, CORE_COSTS, HEAT_DISSIPATE_RATE } from "@/library/globals";
import { OPS_TABLE } from "@/library/objects/opsTable";
import { COOLING_TABLE } from "@/library/objects/coolingTable";
import { ActiveContract, CoolingEntry, GameState, OpsEntry } from "@/library/types/types";
import { useCallback, RefObject } from "react";

interface UpgradePanelProps {
  gs: RefObject<GameState>;
  tickerRef: RefObject<string[]>;
  credits: number;
  coolingLvl: number;
  heatSeconds: number;
  coreCount: number;
  activeContract: ActiveContract | null;
  bits: number;
  processingRate: number;
  overheatedCores: number;
  bitLvl: number;
  coreLvl: number;
  opsLvl: number;
  contractUpgradeLevel: number;
}
export default function UpgradePanel({ gs, tickerRef, credits, coolingLvl, heatSeconds, coreCount, activeContract, bits, processingRate, overheatedCores, bitLvl, coreLvl, opsLvl, contractUpgradeLevel }: UpgradePanelProps) {
  const buyBit = useCallback(() => {
    const s = gs.current;
    if (s.bitLvl >= BIT_COSTS.length) return;
    const cost = BIT_COSTS[s.bitLvl];
    if (s.credits < cost) return;
    // eslint-disable-next-line react-hooks/immutability
    s.credits -= cost;
    s.bits++;
    s.bitLvl++;
    s.cores.forEach((c) => {
      c.progress = 0;
      c.flash = false;
    });
    const rate = utilities.calcProcessingRate(OPS_TABLE[s.opsLvl].speed, s.coreCount, s.bits);
    s.availableContracts = utilities.generateContractPool(rate, contractUpgradeLevel);
    tickerRef.current.push(`Bit width upgraded to ${s.bits}-bit.`, `New architecture online. Contract board refreshed.`);
  }, [gs, tickerRef, contractUpgradeLevel]);

  const buyCore = useCallback(() => {
    const s = gs.current;
    if (s.coreLvl >= CORE_COSTS.length) return;
    const cost = CORE_COSTS[s.coreLvl];
    if (s.credits < cost) return;
    // eslint-disable-next-line react-hooks/immutability
    s.credits -= cost;
    s.coreCount++;
    s.coreLvl++;
    s.cores.push({ progress: 0, flash: false });
    tickerRef.current.push(`Core ${s.coreCount - 1} online. Processing speed increased.`);
  }, [gs, tickerRef]);

  const buyOps = useCallback(() => {
    const s = gs.current;
    const next = s.opsLvl + 1;
    if (next >= OPS_TABLE.length) return;
    const cost = OPS_TABLE[next].cost;
    if (s.credits < cost) return;
    // eslint-disable-next-line react-hooks/immutability
    s.credits -= cost;
    s.opsLvl = next;
    tickerRef.current.push(`Clock speed upgraded to ${OPS_TABLE[next].label}.`);
  }, [gs, tickerRef]);

  const buyCooling = useCallback(() => {
    const s = gs.current;
    const next = s.coolingLvl + 1;
    if (next >= COOLING_TABLE.length) return;
    const cost = COOLING_TABLE[next].cost;
    if (s.credits < cost) return;
    // eslint-disable-next-line react-hooks/immutability
    s.credits -= cost;
    s.coolingLvl = next;
    tickerRef.current.push(`Cooling upgraded: ${COOLING_TABLE[next].label}.`, `Overheat threshold now ${COOLING_TABLE[next].thresholdSecs}s per core.`);
  }, [gs, tickerRef]);

  const overheatThreshold = COOLING_TABLE[coolingLvl].thresholdSecs;

  const heatPct = Math.min((heatSeconds / (overheatThreshold * coreCount)) * 100, 100);

  const etaFor = (cost: number | null | undefined): string | null => {
    if (!cost || credits >= cost) return null;
    // No passive income, so no ETA unless active contract
    if (!activeContract) return null;
    const timeToComplete = activeContract ? (activeContract.bytes - activeContract.bytesProcessed) / processingRate : 0;
    const creditsOnComplete = credits + activeContract.payout;
    if (creditsOnComplete >= cost) return utilities.fmtETA(timeToComplete);
    return null;
  };

  const nextBitCost: number | null = bitLvl < BIT_COSTS.length ? BIT_COSTS[bitLvl] : null;
  const nextCoreCost: number | null = coreLvl < CORE_COSTS.length ? CORE_COSTS[coreLvl] : null;
  const nextOps: OpsEntry | null = opsLvl + 1 < OPS_TABLE.length ? OPS_TABLE[opsLvl + 1] : null;
  const nextCooling: CoolingEntry | null = coolingLvl + 1 < COOLING_TABLE.length ? COOLING_TABLE[coolingLvl + 1] : null;
  let heatPanel = "#240101"
  if (overheatedCores === coreCount) {
    heatPanel = "#bd2020";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      

      {/* Heat gauge */}
      <div style={{ border: `1px solid ${heatPanel}`, padding: "10px 12px", background: "#080302", borderRadius: "3px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ color: heatPanel, fontSize: "13px", letterSpacing: "2px" }}>◆ THERMALS</span>
          <span style={{ color: overheatedCores > 0 ? "#cc6600" : "#1e3a1e", fontSize: "10px" }}>
            {overheatedCores > 0 ? `${overheatedCores} CORE${overheatedCores > 1 ? "S" : ""} THROTTLED` : "NOMINAL"}
          </span>
        </div>
        <div style={{ height: "6px", background: "#0d0302", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
          <div
            style={{
              height: "100%",
              width: `${heatPct}%`,
              background: heatPct > 66 ? "#cc2200" : heatPct > 33 ? "#cc6600" : "#447a22",
              boxShadow: heatPct > 66 ? "0 0 6px #cc2200" : "none",
              transition: "width 0.1s linear, background 0.5s",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#2a1a1a", fontSize: "12px" }}>COOL</span>
          <span style={{ color: heatPct > 50 ? "#cc6600" : "#2a3a1a", fontSize: "12px" }}>{heatPct.toFixed(0)}% thermal load</span>
          <span style={{ color: "#2a1a1a", fontSize: "12px" }}>HOT</span>
        </div>
        <div style={{ marginTop: "6px", color: "#1e2e1e", fontSize: "12px", lineHeight: 1.6 }}>
          Idle to cool down. Dissipates {HEAT_DISSIPATE_RATE}× faster than buildup.
        </div>
      </div>

      <div style={{ color: "#2a5a2a", fontSize: "10px", letterSpacing: "4px", marginBottom: "2px" }}>◆ UPGRADE PATHS</div>

      <UpgradeCard
        icon="▓"
        title="BIT WIDTH"
        accent="#00ddff"
        currentLabel={`${bits}-bit  ·  ${utilities.fmtBytes(processingRate)}/s`}
        nextLabel={nextBitCost != null ? `→ ${bits + 1}-bit` : null}
        benefit={nextBitCost != null ? `2× processing rate` : null}
        cost={nextBitCost}
        credits={credits}
        onBuy={buyBit}
        eta={etaFor(nextBitCost)}
      />

      <UpgradeCard
        icon="◈"
        title="PARALLEL CORES"
        accent="#ff8844"
        currentLabel={`${coreCount} core${coreCount > 1 ? "s" : ""} active`}
        nextLabel={nextCoreCost != null ? `→ ${coreCount + 1} cores` : null}
        benefit={nextCoreCost != null ? `+${Math.round(100 / coreCount)}% throughput` : null}
        cost={nextCoreCost}
        credits={credits}
        onBuy={buyCore}
        eta={etaFor(nextCoreCost)}
      />

      <UpgradeCard
        icon="⚡"
        title="CLOCK SPEED"
        accent="#ffff44"
        currentLabel={`${OPS_TABLE[opsLvl].label}`}
        nextLabel={nextOps ? `→ ${nextOps.label}` : null}
        benefit={nextOps ? `${((nextOps.speed / OPS_TABLE[opsLvl].speed - 1) * 100).toFixed(0)}% faster` : null}
        cost={nextOps?.cost ?? null}
        credits={credits}
        onBuy={buyOps}
        eta={etaFor(nextOps?.cost)}
      />

      <UpgradeCard
        icon="🌡"
        title="COOLING"
        accent="#ff4444"
        currentLabel={`${COOLING_TABLE[coolingLvl].label}  ·  ${overheatThreshold}s/core`}
        nextLabel={nextCooling ? `→ ${nextCooling.label}  (${nextCooling.thresholdSecs}s/core)` : null}
        benefit={nextCooling ? `+${nextCooling.thresholdSecs - overheatThreshold}s before first throttle` : null}
        cost={nextCooling?.cost ?? null}
        credits={credits}
        onBuy={buyCooling}
        eta={etaFor(nextCooling?.cost)}
      />

      
    </div>
  );
}
