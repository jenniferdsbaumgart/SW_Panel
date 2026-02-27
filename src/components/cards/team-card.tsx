"use client";

import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import type { TeamState } from "@/types/state";
import { CardImage } from "./card-image";
import { CardPlaceholder } from "./card-placeholder";
import {
  cardVariants,
  cardTransitions,
  getStateBorderStyle,
} from "./card-states";

interface TeamCardProps {
  team: TeamState;
  cardWidth: number;
  cardHeight: number;
}

export function TeamCard({ team, cardWidth, cardHeight }: TeamCardProps) {
  const border = getStateBorderStyle(team.visual_state, team.team_color);
  const nameSize = cardWidth >= 120 ? 14 : cardWidth >= 100 ? 12 : 10;
  const transition = cardTransitions[team.visual_state];
  const isHero = team.is_hero;
  const isPivoted = team.visual_state === "pivoted";

  return (
    <motion.div
      layoutId={team.team_id}
      className="relative flex flex-col items-center gap-[8px]"
      style={{
        width: `${cardWidth}px`,
      }}
      variants={cardVariants}
      animate={team.visual_state}
      transition={{
        layout: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
        ...transition,
      }}
    >
      {/* Card frame */}
      <div
        className="relative overflow-hidden rounded-[12px] p-[6px]"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          borderWidth: `${border.borderWidth}px`,
          borderStyle: border.borderStyle,
          borderColor: border.borderColor,
          boxShadow: border.boxShadow,
          backgroundColor: "var(--color-night-light)",
          animation:
            team.visual_state === "waiting"
              ? "pulse-waiting 2s ease-in-out infinite"
              : "none",
        }}
      >
        {team.card?.image_url ? (
          <CardImage
            imageUrl={team.card.image_url}
            teamName={team.team_name}
            teamColor={team.team_color}
            width={cardWidth - 12}
            height={cardHeight - 12}
          />
        ) : (
          <CardPlaceholder
            teamName={team.team_name}
            teamColor={team.team_color}
            width={cardWidth - 12}
            height={cardHeight - 12}
          />
        )}

        {/* Pivoted icon overlay */}
        {isPivoted && (
          <div
            className="absolute right-[4px] top-[4px] flex items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(129, 140, 248, 0.9)",
            }}
          >
            <RotateCcw size={14} color="#FFFFFF" strokeWidth={2.5} />
          </div>
        )}

        {/* Hero trophy badge */}
        {isHero && (
          <div
            className="absolute right-[4px] top-[4px] flex items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(255, 215, 0, 0.95)",
              boxShadow: "0 0 12px rgba(255, 215, 0, 0.6)",
            }}
          >
            <Trophy size={14} color="#0F0A1A" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Team name */}
      <span
        className="max-w-full truncate text-center font-[family-name:var(--font-display)] font-black"
        style={{
          fontSize: `${nameSize}px`,
          color: isHero ? "#FFD700" : "#FFFFFF",
          textShadow: isHero
            ? "0 0 20px rgba(255, 215, 0, 0.5)"
            : undefined,
        }}
      >
        {team.team_name}
      </span>
    </motion.div>
  );
}
