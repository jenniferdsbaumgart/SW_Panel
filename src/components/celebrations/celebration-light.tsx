"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { CelebrationQueueItem } from "@/types/state";
import { CELEBRATION_DURATIONS } from "@/lib/constants";
import { STAGE_MAP } from "@/lib/constants";
import { CelebrationCard } from "./celebration-card";

interface CelebrationLightProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

/**
 * Level 1: "Neural Pulse" celebration (5s).
 * Theme: Neural network ripple emanating from the centered card.
 * - Card centered with team_color glow border
 * - Concentric rings expand outward like neural signals
 * - Small glowing dots pulse along the rings
 * - Team name below card, stage transition above
 * - Exit: card fades and scales down
 */
export function CelebrationLight({
  celebration,
  onComplete,
}: CelebrationLightProps) {
  const duration = CELEBRATION_DURATIONS[celebration.celebration_type] ?? 5000;
  const durationSec = duration / 1000;
  const color = celebration.team_color;

  const fromLabel =
    STAGE_MAP[celebration.from_stage]?.name ?? celebration.from_stage;
  const toLabel =
    STAGE_MAP[celebration.to_stage]?.name ?? celebration.to_stage;

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      className="pointer-events-none flex h-full w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dark overlay with violet radial gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, rgba(15,10,26,0.85) 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: durationSec,
          times: [0, 0.1, 0.75, 1],
        }}
      />

      {/* Concentric neural rings */}
      {[1, 2, 3, 4].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}44, inset 0 0 8px ${color}22`,
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0],
            scale: [0.3, 1.0 + ring * 0.5, 1.5 + ring * 0.6, 2.0 + ring * 0.7],
          }}
          transition={{
            duration: durationSec * 0.7,
            delay: ring * 0.25,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Neural dots pulsing along rings */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 180 + (i % 3) * 60;
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}, 0 0 20px ${color}88`,
            }}
            initial={{
              opacity: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 0.9, 0.5, 0],
              x: [0, Math.cos(angle) * radius],
              y: [0, Math.sin(angle) * radius],
            }}
            transition={{
              duration: durationSec * 0.6,
              delay: 0.3 + i * 0.08,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* Card + text content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-[20px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1.02, 1.0, 0.9],
        }}
        transition={{
          duration: durationSec * 0.9,
          times: [0, 0.15, 0.75, 1],
          ease: "easeOut",
        }}
      >
        {/* Stage transition text above card */}
        <span
          className="font-[family-name:var(--font-body)] text-white/50 uppercase tracking-[4px]"
          style={{ fontSize: "var(--text-panel-small)" }}
        >
          {fromLabel} {"\u2192"} {toLabel}
        </span>

        {/* Centered card */}
        <CelebrationCard
          celebration={celebration}
          glowColor={color}
        />

        {/* Team name below card */}
        <span
          className="font-[family-name:var(--font-display)] font-black text-white"
          style={{
            fontSize: 48,
            textShadow: `0 0 40px ${color}88, 0 0 80px ${color}44`,
          }}
        >
          {celebration.team_name}
        </span>
      </motion.div>
    </motion.div>
  );
}
