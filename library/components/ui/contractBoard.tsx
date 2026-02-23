"use client";

import utilities from "@/library/helpers/utilities";
import { OPS_TABLE } from "@/library/objects/opsTable";
import { Contract, GameState } from "@/library/types/types";
import { getUpgradeCostForLevel } from "@/library/objects/enums/contractUpgradeCosts";
import { useCallback, RefObject, Dispatch, SetStateAction } from "react";
import ContractCard from "../contractCard";

interface ContracrtBoardProps {
  credits: number;
  gs: RefObject<GameState>;
  tickerRef: RefObject<string[]>;
  availableContracts: Contract[];
  activeContract: Contract | null;
  contractUpgradeLevel: number;
  setContractUpgradeLevel: Dispatch<SetStateAction<number>>;
}

export default function ContractBoard({
  credits,
  gs,
  tickerRef,
  availableContracts,
  activeContract,
  contractUpgradeLevel,
  setContractUpgradeLevel,
}: ContracrtBoardProps) {
  const acceptContract = useCallback(
    (contract: Contract) => {
      const s = gs.current;
      if (s.activeContract) return;
      // eslint-disable-next-line react-hooks/immutability
      s.activeContract = { ...contract, bytesProcessed: 0 };
      s.availableContracts = s.availableContracts.filter((c) => c.id !== contract.id);
      tickerRef.current.push(`Contract accepted: ${contract.clientName}`, `Processing "${contract.fileName}" — ${utilities.fmtBytes(contract.bytes)}`);
    },
    [gs, tickerRef],
  );

  const upgradeContractLevel = useCallback(() => {
    const s = gs.current;
    const upgradeCost = getUpgradeCostForLevel(contractUpgradeLevel);
    if (s.credits < upgradeCost || contractUpgradeLevel >= 6) return;
    // eslint-disable-next-line react-hooks/immutability
    s.credits -= upgradeCost;
    setContractUpgradeLevel(contractUpgradeLevel + 1);
    const rate = utilities.calcProcessingRate(OPS_TABLE[s.opsLvl].speed, s.coreCount, s.bits);
    s.availableContracts = utilities.generateContractPool(rate, contractUpgradeLevel + 1);
    tickerRef.current.push(`Contract level upgraded to ${contractUpgradeLevel + 1}.`);
  }, [gs, tickerRef, contractUpgradeLevel, setContractUpgradeLevel]);

  return (
    <div style={{ border: "1px solid #0d2a0d", padding: "12px", background: "#020602", borderRadius: "3px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ color: "#3a7a3a", fontSize: "14px", letterSpacing: "3px" }}>◆ CONTRACT BOARD</span>
        <button
          onClick={upgradeContractLevel}
          disabled={contractUpgradeLevel >= 6 || credits < getUpgradeCostForLevel(contractUpgradeLevel)}
          style={{
            padding: "4px 12px",
            background: "#010601",
            color: contractUpgradeLevel >= 6 || credits < getUpgradeCostForLevel(contractUpgradeLevel) ? "#5a2d2a" : "#00ff41",
            border: contractUpgradeLevel >= 6 || credits < getUpgradeCostForLevel(contractUpgradeLevel) ? "1px solid #5a2d2a" : "1px solid #00ff41",
            fontFamily: "'VT323', monospace",
            fontSize: "14px",
            letterSpacing: "2px",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          UPGRADE CONTRACT LEVEL [{utilities.fmt(getUpgradeCostForLevel(contractUpgradeLevel))}⬡]
        </button>
      </div>

      {availableContracts.length === 0 ? (
        <div style={{ color: "#1a3a1a", fontSize: "15px", textAlign: "center", padding: "20px" }}>No contracts available. Refresh the board.</div>
      ) : (
        availableContracts.map((contract) => <ContractCard key={contract.id} contract={contract} onAccept={acceptContract} isActive={!!activeContract} />)
      )}
    </div>
  );
}
