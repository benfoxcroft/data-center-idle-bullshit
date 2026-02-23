"use client"
import utilities from "../helpers/utilities";

interface UpgradeCardProps {
  title: string;
  icon: string;
  currentLabel: string;
  nextLabel: string | null;
  benefit: string | null;
  cost: number | null;
  credits: number;
  onBuy: () => void;
  eta: string | null;
  accent?: string;
}

export default function UpgradeCard({
  title,
  icon,
  currentLabel,
  nextLabel,
  benefit,
  cost,
  credits,
  onBuy,
  eta,
  accent,
}: UpgradeCardProps) {
  const maxed = cost === null;
  const canAfford = !maxed && cost != null && credits >= cost;
  const borderCol = maxed ? "#091509" : canAfford ? (accent ?? "#00cc41") : "#0d2a0d";

  return (
    <div style={{ border: `1px solid ${borderCol}`, padding: "12px", background: "#020602", borderRadius: "3px", transition: "border-color 0.3s" }}>
      <div style={{ borderBottom: "1px solid #0d1a0d", paddingBottom: "6px", marginBottom: "8px" }}>
        <span style={{ color: "#aaffaa", fontSize: "14px", letterSpacing: "3px", fontWeight: "bold" }}>
          {icon} {title}
        </span>
      </div>
      <div style={{ color: "#4a8a4a", fontSize: "12px", marginBottom: "2px" }}>{currentLabel}</div>
      {nextLabel && <div style={{ color: "#88cc88", fontSize: "12px", marginBottom: "2px" }}>{nextLabel} {benefit && <span style={{ color: accent ? accent + "88" : "#2a6a2a", fontSize: "12px", marginBottom: "10px" }}>({benefit})</span>}</div>}
      {maxed ? (
        <div style={{ color: "#1a3a1a", fontSize: "12px", letterSpacing: "3px" }}>■■ MAX LEVEL</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span style={{ color: canAfford ? "#ffff44" : "#3a3a1a", fontSize: "13px", fontWeight: "bold" }}>⬡ {utilities.fmt(cost ?? 0)}</span>
            {eta && !canAfford && <span style={{ color: "#2a4a2a", fontSize: "12px" }}>~{eta}</span>}
          </div>
          <button
            onClick={onBuy}
            disabled={!canAfford}
            style={{
              width: "100%",
              padding: "7px",
              background: canAfford ? "#002900" : "#080d08",
              color: canAfford ? "#00ff41" : "#1a3a1a",
              border: `1px solid ${canAfford ? borderCol : "#0d1a0d"}`,
              fontFamily: "'VT323', 'Courier New', monospace",
              fontSize: "13px",
              letterSpacing: "3px",
              cursor: canAfford ? "pointer" : "default",
              borderRadius: "2px",
              textShadow: canAfford ? "0 0 8px #00ff41" : "none",
            }}
          >
            {canAfford ? "[ INSTALL ]" : "[ LOCKED  ]"}
          </button>
        </>
      )}
    </div>
  );
}