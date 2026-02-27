import type { StageId, CelebrationType } from "./stages";

export interface CardData {
  image_url: string;
  title?: string;
  subtitle?: string;
}

export interface StageUpdateEvent {
  type: "stage_update";
  team_id: string;
  team_name: string;
  team_color: string;
  from_stage: StageId;
  to_stage: StageId;
  celebration_type: CelebrationType;
  card: CardData | null;
  timestamp: string;
}

export interface WaitingEvent {
  type: "waiting";
  team_id: string;
  stage: StageId;
  timestamp: string;
}

export interface CelebrationEvent {
  type: "celebration";
  team_id: string;
  celebration_type: CelebrationType;
  from_stage: StageId;
  to_stage: StageId;
  card: CardData | null;
}

export interface PivotEvent {
  type: "pivot";
  team_id: string;
  from_stage: StageId;
  to_stage: StageId;
  reason: string;
  card: CardData | null;
  timestamp: string;
}

export interface HeroEvent {
  type: "hero";
  team_id: string;
  card_hero: CardData;
  timestamp: string;
}

export interface SyncEvent {
  type: "sync";
  teams: TeamSyncData[];
}

export interface TeamSyncData {
  team_id: string;
  team_name: string;
  team_color: string;
  current_stage: StageId;
  card: CardData | null;
  is_waiting: boolean;
  is_pivoted: boolean;
  pivot_count: number;
  is_hero: boolean;
}

export interface PanelControlEvent {
  type: "panel_control";
  action: "pause" | "resume" | "reset";
}

export type WebSocketMessage =
  | StageUpdateEvent
  | WaitingEvent
  | CelebrationEvent
  | PivotEvent
  | HeroEvent
  | SyncEvent
  | PanelControlEvent;

export type WebSocketMessageType = WebSocketMessage["type"];
