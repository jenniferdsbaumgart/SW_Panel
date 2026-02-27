"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CelebrationQueueItem } from "@/types/state";
import { CELEBRATION_DURATIONS, STAGE_MAP } from "@/lib/constants";
import { ParticleCanvas, type ParticleCanvasRef } from "./particle-canvas";
import { PARTICLE_PRESET_CIRCUIT } from "@/lib/particle-system";
import { CelebrationCard } from "./celebration-card";

interface CelebrationMediumHighProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

type CircuitPhase = "appear" | "traces" | "glitch_text" | "display";

/**
 * Level 3: "Circuit Board" celebration (7s).
 * Theme: Digital circuit paths lighting up, leading to the card.
 * - Card centered with circuit traces animating outward
 * - PCB-style geometric lines with 90-degree turns
 * - Traces glow in team_color with LED dots at intersections
 * - Binary digits raining in background
 * - "LEVEL UP!" text with glitch effect
 * - Team name with monospace styling
 */
export function CelebrationMediumHigh({
  celebration,
  onComplete,
}: CelebrationMediumHighProps) {
  const duration =
    CELEBRATION_DURATIONS[celebration.celebration_type] ?? 7000;
  const durationSec = duration / 1000;
  const particleRef = useRef<ParticleCanvasRef>(null);
  const [phase, setPhase] = useState<CircuitPhase>("appear");
  const color = celebration.team_color;

  const fromLabel =
    STAGE_MAP[celebration.from_stage]?.name ?? celebration.from_stage;
  const toLabel =
    STAGE_MAP[celebration.to_stage]?.name ?? celebration.to_stage;

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setPhase("traces");
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_CIRCUIT,
          cx: window.innerWidth / 2,
          cy: window.innerHeight / 2,
          colors: [color, "#FFFFFF", `${color}CC`],
        });
      }, 800),
      setTimeout(() => {
        setPhase("glitch_text");
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_CIRCUIT,
          cx: window.innerWidth / 2 + 300,
          cy: window.innerHeight / 2 - 100,
          colors: [color, "#FFFFFF"],
          count: 15,
        });
      }, 2500),
      setTimeout(() => setPhase("display"), 4000),
      setTimeout(() => {
        particleRef.current?.stopParticles();
      }, duration - 800),
      setTimeout(onComplete, duration),
    ];

    return () => {
      timers.forEach(clearTimeout);
      particleRef.current?.stopParticles();
    };
  }, [duration, onComplete, color]);

  // Generate circuit trace paths (SVG-like layout)
  const circuitTraces = [
    // Right traces
    { x1: 140, y1: 0, x2: 280, y2: 0, x3: 280, y3: -120, delay: 0 },
    { x1: 140, y1: 40, x2: 320, y2: 40, x3: 320, y3: 160, delay: 0.1 },
    { x1: 140, y1: -40, x2: 240, y2: -40, x3: 240, y3: -200, delay: 0.2 },
    // Left traces
    { x1: -140, y1: 0, x2: -280, y2: 0, x3: -280, y3: 120, delay: 0.05 },
    { x1: -140, y1: -40, x2: -320, y2: -40, x3: -320, y3: -160, delay: 0.15 },
    { x1: -140, y1: 40, x2: -240, y2: 40, x3: -240, y3: 200, delay: 0.25 },
    // Top traces
    { x1: 0, y1: -160, x2: 0, y2: -280, x3: 160, y3: -280, delay: 0.1 },
    { x1: 60, y1: -160, x2: 60, y2: -220, x3: -120, y3: -220, delay: 0.2 },
    // Bottom traces
    { x1: 0, y1: 160, x2: 0, y2: 280, x3: -160, y3: 280, delay: 0.15 },
    { x1: -60, y1: 160, x2: -60, y2: 220, x3: 120, y3: 220, delay: 0.25 },
  ];

  return (
    <>
      <ParticleCanvas ref={particleRef} />

      <motion.div
        className="pointer-events-none flex h-full w-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background: dark with faint grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(rgba(15,10,26,0.92), rgba(15,10,26,0.92)),
              repeating-linear-gradient(0deg, transparent, transparent 39px, ${color}08 39px, ${color}08 40px),
              repeating-linear-gradient(90deg, transparent, transparent 39px, ${color}08 39px, ${color}08 40px)
            `,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: durationSec,
            times: [0, 0.08, 0.82, 1],
          }}
        />

        {/* Binary rain in background */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={`bin-${i}`}
            className="absolute font-mono text-white/10"
            style={{
              fontSize: 14,
              left: `${5 + (i * 4.5) % 90}%`,
              top: "-5%",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 0.15, 0.08, 0],
              y: [-20, window.innerHeight * 0.5 + i * 20],
            }}
            transition={{
              duration: durationSec * 0.7,
              delay: i * 0.12,
              ease: "linear",
            }}
          >
            {Array.from({ length: 8 })
              .map((_, j) => ((i * 8 + j) % 3 === 0 ? "1" : "0"))
              .join("")}
          </motion.span>
        ))}

        {/* Circuit traces */}
        <AnimatePresence>
          {(phase === "traces" || phase === "glitch_text" || phase === "display") && (
            <svg
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                overflow: "visible",
              }}
              viewBox={`${-window.innerWidth / 2} ${-window.innerHeight / 2} ${window.innerWidth} ${window.innerHeight}`}
            >
              {circuitTraces.map((trace, i) => (
                <motion.g key={`trace-${i}`}>
                  {/* Main trace line */}
                  <motion.path
                    d={`M ${trace.x1} ${trace.y1} L ${trace.x2} ${trace.y2} L ${trace.x3} ${trace.y3}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.7 }}
                    transition={{
                      duration: 1.2,
                      delay: trace.delay,
                      ease: "easeOut",
                    }}
                    style={{
                      filter: `drop-shadow(0 0 4px ${color})`,
                    }}
                  />
                  {/* LED dot at junction */}
                  <motion.circle
                    cx={trace.x2}
                    cy={trace.y2}
                    r={4}
                    fill={color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0.6],
                      scale: [0, 1.5, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: trace.delay + 0.6,
                    }}
                    style={{
                      filter: `drop-shadow(0 0 8px ${color})`,
                    }}
                  />
                  {/* LED dot at end */}
                  <motion.circle
                    cx={trace.x3}
                    cy={trace.y3}
                    r={3}
                    fill="#FFFFFF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0.4] }}
                    transition={{
                      duration: 0.4,
                      delay: trace.delay + 1.0,
                    }}
                    style={{
                      filter: `drop-shadow(0 0 6px ${color})`,
                    }}
                  />
                </motion.g>
              ))}
            </svg>
          )}
        </AnimatePresence>

        {/* Card centered */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-[20px]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.7, 1.05, 1.0, 0.9],
          }}
          transition={{
            duration: durationSec * 0.9,
            times: [0, 0.12, 0.8, 1],
            ease: "easeOut",
          }}
        >
          <CelebrationCard
            celebration={celebration}
            glowColor={color}
            style={{
              boxShadow: `0 0 30px ${color}88, 0 0 60px ${color}44, 0 0 100px ${color}22`,
            }}
          />
        </motion.div>

        {/* "LEVEL UP!" glitch text */}
        <AnimatePresence>
          {(phase === "glitch_text" || phase === "display") && (
            <motion.div
              className="absolute top-[12%] flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.span
                className="font-[family-name:var(--font-display)] font-black"
                style={{
                  fontSize: 80,
                  color: color,
                  textShadow: `0 0 40px ${color}AA, 0 0 80px ${color}44`,
                }}
                animate={{
                  x: [0, -3, 2, -1, 0],
                  opacity: [1, 0.8, 1, 0.9, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: 3,
                  repeatType: "mirror",
                }}
              >
                LEVEL UP!
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team name + stage info */}
        <AnimatePresence>
          {phase === "display" && (
            <motion.div
              className="absolute bottom-[12%] flex flex-col items-center gap-[12px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: durationSec * 0.35,
                times: [0, 0.2, 0.7, 1],
              }}
            >
              <span
                className="font-mono font-bold text-white"
                style={{
                  fontSize: 48,
                  textShadow: `0 0 30px ${color}88`,
                  letterSpacing: "4px",
                }}
              >
                {celebration.team_name}
              </span>
              <span
                className="font-mono text-white/40 uppercase tracking-[3px]"
                style={{ fontSize: "var(--text-panel-small)" }}
              >
                {fromLabel} {"\u2192"} {toLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
