"use client"
import utilities from "../helpers/utilities";

interface CoreDisplayProps {
  index: number;
  counter: number;
  progress: number;
  bits: number;
  flash: boolean;
  idle: boolean;
  overheated: boolean;
}

export default function CoreDisplay({
  index,
  counter,
  progress,
  bits,
  flash,
  idle,
  overheated,
}: CoreDisplayProps) {
  const str = idle ? utilities.displayCounter(0, bits) : utilities.displayCounter(counter, bits);
  const pct = idle ? 0 : Math.round(progress * 100);
  const fontSize = bits <= 4 ? 28 : bits <= 8 ? 22 : bits <= 12 ? 16 : bits <= 16 ? 13 : 11;

  const borderColor = idle ? "#2a0d0d" : overheated ? "#7a3a00" : flash ? "#00ff41" : "#0d2a0d";
  const bgColor = idle ? "#080303" : overheated ? "#100700" : flash ? "#051505" : "#030803";
  const textColor = idle ? "#4a1a1a" : overheated ? "#cc6600" : flash ? "#ffffff" : "#00ff41";
  const textShadow = idle ? "none" : overheated ? "0 0 6px #cc6600" : flash ? "0 0 10px #00ff41" : "0 0 4px #00aa2a";
  const barColor = idle ? "#2a0d0d" : overheated ? "#7a3a00" : pct > 85 ? "#00ff41" : "#007a20";

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        padding: "10px 12px",
        background: bgColor,
        borderRadius: "3px",
        transition: "border-color 0.15s, background 0.15s",
        minWidth: 0,
        fontFamily: "'VT323', 'Courier New', monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ color: idle ? "#3a1a1a" : "#1e4a1e", fontSize: "10px", letterSpacing: "1px" }}>CORE-{String(index).padStart(2, "0")}</span>
        <span style={{ color: idle ? "#3a1a1a" : overheated ? "#7a3a00" : "#2a5a2a", fontSize: "9px" }}>
          {idle ? "IDLE" : overheated ? "THROTTLE" : `${pct}%`}
        </span>
      </div>
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
          letterSpacing: bits <= 8 ? "4px" : "2px",
          wordBreak: "break-all",
          lineHeight: 1.2,
          minHeight: "32px",
          display: "flex",
          alignItems: "center",
          textShadow,
          transition: "color 0.1s",
        }}
      >
        {str}
      </div>
      <div style={{ marginTop: "8px", height: "3px", background: "#060f06", borderRadius: "2px", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: barColor,
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}
