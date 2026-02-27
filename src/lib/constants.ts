import type { StageDefinition, CelebrationType } from "@/types/stages";
import type { CelebrationConfig } from "@/types/celebrations";

/**
 * 8 etapas da jornada "From Zero to Hero".
 * Cores, icones e configuracoes derivadas do design-system.md.
 */
export const STAGES: StageDefinition[] = [
  {
    id: "zero",
    name: "ZERO",
    order: 0,
    icon: "Rocket",
    color: "#7C3AED",
    trailColor: "#4C1D95",
    textColor: "#FFFFFF",
    requiresMentor: false,
  },
  {
    id: "ideia",
    name: "IDEIA",
    order: 1,
    icon: "Lightbulb",
    color: "#8B5CF6",
    trailColor: "#5B21B6",
    textColor: "#FFFFFF",
    requiresMentor: false,
  },
  {
    id: "problema",
    name: "PROBLEMA",
    order: 2,
    icon: "Search",
    color: "#A78BFA",
    trailColor: "#6D28D9",
    textColor: "#FFFFFF",
    requiresMentor: false,
  },
  {
    id: "validacao",
    name: "VALIDAÇÃO",
    order: 3,
    icon: "CheckCircle",
    color: "#B794F4",
    trailColor: "#7C3AED",
    textColor: "#FFFFFF",
    requiresMentor: true,
  },
  {
    id: "mvp",
    name: "MVP",
    order: 4,
    icon: "Hammer",
    color: "#9F7AEA",
    trailColor: "#7C3AED",
    textColor: "#FFFFFF",
    requiresMentor: false,
  },
  {
    id: "sol_validada",
    name: "SOL. VALIDADA",
    order: 5,
    icon: "BadgeCheck",
    color: "#C4B5FD",
    trailColor: "#8B5CF6",
    textColor: "#FFFFFF",
    requiresMentor: true,
  },
  {
    id: "pitch",
    name: "PITCH",
    order: 6,
    icon: "Mic",
    color: "#DDD6FE",
    trailColor: "#A78BFA",
    textColor: "#0F0A1A",
    requiresMentor: false,
  },
  {
    id: "hero",
    name: "HERO",
    order: 7,
    icon: "Trophy",
    color: "#FFD700",
    trailColor: "#FFD700",
    textColor: "#0F0A1A",
    requiresMentor: false,
  },
];

/**
 * Mapa StageId -> StageDefinition para lookup rapido.
 */
export const STAGE_MAP = Object.fromEntries(
  STAGES.map((s) => [s.id, s])
) as Record<string, StageDefinition>;

/**
 * Duracoes de celebracao em milissegundos por tipo.
 */
export const CELEBRATION_DURATIONS: Record<CelebrationType, number> = {
  light: 5000,
  medium: 6000,
  medium_high: 7000,
  max: 10000,
  pivot: 5000,
};

/**
 * Configuracoes de celebracao por tipo.
 */
export const CELEBRATION_CONFIGS: Record<CelebrationType, CelebrationConfig> = {
  light: {
    type: "light",
    duration: 5000,
    hasParticles: false,
    hasTakeover: false,
    hasSound: false,
  },
  medium: {
    type: "medium",
    duration: 6000,
    hasParticles: true,
    hasTakeover: false,
    hasSound: true,
  },
  medium_high: {
    type: "medium_high",
    duration: 7000,
    hasParticles: true,
    hasTakeover: false,
    hasSound: true,
  },
  max: {
    type: "max",
    duration: 10000,
    hasParticles: true,
    hasTakeover: true,
    hasSound: true,
  },
  pivot: {
    type: "pivot",
    duration: 5000,
    hasParticles: false,
    hasTakeover: false,
    hasSound: true,
  },
};

/** Gap entre celebracoes em milissegundos. */
export const CELEBRATION_GAP_MS = 300;

/** Maximo de entradas no event log. */
export const MAX_EVENT_LOG = 500;

/** WebSocket reconnection defaults. */
export const WS_INITIAL_RETRY_MS = 2000;
export const WS_MAX_RETRY_MS = 30000;
export const WS_BACKOFF_MULTIPLIER = 2;
export const WS_JITTER_FACTOR = 0.2;
export const WS_INACTIVITY_TIMEOUT_MS = 60000;

/** Tipos de evento WS validos. */
export const VALID_WS_MESSAGE_TYPES = [
  "stage_update",
  "waiting",
  "celebration",
  "pivot",
  "hero",
  "sync",
  "panel_control",
] as const;
