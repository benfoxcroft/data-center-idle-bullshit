"use client";

import utilities from "@/library/helpers/utilities";
import { OPS_TABLE } from "@/library/objects/opsTable";

interface StatsStripProps {
  bits: number;
  coreCount: number;
  opsLvl: number;
  processingRate: number;
  overheatedCores: number;
  contractsCompleted: number;
}

export default function StatsStrip({ bits, coreCount, opsLvl, processingRate, overheatedCores, contractsCompleted }: StatsStripProps) {
  const statsStrip: [string, string][] = [
    ["ARCH", `${bits}-BIT`],
    ["CORES", String(coreCount)],
    ["CLOCK", OPS_TABLE[opsLvl].label],
    ["THRU", `${utilities.fmtBytes(processingRate)}/s`],
    ["TEMP", overheatedCores > 0 ? `${overheatedCores}/${coreCount} HOT` : "OK"],
    ["DONE", String(contractsCompleted)],
  ];
  return (
    <div style={{ display: "flex", marginBottom: "12px", border: "1px solid #0d2a0d", background: "#020602", overflow: "hidden" }}>
      {statsStrip.map(([k, v]) => (
        <div key={k} style={{ flex: 1, padding: "7px 8px", borderRight: "1px solid #0d1a0d", textAlign: "center" }}>
          <div style={{ color: "#2a5a2a", fontSize: "8px", letterSpacing: "2px" }}>{k}</div>
          <div style={{ color: "#88cc88", fontSize: "13px", marginTop: "2px" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}
