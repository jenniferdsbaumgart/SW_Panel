export type StageId =
  | "zero"
  | "ideia"
  | "problema"
  | "validacao"
  | "mvp"
  | "sol_validada"
  | "pitch"
  | "hero";

export type CelebrationType =
  | "light"
  | "medium"
  | "medium_high"
  | "max"
  | "pivot";

export interface StageDefinition {
  id: StageId;
  name: string;
  order: number;
  icon: string;
  color: string;
  trailColor: string;
  textColor: string;
  requiresMentor: boolean;
}
