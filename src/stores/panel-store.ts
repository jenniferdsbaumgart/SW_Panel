import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type {
  TeamState,
  ConnectionStatus,
  EventLogEntry,
  CelebrationQueueItem,
  VisualState,
} from "@/types/state";
import type {
  StageUpdateEvent,
  WaitingEvent,
  PivotEvent,
  HeroEvent,
  CelebrationEvent,
  PanelControlEvent,
  WebSocketMessage,
  TeamSyncData,
} from "@/types/events";
import type { StageId, CelebrationType } from "@/types/stages";
import { MAX_EVENT_LOG, CELEBRATION_GAP_MS } from "@/lib/constants";

// ============================================================
// STATE + ACTIONS interface
// ============================================================

interface PanelActions {
  // Event handlers (chamados pelo WebSocket)
  handleSync: (teams: TeamSyncData[]) => void;
  handleStageUpdate: (event: StageUpdateEvent) => void;
  handleWaiting: (event: WaitingEvent) => void;
  handlePivot: (event: PivotEvent) => void;
  handleHero: (event: HeroEvent) => void;
  handleCelebration: (event: CelebrationEvent) => void;
  handlePanelControl: (event: PanelControlEvent) => void;

  // Celebration queue
  enqueueCelebration: (item: CelebrationQueueItem) => void;
  startNextCelebration: () => void;
  finishCelebration: () => void;

  // Connection
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;

  // Admin
  triggerManualCelebration: (teamId: string, type: CelebrationType) => void;
  resetPanel: () => void;

  // Internal
  logEvent: (data: Record<string, unknown>) => void;
}

interface PanelState {
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

type PanelStore = PanelState & PanelActions;

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: PanelState = {
  teams: {},
  connectionStatus: "connecting",
  reconnectAttempts: 0,
  lastSyncAt: null,
  isPaused: false,
  pendingEvents: [],
  celebrationQueue: [],
  currentCelebration: null,
  eventLog: [],
};

// ============================================================
// STORE (with persist middleware)
// ============================================================

export const usePanelStore = create<PanelStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ----------------------------------------------------------
      // Event Handlers
      // ----------------------------------------------------------

      handleSync: (teams) => {
        const teamsMap: Record<string, TeamState> = {};
        for (const team of teams) {
          const visualState: VisualState = team.is_hero
            ? "hero"
            : team.is_waiting
              ? "waiting"
              : team.is_pivoted
                ? "pivoted"
                : "active";

          teamsMap[team.team_id] = {
            ...team,
            visual_state: visualState,
          };
        }
        set({
          teams: teamsMap,
          lastSyncAt: new Date().toISOString(),
        });
        get().logEvent({ type: "sync", teamCount: teams.length });
      },

      handleStageUpdate: (event) => {
        const { team_id, to_stage, card, celebration_type } = event;

        if (get().isPaused) {
          set({ pendingEvents: [...get().pendingEvents, event] });
          return;
        }

        const team = get().teams[team_id];
        if (!team) return;

        set({
          teams: {
            ...get().teams,
            [team_id]: {
              ...team,
              current_stage: to_stage,
              card: card ?? team.card,
              visual_state: "celebrating",
              is_waiting: false,
            },
          },
        });

        get().enqueueCelebration({
          id: `${team_id}-${to_stage}-${Date.now()}`,
          team_id,
          team_name: team.team_name,
          team_color: team.team_color,
          celebration_type,
          from_stage: event.from_stage,
          to_stage,
          card: card ?? team.card,
          timestamp: event.timestamp,
        });

        get().logEvent({
          type: "stage_update",
          team_id,
          from: event.from_stage,
          to: to_stage,
          celebration: celebration_type,
        });
      },

      handleWaiting: (event) => {
        const { team_id } = event;
        const team = get().teams[team_id];
        if (!team) return;

        set({
          teams: {
            ...get().teams,
            [team_id]: {
              ...team,
              is_waiting: true,
              visual_state: "waiting",
            },
          },
        });

        get().logEvent({ type: "waiting", team_id, stage: event.stage });
      },

      handlePivot: (event) => {
        const { team_id, to_stage, card } = event;

        if (get().isPaused) {
          set({ pendingEvents: [...get().pendingEvents, event] });
          return;
        }

        const team = get().teams[team_id];
        if (!team) return;

        // Do NOT update current_stage yet — the card stays at the original
        // stage during the pivot celebration animation. The stage move happens
        // in finishCelebration when the animation completes.
        // visual_state "pivoting" hides the card on the board while the
        // celebration component shows a traveling card along the dotted path.
        set({
          teams: {
            ...get().teams,
            [team_id]: {
              ...team,
              card: card ?? team.card,
              visual_state: "pivoting",
              is_pivoted: true,
              pivot_count: team.pivot_count + 1,
              is_waiting: false,
            },
          },
        });

        get().enqueueCelebration({
          id: `${team_id}-pivot-${Date.now()}`,
          team_id,
          team_name: team.team_name,
          team_color: team.team_color,
          celebration_type: "pivot",
          from_stage: event.from_stage,
          to_stage,
          card: card ?? team.card,
          timestamp: event.timestamp,
        });

        get().logEvent({
          type: "pivot",
          team_id,
          from: event.from_stage,
          to: to_stage,
          reason: event.reason,
        });
      },

      handleHero: (event) => {
        const { team_id, card_hero } = event;

        if (get().isPaused) {
          set({ pendingEvents: [...get().pendingEvents, event] });
          return;
        }

        const team = get().teams[team_id];
        if (!team) return;

        set({
          teams: {
            ...get().teams,
            [team_id]: {
              ...team,
              current_stage: "hero" as StageId,
              card: card_hero,
              visual_state: "celebrating",
              is_hero: true,
              is_waiting: false,
            },
          },
        });

        // HERO tem prioridade maxima -- inserir no inicio da fila
        const item: CelebrationQueueItem = {
          id: `${team_id}-hero-${Date.now()}`,
          team_id,
          team_name: team.team_name,
          team_color: team.team_color,
          celebration_type: "max",
          from_stage: team.current_stage,
          to_stage: "hero",
          card: card_hero,
          timestamp: event.timestamp,
        };

        set({
          celebrationQueue: [item, ...get().celebrationQueue],
        });

        // Se nao ha celebracao ativa, iniciar imediatamente
        if (!get().currentCelebration) {
          get().startNextCelebration();
        }

        get().logEvent({ type: "hero", team_id });
      },

      handleCelebration: (event) => {
        const team = get().teams[event.team_id];
        if (!team) return;

        get().enqueueCelebration({
          id: `${event.team_id}-celebration-${Date.now()}`,
          team_id: event.team_id,
          team_name: team.team_name,
          team_color: team.team_color,
          celebration_type: event.celebration_type,
          from_stage: event.from_stage,
          to_stage: event.to_stage,
          card: event.card ?? team.card,
          timestamp: new Date().toISOString(),
        });

        get().logEvent({
          type: "celebration",
          team_id: event.team_id,
          celebration: event.celebration_type,
        });
      },

      handlePanelControl: (event) => {
        switch (event.action) {
          case "pause":
            set({ isPaused: true });
            get().logEvent({ type: "panel_control", action: "pause" });
            break;

          case "resume": {
            set({ isPaused: false });
            const pending = get().pendingEvents;
            set({ pendingEvents: [] });
            for (const evt of pending) {
              dispatchEvent(evt, get());
            }
            get().logEvent({
              type: "panel_control",
              action: "resume",
              pendingProcessed: pending.length,
            });
            break;
          }

          case "reset":
            set({
              teams: {},
              celebrationQueue: [],
              currentCelebration: null,
              isPaused: false,
              pendingEvents: [],
            });
            get().logEvent({ type: "panel_control", action: "reset" });
            break;
        }
      },

      // ----------------------------------------------------------
      // Celebration Queue
      // ----------------------------------------------------------

      enqueueCelebration: (item) => {
        const exists = get().celebrationQueue.some((c) => c.id === item.id);
        if (exists) return;

        set({
          celebrationQueue: [...get().celebrationQueue, item],
        });

        if (!get().currentCelebration) {
          get().startNextCelebration();
        }
      },

      startNextCelebration: () => {
        const queue = get().celebrationQueue;
        if (queue.length === 0) return;

        const [next, ...rest] = queue;
        set({
          currentCelebration: next,
          celebrationQueue: rest,
        });
      },

      finishCelebration: () => {
        const current = get().currentCelebration;
        if (!current) return;

        // Restaurar visual_state da equipe
        const team = get().teams[current.team_id];
        if (team) {
          const newVisualState: VisualState = team.is_hero
            ? "hero"
            : team.is_pivoted
              ? "pivoted"
              : "active";

          // For pivot celebrations, NOW move the card to the destination stage.
          // The stage move was deferred so the card stays at its original
          // position during the pivot animation.
          const newStage =
            current.celebration_type === "pivot"
              ? current.to_stage
              : team.current_stage;

          set({
            teams: {
              ...get().teams,
              [current.team_id]: {
                ...team,
                current_stage: newStage,
                visual_state: newVisualState,
              },
            },
          });
        }

        set({ currentCelebration: null });

        // Iniciar proxima celebracao se houver
        if (get().celebrationQueue.length > 0) {
          setTimeout(() => get().startNextCelebration(), CELEBRATION_GAP_MS);
        }
      },

      // ----------------------------------------------------------
      // Connection
      // ----------------------------------------------------------

      setConnectionStatus: (status) => {
        set({ connectionStatus: status });
      },

      incrementReconnectAttempts: () => {
        set({ reconnectAttempts: get().reconnectAttempts + 1 });
      },

      resetReconnectAttempts: () => {
        set({ reconnectAttempts: 0 });
      },

      // ----------------------------------------------------------
      // Admin
      // ----------------------------------------------------------

      triggerManualCelebration: (teamId, type) => {
        const team = get().teams[teamId];
        if (!team) return;

        get().enqueueCelebration({
          id: `manual-${teamId}-${Date.now()}`,
          team_id: teamId,
          team_name: team.team_name,
          team_color: team.team_color,
          celebration_type: type,
          from_stage: team.current_stage,
          to_stage: team.current_stage,
          card: team.card,
          timestamp: new Date().toISOString(),
        });

        get().logEvent({
          type: "manual_celebration",
          team_id: teamId,
          celebration: type,
        });
      },

      resetPanel: () => {
        set({
          ...initialState,
          connectionStatus: get().connectionStatus,
        });
      },

      // ----------------------------------------------------------
      // Internal: Event Log
      // ----------------------------------------------------------

      logEvent: (data) => {
        const entry: EventLogEntry = {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: String(data.type ?? "unknown"),
          timestamp: new Date().toISOString(),
          data,
        };

        set((state) => ({
          eventLog:
            state.eventLog.length >= MAX_EVENT_LOG
              ? [...state.eventLog.slice(1), entry]
              : [...state.eventLog, entry],
        }));
      },
    }),
    {
      name: "sw-painel-state",
      partialize: (state) => ({
        teams: state.teams,
        lastSyncAt: state.lastSyncAt,
      }),
      skipHydration: true,
    }
  )
);

// ============================================================
// DISPATCH helper (for resume from pause)
// ============================================================

function dispatchEvent(
  message: WebSocketMessage,
  store: PanelStore
): void {
  switch (message.type) {
    case "stage_update":
      store.handleStageUpdate(message);
      break;
    case "waiting":
      store.handleWaiting(message);
      break;
    case "pivot":
      store.handlePivot(message);
      break;
    case "hero":
      store.handleHero(message);
      break;
    case "celebration":
      store.handleCelebration(message);
      break;
    case "sync":
      store.handleSync(message.teams);
      break;
    case "panel_control":
      store.handlePanelControl(message);
      break;
  }
}

// ============================================================
// SELECTORS
// ============================================================

export const useTeam = (teamId: string) =>
  usePanelStore((s) => s.teams[teamId]);

export const useTeamIds = () =>
  usePanelStore((s) => Object.keys(s.teams));

export const useTeamsByStage = (stageId: StageId) =>
  usePanelStore(
    useShallow((s) =>
      Object.values(s.teams).filter((t) => t.current_stage === stageId)
    )
  );

export const useConnectionStatus = () =>
  usePanelStore((s) => s.connectionStatus);

export const useCurrentCelebration = () =>
  usePanelStore((s) => s.currentCelebration);

export const useIsPaused = () =>
  usePanelStore((s) => s.isPaused);

export const useCelebrationQueueLength = () =>
  usePanelStore((s) => s.celebrationQueue.length);
