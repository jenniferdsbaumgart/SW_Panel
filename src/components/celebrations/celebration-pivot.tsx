"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { CelebrationQueueItem } from "@/types/state";
import { CELEBRATION_DURATIONS, STAGES } from "@/lib/constants";
import { STAGE_POSITIONS } from "../board/journey-track";

interface CelebrationPivotProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

/**
 * Builds an SVG path string (viewBox 0 0 100 100) arcing far below the trail.
 */
function buildPivotDetourPath(fromStageId: string, toStageId: string): string {
  const fromIdx = STAGES.findIndex((s) => s.id === fromStageId);
  const toIdx = STAGES.findIndex((s) => s.id === toStageId);

  const from = STAGE_POSITIONS[fromIdx] ?? STAGE_POSITIONS[0];
  const to = STAGE_POSITIONS[toIdx] ?? STAGE_POSITIONS[1];

  // Main trail bounds: x=6–92, y=12–72 (MVP is the lowest at y=72).
  // This path goes OUTSIDE the trail using an L-shape with rounded corners:
  //
  //   [from stage]
  //        |          ← straight down
  //        └──────┐   ← rounded corner, then left along y=82
  //               │
  //   ┌───────────┘   ← rounded corner at (x=2, y=82)
  //   |               ← straight up at x=2
  //   └──→ [IDEIA]    ← rounded corner, then right to IDEIA at y=12
  //
  // Every segment stays outside the trail zone.

  const bottomY = 82; // 10 below MVP (72) — safe corridor
  const leftX = 2;    // 4 left of ZERO (6) — safe corridor
  const r = 4;        // corner radius for smooth turns

  // Corner 1: bottom of descent (from.x, bottomY)
  // Corner 2: bottom-left (leftX, bottomY)
  // Corner 3: top-left (leftX, to.y)

  return [
    // Start at origin stage
    `M ${from.x} ${from.y}`,

    // Straight down to near corner 1
    `L ${from.x} ${bottomY - r}`,

    // Rounded corner 1: turn left
    `Q ${from.x} ${bottomY}, ${from.x - r} ${bottomY}`,

    // Straight left along bottom to near corner 2
    `L ${leftX + r} ${bottomY}`,

    // Rounded corner 2: turn up
    `Q ${leftX} ${bottomY}, ${leftX} ${bottomY - r}`,

    // Straight up to near corner 3
    `L ${leftX} ${to.y + r}`,

    // Rounded corner 3: turn right toward IDEIA
    `Q ${leftX} ${to.y}, ${leftX + r} ${to.y}`,

    // Straight right to IDEIA
    `L ${to.x} ${to.y}`,
  ].join(" ");
}

/**
 * Pivot celebration — compact, non-fullscreen.
 *
 * 1. A dotted SVG path appears going OUTSIDE the main trail
 *    (right edge → bottom → left edge → up to IDEIA)
 * 2. The card travels SLOWLY along that exact path (JS-driven via getPointAtLength)
 * 3. A small label "RECALCULANDO..." travels with the card
 * 4. When the card arrives at IDEIA, everything fades and disappears
 *
 * Duration: 5s. No dark overlay. Board stays fully visible.
 */
export function CelebrationPivot({
  celebration,
  onComplete,
}: CelebrationPivotProps) {
  const duration = CELEBRATION_DURATIONS[celebration.celebration_type] ?? 5000;

  const pathD = buildPivotDetourPath(
    celebration.from_stage,
    celebration.to_stage
  );

  const fromIdx = STAGES.findIndex((s) => s.id === celebration.from_stage);
  const from = STAGE_POSITIONS[fromIdx] ?? STAGE_POSITIONS[0];

  const pivotId = `pivot-${celebration.id.replace(/[^a-zA-Z0-9]/g, "")}`;

  const initials = celebration.team_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  // Timing
  const pathAppearMs = 600;
  const travelMs = duration - pathAppearMs - 600;
  const pathAppearSec = pathAppearMs / 1000;

  const [pathDrawn, setPathDrawn] = useState(false);
  const [cardPos, setCardPos] = useState({ x: from.x, y: from.y });
  const [fading, setFading] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pathRef = useRef<SVGPathElement>(null);
  const pathLengthRef = useRef<number>(0);

  // Once the SVG path is rendered, cache its total length
  useEffect(() => {
    if (pathRef.current) {
      pathLengthRef.current = pathRef.current.getTotalLength();
    }
  }, [pathD]);

  // Easing: ease-in-out cubic
  const ease = useCallback((t: number) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  // Animate the card along the SVG path using getPointAtLength
  useEffect(() => {
    if (!pathDrawn || !pathRef.current) return;

    const totalLen = pathLengthRef.current || pathRef.current.getTotalLength();
    if (totalLen === 0) return;

    startTimeRef.current = performance.now();
    const svgEl = pathRef.current.ownerSVGElement;
    if (!svgEl) return;

    // Get viewBox dimensions for coordinate conversion
    const vb = svgEl.viewBox.baseVal;
    const vbW = vb.width || 100;
    const vbH = vb.height || 100;

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const rawT = Math.min(elapsed / travelMs, 1);
      const t = ease(rawT);

      const len = t * totalLen;
      const pt = pathRef.current!.getPointAtLength(len);

      // pt is in SVG viewBox coordinates (0-100), convert to %
      setCardPos({ x: (pt.x / vbW) * 100, y: (pt.y / vbH) * 100 });

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pathDrawn, travelMs, ease]);

  // Phase orchestration
  useEffect(() => {
    const t1 = setTimeout(() => setPathDrawn(true), pathAppearMs);
    const t2 = setTimeout(() => setFading(true), duration - 600);
    const t3 = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [duration, onComplete, pathAppearMs]);

  const indigoColor = "#818CF8";

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: fading ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: fading ? 0.5 : 0.2 }}
    >
      {/* SVG layer for the dotted path */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        style={{ zIndex: 25 }}
      >
        <defs>
          <marker
            id={`${pivotId}-arrow`}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 6 3 L 0 6 Z"
              fill={indigoColor}
              fillOpacity="0.7"
            />
          </marker>
        </defs>

        {/* Glow behind the path */}
        <path
          d={pathD}
          fill="none"
          stroke={indigoColor}
          strokeWidth="1.5"
          strokeOpacity="0.06"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-opacity"
            values="0;0.06"
            dur={`${pathAppearSec}s`}
            fill="freeze"
          />
        </path>

        {/* Dotted detour path with marching ants — also used as ref for getPointAtLength */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke={indigoColor}
          strokeWidth="0.4"
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeDasharray="2 2"
          markerEnd={`url(#${pivotId}-arrow)`}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-8"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="0;0.6"
            dur={`${pathAppearSec}s`}
            fill="freeze"
          />
        </path>
      </svg>

      {/* HTML card + banner positioned absolutely, driven by JS animation */}
      {pathDrawn && (
        <div
          className="absolute"
          style={{
            left: `${cardPos.x}%`,
            top: `${cardPos.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Small card */}
          <div
            style={{
              width: 80,
              height: 96,
              borderRadius: 6,
              border: `2px solid ${indigoColor}`,
              backgroundColor: "#1E1432",
              overflow: "hidden",
              boxShadow: `0 0 16px rgba(129,140,248,0.5)`,
              flexShrink: 0,
            }}
          >
            {celebration.card?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={celebration.card.image_url}
                alt={`Card de ${celebration.team_name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${celebration.team_color}33`,
                  fontSize: 24,
                  fontWeight: 900,
                  color: celebration.team_color,
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Compact info banner */}
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 5,
              background: "rgba(15,10,26,0.9)",
              border: `1px solid ${indigoColor}44`,
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}
          >
            <RotateCcw
              size={12}
              color={indigoColor}
              style={{ animation: "spin 2s linear infinite" }}
            />
            <span
              style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}
            >
              {celebration.team_name}
            </span>
            <span
              style={{
                fontSize: 10,
                color: indigoColor,
                animation: "pulse-waiting 1.5s ease-in-out infinite",
              }}
            >
              RECALCULANDO...
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
