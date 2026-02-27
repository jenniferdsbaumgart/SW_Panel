"use client";

import { AnimatePresence } from "framer-motion";
import type { TeamState } from "@/types/state";
import { TeamCard } from "./team-card";

interface CardsClusterProps {
  teams: TeamState[];
}

/**
 * Organizes N cards in a stage area.
 * - 1 card: centered, 120x144px
 * - 2-3 cards: side by side, 120x144px
 * - 4 cards: 2x2 grid, 100x120px
 * - 5-8 cards: grid 3xN, 85x102px
 */
function getCardDimensions(count: number): {
  width: number;
  height: number;
  cols: number;
} {
  if (count <= 2) {
    return { width: 120, height: 144, cols: Math.min(count, 2) };
  }
  if (count <= 4) {
    return { width: 100, height: 120, cols: 2 };
  }
  return { width: 85, height: 102, cols: 3 };
}

export function CardsCluster({ teams }: CardsClusterProps) {
  if (teams.length === 0) return null;

  const { width, height, cols } = getCardDimensions(teams.length);

  return (
    <div
      className="flex flex-wrap items-start justify-center gap-[12px]"
      style={{
        maxWidth: `${cols * (width + 12) + 12}px`,
      }}
    >
      <AnimatePresence mode="popLayout">
        {teams.map((team) => (
          <TeamCard
            key={team.team_id}
            team={team}
            cardWidth={width}
            cardHeight={height}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
