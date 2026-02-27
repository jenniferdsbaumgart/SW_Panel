"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CelebrationQueueItem } from "@/types/state";
import { CELEBRATION_DURATIONS, STAGE_MAP } from "@/lib/constants";
import { ParticleCanvas, type ParticleCanvasRef } from "./particle-canvas";
import { PARTICLE_PRESET_ROCKET } from "@/lib/particle-system";
import { CelebrationCard } from "./celebration-card";

interface CelebrationMediumProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

type RocketPhase = "launch" | "ascend" | "arrive" | "display";

/**
 * Level 2: "Rocket Launch" celebration (6s).
 * Theme: A rocket launching with the card from bottom to center.
 * - Card starts at bottom, launches upward with exhaust trail
 * - Rocket exhaust particles stream downward
 * - On arrival at center, burst of light
 * - "LIFTOFF!" text then team name + stage info
 * - Smoke wisps at bottom
 */
export function CelebrationMedium({
  celebration,
  onComplete,
}: CelebrationMediumProps) {
  const duration = CELEBRATION_DURATIONS[celebration.celebration_type] ?? 6000;
  const durationSec = duration / 1000;
  const particleRef = useRef<ParticleCanvasRef>(null);
  const [phase, setPhase] = useState<RocketPhase>("launch");
  const color = celebration.team_color;

  const fromLabel =
    STAGE_MAP[celebration.from_stage]?.name ?? celebration.from_stage;
  const toLabel =
    STAGE_MAP[celebration.to_stage]?.name ?? celebration.to_stage;

  useEffect(() => {
    // Exhaust particles during ascent (runs for first 1.8s)
    const exhaustInterval = setInterval(() => {
      particleRef.current?.startParticles({
        ...PARTICLE_PRESET_ROCKET,
        cx: window.innerWidth / 2,
        cy: window.innerHeight * 0.7,
        count: 8,
      });
    }, 150);

    const timers = [
      setTimeout(() => setPhase("ascend"), 300),
      setTimeout(() => {
        setPhase("arrive");
        clearInterval(exhaustInterval);
        // Arrival burst
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_ROCKET,
          cx: window.innerWidth / 2,
          cy: window.innerHeight / 2,
          count: 30,
          speedMin: 60,
          speedMax: 180,
          spread: 40,
        });
      }, 1800),
      setTimeout(() => setPhase("display"), 2800),
      setTimeout(() => {
        particleRef.current?.stopParticles();
      }, duration - 800),
      setTimeout(onComplete, duration),
    ];

    return () => {
      clearInterval(exhaustInterval);
      timers.forEach(clearTimeout);
      particleRef.current?.stopParticles();
    };
  }, [duration, onComplete]);

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
        {/* Background: dark with upward gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(15,10,30,0.95) 0%, rgba(30,15,60,0.9) 50%, rgba(15,10,26,0.85) 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: durationSec,
            times: [0, 0.08, 0.8, 1],
          }}
        />

        {/* Smoke wisps at bottom */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`smoke-${i}`}
            className="absolute bottom-0"
            style={{
              width: 400 + i * 100,
              height: 120,
              background:
                "radial-gradient(ellipse at center bottom, rgba(200,200,220,0.15) 0%, transparent 70%)",
              left: `calc(50% - ${(400 + i * 100) / 2}px)`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.6, 0.4, 0],
              y: [20, 0, -10, -30],
              scaleX: [1, 1.2, 1.4, 1.6],
            }}
            transition={{
              duration: durationSec * 0.6,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Flame trail line */}
        <AnimatePresence>
          {(phase === "ascend" || phase === "arrive") && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                width: 4,
                background: `linear-gradient(to top, #FF6B0088, #FFD70044, transparent)`,
                bottom: "10%",
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: ["0%", "40%", "50%"],
                opacity: [0, 0.8, 0.3],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Card launching upward */}
        <motion.div
          className="absolute z-10 flex flex-col items-center gap-[16px]"
          initial={{ y: 300, opacity: 0, scale: 0.7 }}
          animate={{
            y:
              phase === "launch"
                ? 300
                : phase === "ascend"
                  ? 0
                  : 0,
            opacity: [0, 1, 1, 1, 0],
            scale:
              phase === "launch"
                ? 0.7
                : phase === "ascend"
                  ? 0.9
                  : 1.0,
          }}
          transition={{
            y: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
            opacity: {
              duration: durationSec,
              times: [0, 0.1, 0.5, 0.85, 1],
            },
            scale: { duration: 1.5, ease: "easeOut" },
          }}
        >
          <CelebrationCard
            celebration={celebration}
            glowColor={phase === "arrive" || phase === "display" ? "#FFD700" : color}
            borderColor={
              phase === "arrive" || phase === "display" ? "#FFD700" : color
            }
          />
        </motion.div>

        {/* Arrival burst of light */}
        <AnimatePresence>
          {phase === "arrive" && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 600,
                height: 600,
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.1) 40%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1.2, 1.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* "LIFTOFF!" text */}
        <AnimatePresence>
          {phase === "arrive" && (
            <motion.span
              className="absolute font-[family-name:var(--font-display)] font-black"
              style={{
                fontSize: 72,
                color: "#FF6B00",
                textShadow:
                  "0 0 40px rgba(255,107,0,0.8), 0 0 80px rgba(255,165,0,0.4)",
                top: "15%",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 1.0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            >
              LIFTOFF!
            </motion.span>
          )}
        </AnimatePresence>

        {/* Team name + stage info (display phase) */}
        <AnimatePresence>
          {phase === "display" && (
            <motion.div
              className="absolute bottom-[15%] flex flex-col items-center gap-[12px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: durationSec * 0.45,
                times: [0, 0.15, 0.7, 1],
              }}
            >
              <span
                className="font-[family-name:var(--font-display)] font-black text-white"
                style={{
                  fontSize: 48,
                  textShadow: `0 0 40px ${color}88, 0 0 80px ${color}44`,
                }}
              >
                {celebration.team_name}
              </span>
              <span
                className="font-[family-name:var(--font-body)] text-white/50 uppercase tracking-[3px]"
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
