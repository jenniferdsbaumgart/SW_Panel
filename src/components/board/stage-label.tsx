"use client";

import {
  Rocket,
  Lightbulb,
  Search,
  CheckCircle,
  Hammer,
  BadgeCheck,
  Mic,
  Trophy,
} from "lucide-react";
import type { StageDefinition } from "@/types/stages";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Rocket,
  Lightbulb,
  Search,
  CheckCircle,
  Hammer,
  BadgeCheck,
  Mic,
  Trophy,
};

interface StageLabelProps {
  stage: StageDefinition;
  teamCount: number;
}

export function StageLabel({ stage, teamCount }: StageLabelProps) {
  const IconComponent = ICON_MAP[stage.icon];
  const isHero = stage.id === "hero";
  const isMentor = stage.requiresMentor;

  // Nodo size: 80px base, hero gets 100px
  const nodeSize = isHero ? 100 : 80;
  const iconSize = isHero ? 40 : 32;

  return (
    <div className="flex flex-col items-center gap-[6px]">
      {/* Stage node - circular with icon */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${stage.color}40 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />

        {/* Main node */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: `${nodeSize}px`,
            height: `${nodeSize}px`,
            background: isHero
              ? "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)"
              : `linear-gradient(135deg, ${stage.color} 0%, ${stage.trailColor} 100%)`,
            boxShadow: `0 0 20px ${stage.color}50, inset 0 2px 4px rgba(255,255,255,0.2)`,
            border: isMentor ? "2px solid #BFFF0060" : "2px solid rgba(255,255,255,0.15)",
          }}
        >
          {IconComponent && (
            <div style={{ color: isHero ? "#0F0A1A" : "#FFFFFF" }}>
              <IconComponent
                size={iconSize}
                className="drop-shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Mentor indicator - small lime dot */}
        {isMentor && (
          <div
            className="absolute -right-[2px] -top-[2px] h-[14px] w-[14px] rounded-full"
            style={{
              backgroundColor: "#BFFF00",
              boxShadow: "0 0 8px #BFFF0080",
              border: "2px solid #0F0A1A",
            }}
          />
        )}

        {/* Team count badge */}
        {teamCount > 0 && (
          <div
            className="absolute -bottom-[4px] -right-[4px] flex h-[24px] w-[24px] items-center justify-center rounded-full font-[family-name:var(--font-body)] text-[12px] font-bold"
            style={{
              backgroundColor: "#7C3AED",
              color: "#FFFFFF",
              border: "2px solid #0F0A1A",
              boxShadow: "0 0 8px #7C3AED80",
            }}
          >
            {teamCount}
          </div>
        )}
      </div>

      {/* Stage name - smaller, elegant */}
      <span
        className="whitespace-nowrap font-[family-name:var(--font-display)] font-black uppercase leading-none tracking-wider"
        style={{
          fontSize: isHero ? "28px" : "20px",
          color: isHero ? "#FFD700" : "rgba(255,255,255,0.85)",
          textShadow: isHero
            ? "0 0 20px #FFD70060"
            : `0 0 12px ${stage.color}30`,
          letterSpacing: "0.12em",
        }}
      >
        {stage.name}
      </span>

      {/* Stage order number */}
      <span
        className="font-[family-name:var(--font-body)] text-[12px] leading-none"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {isHero ? "★" : `${stage.order + 1}/${8}`}
      </span>
    </div>
  );
}
