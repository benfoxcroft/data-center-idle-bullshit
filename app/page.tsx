"use client";

import { useState, useEffect, useRef } from "react";
import { GameState, DisplayState } from "../library/types/types";
import { TICK_MS, OVERHEAT_SPEED_PENALTY, HEAT_DISSIPATE_RATE, VISUAL_HZ_CAP } from "../library/globals";
import utilities from "../library/helpers/utilities";
import { OPS_TABLE } from "@/library/objects/opsTable";
import { COOLING_TABLE } from "@/library/objects/coolingTable";
import Header from "@/library/components/ui/header";
import idleTickerMessages from "@/library/objects/tickerMsgs";
import ActiveContractPanel from "@/library/components/activeContractPanel";
import CoreDisplay from "@/library/components/coreDisplay";
import UpgradePanel from "@/library/components/ui/upgradePanel";
import ContractBoard from "@/library/components/ui/contractBoard";
import SplashScreen from "@/library/components/ui/splash";
import StatsStrip from "@/library/components/ui/statsStrip";

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const gs = useRef<GameState>({
    bits: 1,
    coreCount: 1,
    opsLvl: 0,
    bitLvl: 0,
    coreLvl: 0,
    coolingLvl: 0,
    credits: 0,
    totalEarned: 0,
    contractsCompleted: 0,
    cores: [{ progress: 0, flash: false }],
    activeContract: null,
    availableContracts: [],
    tickerQueue: ["System online. Awaiting first contract."],
    heatSeconds: 0,
  });

  const [disp, setDisp] = useState<DisplayState | null>(null);
  const [boot, setBoot] = useState<boolean>(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [contractUpgradeLevel, setContractUpgradeLevel] = useState<number>(0);

  // Boot sequence
  useEffect(() => {
    const lines = [
      "BIOS v1.0.0 initialising...",
      "Memory check: OK",
      "CPU detected: 1-BIT @ 0.1 Hz",
      "Core 0: ONLINE",
      "Contract engine: LOADING",
      "Network interface: READY",
      "Awaiting instructions...",
    ];
    let i = 0;
    const id = setInterval(() => {
      setBootLines((prev) => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) {
        clearInterval(id);
        setTimeout(() => setBoot(false), 600);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  // Generate initial contract pool once boot done
  useEffect(() => {
    if (!boot) {
      const s = gs.current;
      const rate = utilities.calcProcessingRate(OPS_TABLE[s.opsLvl].speed, s.coreCount, s.bits);
      s.availableContracts = utilities.generateContractPool(rate, contractUpgradeLevel);
    }
  }, [boot, contractUpgradeLevel]);

  // Ticker rotation
  const [tickerMsg, setTickerMsg] = useState("System online.");
  const tickerRef = useRef<string[]>(["System online. Awaiting first contract."]);
  useEffect(() => {
    const id = setInterval(() => {
      const queue = tickerRef.current;
      if (queue.length > 0) {
        setTickerMsg(queue[0]);
        tickerRef.current = queue.slice(1);
      } else {
        // Generate idle messages
        const s = gs.current;
        const rate = utilities.calcProcessingRate(OPS_TABLE[s.opsLvl].speed, s.coreCount, s.bits);
        const msgs = idleTickerMessages(s, rate);
        tickerRef.current = [utilities.pick(msgs)];
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Game loop
  useEffect(() => {
    if (boot) return;
    const id = setInterval(() => {
      const s = gs.current;
      const dt = TICK_MS / 1000;
      const speed = OPS_TABLE[s.opsLvl].speed;
      const stateCount = utilities.pow2(s.bits);
      const overheatThreshold = COOLING_TABLE[s.coolingLvl].thresholdSecs;

      // Heat: accumulate when active, dissipate when idle
      if (s.activeContract) {
        s.heatSeconds = Math.min(
          s.heatSeconds + dt,
          overheatThreshold * s.coreCount, // cap at all cores overheated
        );
      } else {
        s.heatSeconds = Math.max(0, s.heatSeconds - dt * HEAT_DISSIPATE_RATE);
      }

      // How many cores are currently cooked
      const overheatedCores = Math.min(Math.floor(s.heatSeconds / overheatThreshold), s.coreCount);
      const processingRate = utilities.calcProcessingRate(speed, s.coreCount, s.bits, overheatedCores);

      // Animate cores — only when a contract is active
      // Visual speed is capped so the counter stays readable at high clock rates

      const visualSpeed = Math.min(speed, VISUAL_HZ_CAP);
      for (let i = 0; i < s.cores.length; i++) {
        const c = s.cores[i];
        const coreOverheated = i < overheatedCores;
        if (s.activeContract) {
          const effectiveSpeed = coreOverheated ? visualSpeed * OVERHEAT_SPEED_PENALTY : visualSpeed;
          c.progress += effectiveSpeed * dt;
          c.flash = false;
          while (c.progress >= 1) {
            c.progress -= 1;
            c.flash = true;
          }
        } else {
          c.progress = 0;
          c.flash = false;
        }
      }

      // Ticker warning when a new core overheats
      if (s.activeContract && overheatedCores > 0) {
        const prev = Math.floor((s.heatSeconds - dt) / overheatThreshold);
        if (overheatedCores > prev && overheatedCores <= s.coreCount) {
          tickerRef.current.push(
            `⚠ CORE-${String(overheatedCores - 1).padStart(2, "0")} THERMAL THROTTLE — running at ${Math.round(OVERHEAT_SPEED_PENALTY * 100)}%`,
          );
        }
      }

      // Process active contract
      if (s.activeContract) {
        const bytesThisTick = processingRate * dt;
        s.activeContract.bytesProcessed = Math.min(s.activeContract.bytesProcessed + bytesThisTick, s.activeContract.bytes);

        if (s.activeContract.bytesProcessed >= s.activeContract.bytes) {
          const earned = s.activeContract.payout;
          s.credits += earned;
          s.totalEarned += earned;
          s.contractsCompleted++;

          tickerRef.current.push(
            `✓ ${s.activeContract.clientName} — ${utilities.fmt(earned)} credits received.`,
            `"${s.activeContract.fileName}" processed successfully.`,
          );

          s.availableContracts = utilities.generateContractPool(processingRate, contractUpgradeLevel);
          s.activeContract = null;
        }
      }

      const maxVal = stateCount - 1;

      setDisp({
        bits: s.bits,
        coreCount: s.coreCount,
        opsLvl: s.opsLvl,
        bitLvl: s.bitLvl,
        coreLvl: s.coreLvl,
        coolingLvl: s.coolingLvl,
        credits: s.credits,
        totalEarned: s.totalEarned,
        contractsCompleted: s.contractsCompleted,
        coreDisplays: s.cores.map((c, i) => ({
          progress: c.progress,
          counter: Math.min(Math.floor(c.progress * stateCount), maxVal),
          flash: c.flash,
          idle: !s.activeContract,
          overheated: i < overheatedCores,
        })),
        maxVal,
        processingRate,
        activeContract: s.activeContract ? { ...s.activeContract } : null,
        availableContracts: [...s.availableContracts],
        tickerMsg,
        heatSeconds: s.heatSeconds,
        overheatedCores,
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [boot, tickerMsg, contractUpgradeLevel]);

  // Boot screen
  if (boot) {
    return <SplashScreen bootLines={bootLines} />;
  }

  if (!disp) return null;

  const {
    bits,
    coreCount,
    opsLvl,
    bitLvl,
    coreLvl,
    credits,
    coolingLvl,
    heatSeconds,
    totalEarned,
    contractsCompleted,
    coreDisplays,
    processingRate,
    activeContract,
    availableContracts,
    overheatedCores,
  } = disp;

  const coreGridCols = coreCount <= 2 ? "1fr 1fr" : coreCount <= 4 ? "1fr 1fr" : "repeat(auto-fill, minmax(160px, 1fr))";

  return (
    <div
      style={{
        background: "#010301",
        color: "#00ff41",
        fontFamily: "'VT323', 'Courier New', monospace",
        minHeight: "100vh",
        padding: "16px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* CRT overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 998,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: #010301; }
        ::-webkit-scrollbar-thumb { background: #0d2a0d; }
        button:hover:not(:disabled) { filter: brightness(1.2); }
      `}</style>

      <Header credits={credits} contractsCompleted={contractsCompleted} totalEarned={totalEarned} tickerMsg={tickerMsg} />

      {/* ── BODY ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "16px" }}>
        {/* LEFT */}
        <div>
          <StatsStrip
            bits={bits}
            coreCount={coreCount}
            opsLvl={opsLvl}
            processingRate={processingRate}
            overheatedCores={overheatedCores}
            contractsCompleted={contractsCompleted}
          />

          <ActiveContractPanel contract={activeContract} processingRate={processingRate} />

          {/* Core grid */}
          <div style={{ display: "grid", gridTemplateColumns: coreGridCols, gap: "8px", marginBottom: "12px" }}>
            {coreDisplays.map((c, i) => (
              <CoreDisplay key={i} index={i} counter={c.counter} progress={c.progress} flash={c.flash} bits={bits} idle={c.idle} overheated={c.overheated} />
            ))}
          </div>

          {/* Contract board */}
          <ContractBoard
            credits={credits}
            gs={gs}
            tickerRef={tickerRef}
            availableContracts={availableContracts}
            activeContract={activeContract}
            contractUpgradeLevel={contractUpgradeLevel}
            setContractUpgradeLevel={setContractUpgradeLevel}
          />
        </div>

        {/* RIGHT — upgrades */}
        <UpgradePanel
          gs={gs}
          tickerRef={tickerRef}
          credits={credits}
          coolingLvl={coolingLvl}
          heatSeconds={heatSeconds}
          coreCount={coreCount}
          activeContract={activeContract}
          bits={bits}
          processingRate={processingRate}
          overheatedCores={overheatedCores}
          bitLvl={bitLvl}
          coreLvl={coreLvl}
          opsLvl={opsLvl}
          contractUpgradeLevel={contractUpgradeLevel}
        />
      </div>
    </div>
  );
}
