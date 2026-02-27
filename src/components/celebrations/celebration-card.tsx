"use client";

import type { CelebrationQueueItem } from "@/types/state";

interface CelebrationCardProps {
  celebration: CelebrationQueueItem;
  width?: number;
  height?: number;
  glowColor?: string;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Reusable card display for celebrations.
 * Shows the team card image (if available) or a placeholder with initials.
 * Includes a glow border effect using the team color.
 */
export function CelebrationCard({
  celebration,
  width = 240,
  height = 288,
  glowColor,
  borderColor,
  className = "",
  style = {},
}: CelebrationCardProps) {
  const glow = glowColor ?? celebration.team_color;
  const border = borderColor ?? glow;

  return (
    <div
      className={`relative overflow-hidden rounded-[16px] ${className}`}
      style={{
        width,
        height,
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: border,
        boxShadow: `0 0 30px ${glow}88, 0 0 60px ${glow}44, inset 0 0 20px ${glow}22`,
        backgroundColor: "var(--color-night-light)",
        ...style,
      }}
    >
      {celebration.card?.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={celebration.card.image_url}
          alt={`Card de ${celebration.team_name}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ backgroundColor: `${celebration.team_color}33` }}
        >
          <span
            className="font-[family-name:var(--font-display)] font-black text-white"
            style={{
              fontSize: Math.round(width * 0.35),
              textShadow: `0 0 20px ${celebration.team_color}88`,
            }}
          >
            {getInitials(celebration.team_name)}
          </span>
        </div>
      )}
    </div>
  );
}
