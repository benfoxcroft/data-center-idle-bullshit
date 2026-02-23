"use client";

interface SplashProps {
    bootLines: string[];
    }


export default function SplashScreen({ bootLines }: SplashProps) {
  return (
    <div
      style={{
        background: "#010301",
        color: "#00ff41",
        fontFamily: "'VT323', 'Courier New', monospace",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: "15px",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "420px", width: "100%" }}>
        <div style={{ color: "#00ff41", fontSize: "20px", marginBottom: "20px", letterSpacing: "4px", textShadow: "0 0 10px #00ff41" }}>
          ░▒▓ LOADING MAINFRAME ▓▒░
        </div>
        {bootLines.map((line, i) => (
          <div key={i} style={{ marginBottom: "4px", color: i === bootLines.length - 1 ? "#ffffff" : "#00aa2a" }}>
            &gt; {line}
          </div>
        ))}
        {bootLines.length > 0 && <span style={{ display: "inline-block", marginTop: "4px", animation: "blink 1s step-start infinite" }}>█</span>}
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
