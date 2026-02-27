"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CelebrationQueueItem } from "@/types/state";
import { CELEBRATION_DURATIONS, STAGE_MAP } from "@/lib/constants";
import { ParticleCanvas, type ParticleCanvasRef } from "./particle-canvas";
import {
  PARTICLE_PRESET_SUPERNOVA,
  PARTICLE_PRESET_STARS,
} from "@/lib/particle-system";
import { CelebrationCard } from "./celebration-card";

interface CelebrationHeroProps {
  celebration: CelebrationQueueItem;
  onComplete: () => void;
}

type SupernovaPhase = "dark" | "explode" | "card" | "hero_text" | "fade";

/**
 * Level 4: "Supernova" celebration (10s). EPIC COSMIC EXPLOSION.
 *
 * Phase 1 (0-1s): Screen goes dark, bright point at center
 * Phase 2 (1-3s): Supernova explosion - golden particles, shockwave rings
 * Phase 3 (3-6s): Card materializes with golden aura, sparkles + stars
 * Phase 4 (6-8s): "HERO!" in 192px golden text with cinematic letter reveal
 * Phase 5 (8-10s): Graceful fade with lingering sparkles
 */
export function CelebrationHero({
  celebration,
  onComplete,
}: CelebrationHeroProps) {
  const duration = CELEBRATION_DURATIONS[celebration.celebration_type] ?? 10000;
  const particleRef = useRef<ParticleCanvasRef>(null);
  const [phase, setPhase] = useState<SupernovaPhase>("dark");

  const toLabel =
    STAGE_MAP[celebration.to_stage]?.name ?? celebration.to_stage;

  useEffect(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const timers = [
      // Phase 2: Explosion
      setTimeout(() => {
        setPhase("explode");
        // Main supernova burst
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_SUPERNOVA,
          cx,
          cy,
        });
      }, 1000),
      // Secondary burst
      setTimeout(() => {
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_SUPERNOVA,
          cx,
          cy,
          count: 40,
          speedMin: 80,
          speedMax: 250,
        });
      }, 1500),
      // Phase 3: Card materializes
      setTimeout(() => {
        setPhase("card");
        // Star layer
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_STARS,
          cx,
          cy: cy - 50,
        });
      }, 3000),
      // Continuous sparkles during card phase
      setTimeout(() => {
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_SUPERNOVA,
          cx: cx - 150,
          cy: cy - 100,
          count: 15,
          speedMin: 10,
          speedMax: 40,
        });
      }, 3800),
      setTimeout(() => {
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_SUPERNOVA,
          cx: cx + 150,
          cy: cy - 100,
          count: 15,
          speedMin: 10,
          speedMax: 40,
        });
      }, 4500),
      // Phase 4: HERO! text
      setTimeout(() => {
        setPhase("hero_text");
        // Final sparkle burst
        particleRef.current?.startParticles({
          ...PARTICLE_PRESET_STARS,
          cx,
          cy: cy + 100,
          count: 25,
        });
      }, 6000),
      // Phase 5: Fade
      setTimeout(() => {
        setPhase("fade");
        particleRef.current?.stopParticles();
      }, 8000),
      setTimeout(onComplete, duration),
    ];

    return () => {
      timers.forEach(clearTimeout);
      particleRef.current?.stopParticles();
    };
  }, [duration, onComplete]);

  return (
    <>
      <ParticleCanvas ref={particleRef} />

      <motion.div
        className="pointer-events-none fixed inset-0 flex items-center justify-center"
        style={{ zIndex: "var(--z-hero-takeover)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Phase 1: Full dark background */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: "#000000" }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              phase === "dark"
                ? 1
                : phase === "explode"
                  ? 0.95
                  : phase === "fade"
                    ? 0
                    : 0.9,
          }}
          transition={{ duration: phase === "fade" ? 1.5 : 0.5 }}
        />

        {/* Golden glow at center (persists from explode onward) */}
        <AnimatePresence>
          {phase !== "dark" && phase !== "fade" && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 800,
                height: 800,
                background:
                  "radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,165,0,0.05) 40%, transparent 70%)",
              }}
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{
                opacity: phase === "explode" ? 1 : 0.6,
                scale: phase === "explode" ? [0.1, 1.5] : 1.0,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Phase 1: Bright point at center */}
        <AnimatePresence>
          {phase === "dark" && (
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#FFD700",
                boxShadow:
                  "0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 80px #FFD70088",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1],
                scale: [0, 1, 1.2, 0.8, 1],
              }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Phase 2: Shockwave rings */}
        <AnimatePresence>
          {phase === "explode" && (
            <>
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={`shock-${ring}`}
                  className="absolute rounded-full"
                  style={{
                    width: 200,
                    height: 200,
                    border: `${3 - ring}px solid rgba(255,215,0,${0.8 - ring * 0.2})`,
                    boxShadow: `0 0 20px rgba(255,215,0,${0.4 - ring * 0.1})`,
                  }}
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{
                    scale: [0.1, 3 + ring * 1.5],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: ring * 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
              {/* White flash */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: "#FFFFFF" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Phase 3: Card materializes */}
        <AnimatePresence>
          {(phase === "card" || phase === "hero_text") && (
            <motion.div
              className="absolute flex flex-col items-center gap-[24px]"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 1.0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Card with golden aura */}
              <motion.div
                animate={{
                  y: [0, -8, 0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CelebrationCard
                  celebration={celebration}
                  width={280}
                  height={336}
                  glowColor="#FFD700"
                  borderColor="#FFD700"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.3), 0 0 120px rgba(255,165,0,0.15)",
                  }}
                />
              </motion.div>

              {/* Team name golden */}
              <motion.span
                className="font-[family-name:var(--font-display)] font-black"
                style={{
                  fontSize: 56,
                  color: "#FFD700",
                  textShadow:
                    "0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {celebration.team_name}
              </motion.span>

              <motion.span
                className="font-[family-name:var(--font-body)] uppercase tracking-[4px]"
                style={{
                  fontSize: "var(--text-panel-small)",
                  color: "rgba(255,215,0,0.5)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {toLabel}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: "HERO!" cinematic text */}
        <AnimatePresence>
          {phase === "hero_text" && (
            <motion.div
              className="absolute bottom-[10%] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="flex">
                {"HERO!".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    className="font-[family-name:var(--font-display)] font-black"
                    style={{
                      fontSize: 192,
                      color: "#FFD700",
                      textShadow:
                        "0 0 60px rgba(255,215,0,0.9), 0 0 120px rgba(255,215,0,0.5), 0 0 200px rgba(255,165,0,0.3)",
                    }}
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: i * 0.12,
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 5: Fade - lingering sparkles handled by particles */}
        <AnimatePresence>
          {phase === "fade" && (
            <motion.div
              className="absolute flex flex-col items-center gap-[16px]"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <span
                className="font-[family-name:var(--font-display)] font-black"
                style={{
                  fontSize: 56,
                  color: "#FFD700",
                  textShadow: "0 0 40px rgba(255,215,0,0.6)",
                }}
              >
                {celebration.team_name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
