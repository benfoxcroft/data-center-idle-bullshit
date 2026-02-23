"use client"
import { Contract } from "../types/types";
import utilities from "../helpers/utilities";
import { tierColors } from "../globals";

interface ContractCardProps {
  contract: Contract;
  onAccept: (c: Contract) => void;
  isActive: boolean;
}

export default function ContractCard({ contract, onAccept, isActive }: ContractCardProps) {
  const tierColor = tierColors[contract.tierLabel] ?? "#4a8a4a";

  return (
    <div
      style={{
        border: `1px solid ${contract.urgent ? "#5a3a0a" : "#0d2a0d"}`,
        padding: "12px",
        background: contract.urgent ? "#0a0602" : "#020602",
        borderRadius: "3px",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <div>
          <span style={{ color: tierColor, fontSize: "12px", letterSpacing: "2px" }}>[{contract.tierLabel.toUpperCase()}]</span>
          {contract.urgent && <span style={{ color: "#cc6600", fontSize: "9px", letterSpacing: "2px", marginLeft: "8px" }}>⚠ URGENT</span>}
        </div>
        <span style={{ color: "#ffff44", fontSize: "15px", fontWeight: "bold" }}>⬡ {utilities.fmt(contract.payout)}</span>
      </div>

      <div style={{ color: "#aaffaa", fontSize: "15px", letterSpacing: "1px", marginBottom: "2px" }}>{contract.clientName}</div>
      <div style={{ color: "#3a7a3a", fontSize: "13px", fontFamily: "'VT323', monospace", marginBottom: "4px" }}>{contract.fileName}</div>
      <div style={{ color: "#2a5a2a", fontSize: "15px", lineHeight: 1.4, marginBottom: "10px" }}>{contract.description}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#1e4a1e", fontSize: "12px" }}>{utilities.fmtBytes(contract.bytes)}</span>
        <button
          onClick={() => onAccept(contract)}
          disabled={isActive}
          style={{
            padding: "5px 16px",
            background: isActive ? "#080d08" : "#001a00",
            color: isActive ? "#1a3a1a" : "#00ff41",
            border: `1px solid ${isActive ? "#0d1a0d" : "#007a20"}`,
            fontFamily: "'VT323', 'Courier New', monospace",
            fontSize: "15px",
            letterSpacing: "3px",
            cursor: isActive ? "default" : "pointer",
            borderRadius: "2px",
          }}
        >
          {isActive ? "[ BUSY ]" : "[ ACCEPT ]"}
        </button>
      </div>
    </div>
  );
}