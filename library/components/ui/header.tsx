"use client";

import utilities from "@/library/helpers/utilities";
import Ticker from "../ticker";

interface HeaderProps {
    credits: number;
    contractsCompleted: number;
    totalEarned: number;
    tickerMsg: string;
}

export default function Header({credits, contractsCompleted, totalEarned, tickerMsg}: HeaderProps) {
    return (
        <div style={{ borderBottom: "1px solid #0d2a0d", paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "6px", textShadow: "0 0 12px #00ff41", lineHeight: 1 }}>░▒▓ DATA CENTER MANAGER ▓▒░</div>
            <div style={{ color: "#2a5a2a", fontSize: "11px", letterSpacing: "4px", marginTop: "2px" }}>The shittest idler tycoon game ever</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "34px", color: "#ffff00", lineHeight: 1, textShadow: "0 0 12px #ffff00aa", letterSpacing: "2px" }}>
              ⬡ {utilities.fmt(credits)}
            </div>
            <div style={{ color: "#4a8a4a", fontSize: "11px" }}>
              CREDITS &nbsp;·&nbsp; {contractsCompleted} completed &nbsp;·&nbsp; {utilities.fmt(totalEarned)} total
            </div>
          </div>
        </div>
        <Ticker message={tickerMsg} />
      </div>
    )
}