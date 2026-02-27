"use client";

import { STAGES } from "@/lib/constants";
import { StageNode } from "./stage-node";

/**
 * Board game winding trail layout.
 * Stages positioned along an organic curved path using SVG.
 * Aspect ratio 2:1 (wider than tall).
 *
 * Path flows like a neural circuit / board game trail:
 *
 *   ZERO ──╮
 *          ╰──→ IDEIA
 *                  ╰──╮
 *        VALIDAÇÃO ←──╯
 *          ╰──╮
 *             ╰──→ MVP
 *                    ╰──╮
 *         SOL.VALID ←───╯
 *            ╰──╮
 *               ╰──→ PITCH ──→ ★ HERO
 */

// Stage positions as % of container (x, y)
// Arranged in a winding spiral path ending in the center
export const STAGE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 10, y: 18 },    // 0 ZERO        — top-left start
  { x: 40, y: 12 },    // 1 IDEIA       — up mid-right
  { x: 75, y: 22 },    // 2 PROBLEMA    — top-right
  { x: 86, y: 50 },    // 3 VALIDAÇÃO   — mid-right edge
  { x: 60, y: 80 },    // 4 MVP         — bottom mid-right
  { x: 25, y: 75 },    // 5 SOL.VALID   — bottom-left
  { x: 14, y: 45 },    // 6 PITCH       — mid-left edge
  { x: 50, y: 48 },    // 7 HERO        — center finale
];

// SVG cubic bezier control points for smooth curves between stages
function buildPathD(): string {
  const p = STAGE_POSITIONS;
  const s = (pct: { x: number; y: number }) => `${pct.x} ${pct.y}`;

  // Build a smooth continuous bezier path with calculated collinear tangents
  let d = `M ${s(p[0])}`;

  // ZERO → IDEIA (moving right, curving gently up)
  d += ` C ${p[0].x + 10} ${p[0].y}, ${p[1].x - 10} ${p[1].y + 2}, ${s(p[1])}`;

  // IDEIA → PROBLEMA (arcing over the top right corner)
  d += ` C ${p[1].x + 15} ${p[1].y - 2}, ${p[2].x - 10} ${p[2].y - 5}, ${s(p[2])}`;

  // PROBLEMA → VALIDAÇÃO (curving down the right edge)
  d += ` C ${p[2].x + 10} ${p[2].y + 5}, ${p[3].x + 2} ${p[3].y - 15}, ${s(p[3])}`;

  // VALIDAÇÃO → MVP (arcing around the bottom right corner)
  d += ` C ${p[3].x - 2} ${p[3].y + 15}, ${p[4].x + 15} ${p[4].y + 5}, ${s(p[4])}`;

  // MVP → SOL.VALIDADA (moving left along the bottom)
  d += ` C ${p[4].x - 15} ${p[4].y - 5}, ${p[5].x + 15} ${p[5].y}, ${s(p[5])}`;

  // SOL.VALIDADA → PITCH (arcing up the left edge)
  d += ` C ${p[5].x - 10} ${p[5].y}, ${p[6].x - 2} ${p[6].y + 15}, ${s(p[6])}`;

  // PITCH → HERO (sweeping from left edge into the center)
  d += ` C ${p[6].x + 2} ${p[6].y - 15}, ${p[7].x - 15} ${p[7].y - 5}, ${s(p[7])}`;

  return d;
}

export function JourneyTrack() {
  const pathD = buildPathD();

  return (
    <div className="relative h-full w-full" style={{ zIndex: 10 }}>
      {/* Title bar */}
      <div
        className="absolute left-[48px] top-[24px] flex items-center gap-[16px]"
        style={{ zIndex: 15 }}
      >
        <span
          className="font-[family-name:var(--font-display)] font-black uppercase"
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.3em",
          }}
        >
          FROM ZERO TO HERO
        </span>
        <div
          className="h-[1px] w-[120px]"
          style={{ background: "linear-gradient(to right, rgba(124,58,237,0.3), transparent)" }}
        />
      </div>

      {/* SVG trail path */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        style={{ zIndex: 10 }}
      >
        <defs>
          {/* Base Journey Path (Deep elegant purple, fading at ends) */}
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.1" />
            <stop offset="10%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
            <stop offset="90%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.1" />
          </linearGradient>

          <filter id="trailGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="trailOuterGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Outer subtle glow layer - makes it look like it's glowing onto the background */}
        <path
          d={pathD}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.1"
          filter="url(#trailOuterGlow)"
        />

        {/* Main elegant base trail */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="0.4"
          strokeLinecap="round"
          filter="url(#trailGlow)"
          opacity="0.8"
        />

        {/* Energy pulse overlay (solid sliding glowing segment) */}
        {/* We use strokeDasharray/offset to ensure there is exactly ONE segment 
            traveling along the true path length, avoiding gradient bounding-box overlap.
            pathLength="100" standardizes the bezier path's total length to exactly 100 units. */}
        <path
          d={pathD}
          fill="none"
          stroke="#c8ff00"
          strokeWidth="0.8"
          strokeLinecap="round"
          filter="url(#trailGlow)"
          pathLength="100"
          strokeDasharray="12 100" // 12% comet length, 100% gap (single comet)
        >
          {/* We animate strokeDashoffset backward from 100 (beginning) to -15 (end) 
              so the single comet crosses exactly once per loop. */}
          <animate
            attributeName="stroke-dashoffset"
            values="100; -15"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>

        {/* Dashed elegant guide line */}
        <path
          d={pathD}
          fill="none"
          stroke="#A855F7"
          strokeWidth="0.1"
          strokeLinecap="round"
          strokeDasharray="0.5 1.5"
          opacity="0.2"
        />

        {/* Subtle energy dot traveling the path */}
        <circle r="0.8" fill="#ffffff" filter="url(#trailGlow)">
          <animateMotion dur="6s" repeatCount="indefinite" path={pathD} />
        </circle>

        {/* Glowing Node Points behind each Stage */}
        {STAGE_POSITIONS.map((pos, i) => (
          <g key={`stage-node-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
            {/* Outer large bloom */}
            <circle r="3" fill="#c8ff00" opacity="0.3" filter="url(#trailOuterGlow)" />
            {/* Inner glow */}
            <circle r="1" fill="#c8ff00" opacity="0.8" filter="url(#trailGlow)" />
            {/* Solid core */}
            <circle r="0.4" fill="#ffffff" />
          </g>
        ))}

      </svg>

      {/* Stage nodes positioned absolutely */}
      {STAGES.map((stage, index) => {
        const pos = STAGE_POSITIONS[index];
        return (
          <div
            key={stage.id}
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            <StageNode stage={stage} />
          </div>
        );
      })}

      {/* Footer */}
      <div
        className="absolute bottom-[16px] left-0 right-0 flex items-center justify-center gap-[12px]"
        style={{ zIndex: 15 }}
      >
        <div
          className="h-[1px] w-[60px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.15))" }}
        />
        <span
          className="font-[family-name:var(--font-body)] uppercase tracking-[0.15em]"
          style={{ fontSize: "10px", color: "rgba(255,255,255,0.12)" }}
        >
          Startup Weekend IA — Jaraguá do Sul
        </span>
        <div
          className="h-[1px] w-[60px]"
          style={{ background: "linear-gradient(to left, transparent, rgba(124,58,237,0.15))" }}
        />
      </div>
    </div>
  );
}
