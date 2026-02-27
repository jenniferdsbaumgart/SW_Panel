/**
 * Particle system for Canvas 2D celebrations.
 * Pure functions + data structure approach (no classes, no mutation side-effects).
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface ParticleConfig {
  /** Center X position */
  cx: number;
  /** Center Y position */
  cy: number;
  /** Colors to randomly pick from */
  colors: string[];
  /** Min/max initial speed */
  speedMin: number;
  speedMax: number;
  /** Min/max particle size */
  sizeMin: number;
  sizeMax: number;
  /** Min/max life in seconds */
  lifeMin: number;
  lifeMax: number;
  /** Spread radius from center */
  spread: number;
  /** Number of particles to create */
  count: number;
  /** Optional: gravity (pixels/s^2, positive = down) */
  gravity?: number;
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Creates an array of particles from config.
 */
export function createParticles(config: ParticleConfig): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < config.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomRange(config.speedMin, config.speedMax);
    const offsetX = (Math.random() - 0.5) * config.spread;
    const offsetY = (Math.random() - 0.5) * config.spread;
    const life = randomRange(config.lifeMin, config.lifeMax);

    particles.push({
      x: config.cx + offsetX,
      y: config.cy + offsetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randomRange(config.sizeMin, config.sizeMax),
      color: randomPick(config.colors),
      opacity: 1,
      life,
      maxLife: life,
    });
  }
  return particles;
}

/**
 * Updates particles by deltaTime (in seconds).
 * Returns a new array with only alive particles.
 */
export function updateParticles(
  particles: Particle[],
  deltaTime: number,
  gravity: number = 0
): Particle[] {
  const alive: Particle[] = [];
  for (const p of particles) {
    const newLife = p.life - deltaTime;
    if (newLife <= 0) continue;

    alive.push({
      ...p,
      x: p.x + p.vx * deltaTime,
      y: p.y + p.vy * deltaTime + 0.5 * gravity * deltaTime * deltaTime,
      vy: p.vy + gravity * deltaTime,
      life: newLife,
      opacity: Math.max(0, newLife / p.maxLife),
    });
  }
  return alive;
}

/**
 * Renders particles onto a Canvas 2D context.
 */
export function renderParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[]
): void {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    // Draw as a soft circle with glow
    ctx.shadowBlur = p.size * 2;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ============================================================
// Preset configs for celebration types
// ============================================================

/** Violeta particles for medium_high celebration */
export const PARTICLE_PRESET_VIOLET: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#7C3AED", "#A78BFA", "#8B5CF6", "#FFFFFF", "#BFFF00"],
  speedMin: 40,
  speedMax: 120,
  sizeMin: 2,
  sizeMax: 5,
  lifeMin: 0.8,
  lifeMax: 1.5,
  spread: 40,
  count: 30,
  gravity: 20,
};

/** Golden particles for HERO celebration */
export const PARTICLE_PRESET_GOLD: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#FFD700", "#FFA500", "#FFFFFF", "#BFFF00"],
  speedMin: 30,
  speedMax: 100,
  sizeMin: 2,
  sizeMax: 6,
  lifeMin: 1.0,
  lifeMax: 2.5,
  spread: 60,
  count: 60,
  gravity: 15,
};

/** Neural pulse particles for light celebration */
export const PARTICLE_PRESET_NEURAL: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#A78BFA", "#C4B5FD", "#FFFFFF", "#818CF8"],
  speedMin: 20,
  speedMax: 60,
  sizeMin: 1,
  sizeMax: 3,
  lifeMin: 0.6,
  lifeMax: 1.2,
  spread: 30,
  count: 15,
  gravity: 0,
};

/** Rocket exhaust particles for medium celebration */
export const PARTICLE_PRESET_ROCKET: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#FF6B00", "#FFA500", "#FFD700", "#FF4500", "#FFFFFF"],
  speedMin: 40,
  speedMax: 120,
  sizeMin: 2,
  sizeMax: 5,
  lifeMin: 0.4,
  lifeMax: 1.0,
  spread: 20,
  count: 25,
  gravity: 30,
};

/** Circuit LED particles for medium_high celebration */
export const PARTICLE_PRESET_CIRCUIT: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#00FF88", "#00CC66", "#FFFFFF", "#88FFBB"],
  speedMin: 10,
  speedMax: 40,
  sizeMin: 1,
  sizeMax: 3,
  lifeMin: 0.8,
  lifeMax: 2.0,
  spread: 200,
  count: 20,
  gravity: 0,
};

/** Supernova golden explosion particles for max celebration */
export const PARTICLE_PRESET_SUPERNOVA: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#FFD700", "#FFA500", "#FFFFFF", "#FFFACD", "#FFE4B5"],
  speedMin: 60,
  speedMax: 200,
  sizeMin: 2,
  sizeMax: 8,
  lifeMin: 1.5,
  lifeMax: 3.5,
  spread: 20,
  count: 80,
  gravity: 5,
};

/** White star particles for supernova secondary layer */
export const PARTICLE_PRESET_STARS: Omit<ParticleConfig, "cx" | "cy"> = {
  colors: ["#FFFFFF", "#FFFACD", "#F0F0FF"],
  speedMin: 15,
  speedMax: 50,
  sizeMin: 1,
  sizeMax: 3,
  lifeMin: 2.0,
  lifeMax: 4.0,
  spread: 100,
  count: 40,
  gravity: 0,
};
