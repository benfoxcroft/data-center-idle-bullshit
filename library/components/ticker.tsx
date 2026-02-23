"use client";   

export default function Ticker({ message }: { message: string }) {
  return (
    <div
      style={{
        borderTop: "1px solid #0d2a0d",
        paddingTop: "6px",
        marginTop: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        overflow: "hidden",
      }}
    >
      <span style={{ color: "#1e5a1e", fontSize: "10px", letterSpacing: "2px", whiteSpace: "nowrap" }}>▶ FEED</span>
      <span
        style={{
          color: "#4a8a4a",
          fontSize: "11px",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {message}
      </span>
    </div>
  );
}