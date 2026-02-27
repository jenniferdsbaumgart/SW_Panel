import type { CelebrationType } from "./stages";

export interface CelebrationConfig {
  type: CelebrationType;
  duration: number;
  hasParticles: boolean;
  hasTakeover: boolean;
  hasSound: boolean;
}
