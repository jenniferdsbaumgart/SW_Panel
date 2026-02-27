"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import type { Particle, ParticleConfig } from "@/lib/particle-system";
import {
  createParticles,
  updateParticles,
  renderParticles,
} from "@/lib/particle-system";

export interface ParticleCanvasRef {
  startParticles: (config: ParticleConfig) => void;
  stopParticles: () => void;
}

/**
 * Full-screen <canvas> overlay for particle effects.
 * Exposes imperative methods via ref: startParticles, stopParticles.
 *
 * - position: fixed, pointer-events: none
 * - z-index: 45 (between celebration overlay and hero takeover)
 * - requestAnimationFrame render loop, auto-cleanup when all particles die
 */
export const ParticleCanvas = forwardRef<ParticleCanvasRef>(
  function ParticleCanvas(_props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const gravityRef = useRef<number>(0);
    const isRunningRef = useRef(false);

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, []);

    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [resizeCanvas]);

    const loop = useCallback((timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const deltaTime =
        lastTimeRef.current === 0
          ? 0.016
          : (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Update
      particlesRef.current = updateParticles(
        particlesRef.current,
        deltaTime,
        gravityRef.current
      );

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render
      renderParticles(ctx, particlesRef.current);

      // Continue or stop
      if (particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        isRunningRef.current = false;
        lastTimeRef.current = 0;
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        startParticles(config: ParticleConfig) {
          const newParticles = createParticles(config);
          particlesRef.current = [
            ...particlesRef.current,
            ...newParticles,
          ];
          gravityRef.current = config.gravity ?? 0;

          if (!isRunningRef.current) {
            isRunningRef.current = true;
            lastTimeRef.current = 0;
            animFrameRef.current = requestAnimationFrame(loop);
          }
        },
        stopParticles() {
          particlesRef.current = [];
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = 0;
          }
          isRunningRef.current = false;
          lastTimeRef.current = 0;

          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        },
      }),
      [loop]
    );

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 45 }}
        aria-hidden="true"
      />
    );
  }
);
