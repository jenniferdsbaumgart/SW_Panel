import type { StageId } from "./stages";
import type { CardData, WebSocketMessage } from "./events";

export type VisualState =
  | "active"
  | "waiting"
  | "celebrating"
  | "pivoting"
  | "pivoted"
  | "hero";

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface TeamState {
  team_id: string;
  team_name: string;
  team_color: string;
  current_stage: StageId;
  card: CardData | null;
  is_waiting: boolean;
  is_pivoted: boolean;
  pivot_count: number;
  is_hero: boolean;
  visual_state: VisualState;
}

export interface EventLogEntry {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface PanelState {
  teams: Record<string, TeamState>;
  connectionStatus: ConnectionStatus;
  reconnectAttempts: number;
  lastSyncAt: string | null;
  isPaused: boolean;
  pendingEvents: WebSocketMessage[];
  celebrationQueue: CelebrationQueueItem[];
  currentCelebration: CelebrationQueueItem | null;
  eventLog: EventLogEntry[];
}

export interface CelebrationQueueItem {
  id: string;
  team_id: string;
  team_name: string;
  team_color: string;
  celebration_type: import("./stages").CelebrationType;
  from_stage: StageId;
  to_stage: StageId;
  card: CardData | null;
  timestamp: string;
}
