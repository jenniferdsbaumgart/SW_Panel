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
// Arranged in a winding S-curve path
export const STAGE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 6, y: 22 },     // 0 ZERO        — top-left start
  { x: 24, y: 12 },    // 1 IDEIA       — up right
  { x: 42, y: 28 },    // 2 PROBLEMA    — down right
  { x: 28, y: 52 },    // 3 VALIDAÇÃO   — curve back left, middle
  { x: 46, y: 72 },    // 4 MVP         — down right
  { x: 62, y: 48 },    // 5 SOL.VALID   — up right
  { x: 78, y: 68 },    // 6 PITCH       — down right
  { x: 92, y: 42 },    // 7 HERO        — grand finale top-right
];

// SVG cubic bezier control points for smooth curves between stages
function buildPathD(): string {
  const p = STAGE_POSITIONS;
  const s = (pct: { x: number; y: number }) => `${pct.x} ${pct.y}`;

  // Build a smooth path through all points using cubic beziers
  let d = `M ${s(p[0])}`;

  // ZERO → IDEIA (sweep up-right)
  d += ` C ${p[0].x + 8} ${p[0].y - 6}, ${p[1].x - 8} ${p[1].y + 4}, ${s(p[1])}`;

  // IDEIA → PROBLEMA (curve down-right)
  d += ` C ${p[1].x + 8} ${p[1].y + 8}, ${p[2].x - 6} ${p[2].y - 8}, ${s(p[2])}`;

  // PROBLEMA → VALIDAÇÃO (sweep back left and down)
  d += ` C ${p[2].x - 4} ${p[2].y + 12}, ${p[3].x + 8} ${p[3].y - 10}, ${s(p[3])}`;

  // VALIDAÇÃO → MVP (curve down-right)
  d += ` C ${p[3].x + 6} ${p[3].y + 10}, ${p[4].x - 8} ${p[4].y - 6}, ${s(p[4])}`;

  // MVP → SOL.VALIDADA (sweep up-right)
  d += ` C ${p[4].x + 6} ${p[4].y - 12}, ${p[5].x - 8} ${p[5].y + 8}, ${s(p[5])}`;

  // SOL.VALIDADA → PITCH (curve down-right)
  d += ` C ${p[5].x + 8} ${p[5].y + 10}, ${p[6].x - 6} ${p[6].y - 6}, ${s(p[6])}`;

  // PITCH → HERO (grand sweep up-right to finale)
  d += ` C ${p[6].x + 6} ${p[6].y - 14}, ${p[7].x - 10} ${p[7].y + 10}, ${s(p[7])}`;

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
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4C1D95" />
            <stop offset="30%" stopColor="#7C3AED" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="85%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>

          {/* Animated energy pulse traveling along the path */}
          <linearGradient id="energyPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BFFF00" stopOpacity="0">
              <animate attributeName="offset" values="-0.1;1" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="5%" stopColor="#BFFF00" stopOpacity="0.6">
              <animate attributeName="offset" values="-0.05;1.05" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="10%" stopColor="#BFFF00" stopOpacity="0">
              <animate attributeName="offset" values="0;1.1" dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="trailOuterGlow">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Outer glow layer */}
        <path
          d={pathD}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.15"
          filter="url(#trailOuterGlow)"
        />

        {/* Main trail */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="0.6"
          strokeLinecap="round"
          filter="url(#trailGlow)"
          opacity="0.7"
        />

        {/* Energy pulse overlay */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#energyPulse)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Dashed guide line (board game feel) */}
        <path
          d={pathD}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="0.15"
          strokeLinecap="round"
          strokeDasharray="0.8 2"
          opacity="0.3"
        />

        {/* Subtle energy dot traveling the path */}
        <circle r="0.5" fill="#A78BFA" opacity="0.4">
          <animateMotion dur="10s" repeatCount="indefinite" path={pathD} />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
        </circle>

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
