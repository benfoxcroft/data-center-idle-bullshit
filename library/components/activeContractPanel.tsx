"use client";

import { tierColors } from "../globals";
import utilities from "../helpers/utilities";
import { ActiveContract } from "../types/types";

interface ActiveContractPanelProps {
  contract: ActiveContract | null;
  processingRate: number;
}

export default function ActiveContractPanel({ contract, processingRate }: ActiveContractPanelProps) {
  if (!contract)
    return (
      <div style={{ border: "1px solid #0a1a0a", padding: "14px", background: "#020402", borderRadius: "3px", marginBottom: "12px", textAlign: "center" }}>
        <div style={{ color: "#1e4a1e", fontSize: "16px", letterSpacing: "3px", marginBottom: "4px" }}>◆ NO ACTIVE CONTRACT</div>
        <div style={{ color: "#1a3a1a", fontSize: "14px" }}>Select a contract below to begin processing.</div>
      </div>
    );

  const pct = contract.bytes > 0 ? (contract.bytesProcessed / contract.bytes) * 100 : 0;
  const remaining = contract.bytes - contract.bytesProcessed;
  const eta = processingRate > 0 ? utilities.fmtETA(remaining / processingRate) : null;
  const tierColor = tierColors[contract.tierLabel] ?? "#4a8a4a";

  return (
    <div
      style={{
        border: `1px solid ${contract.urgent ? "#6a4a0a" : "#0d4a0d"}`,
        padding: "14px",
        background: contract.urgent ? "#0c0803" : "#030a03",
        borderRadius: "3px",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ color: "#aaffaa", fontSize: "11px", letterSpacing: "3px" }}>◆ ACTIVE CONTRACT</span>
        <span style={{ color: tierColor, fontSize: "9px", letterSpacing: "2px" }}>
          [{contract.tierLabel.toUpperCase()}]{contract.urgent ? " ⚠ URGENT" : ""}
        </span>
      </div>

      <div style={{ color: "#ccffcc", fontSize: "14px", marginBottom: "2px" }}>{contract.clientName}</div>
      <div style={{ color: "#3a8a3a", fontSize: "11px", fontFamily: "'VT323', monospace", marginBottom: "4px" }}>{contract.fileName}</div>
      <div style={{ color: "#2a5a2a", fontSize: "10px", marginBottom: "12px", lineHeight: 1.4 }}>{contract.description}</div>

      {/* Progress bar */}
      <div style={{ height: "8px", background: "#060f06", borderRadius: "2px", overflow: "hidden", position: "relative", marginBottom: "6px" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: pct > 90 ? "#00ff41" : contract.urgent ? "#cc8800" : "#007a20",
            boxShadow: pct > 90 ? "0 0 8px #00ff41" : "none",
            transition: "width 0.05s linear, background 0.3s",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ color: "#2a6a2a", fontSize: "10px" }}>
          {utilities.fmtBytes(contract.bytesProcessed)} / {utilities.fmtBytes(contract.bytes)}
        </span>
        <span style={{ color: pct > 90 ? "#00ff41" : "#4a8a4a", fontSize: "12px", fontWeight: "bold" }}>{pct.toFixed(1)}%</span>
        <span style={{ color: "#1e4a1e", fontSize: "10px" }}>{eta ? `~${eta}` : "—"}</span>
      </div>

      <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #0d2a0d", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#2a5a2a", fontSize: "10px" }}>PAYOUT ON COMPLETION</span>
        <span style={{ color: "#ffff44", fontSize: "13px" }}>⬡ {utilities.fmt(contract.payout)}</span>
      </div>
    </div>
  );
}
