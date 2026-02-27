# State Management - SW Painel

## Visao Geral

Estado gerenciado via **Zustand** com um store principal (`panelStore`). Nao usa banco de dados. Estado reconstruido via evento `sync` do WebSocket.

## Store Principal: panelStore

```typescript
import { create } from 'zustand';

// ============================================================
// STATE
// ============================================================

interface PanelState {
  // --- Teams ---
  teams: Record<string, TeamState>;

  // --- Connection ---
  connectionStatus: ConnectionStatus;
  reconnectAttempts: number;
  lastSyncAt: string | null;

  // --- Panel Control ---
  isPaused: boolean;
  pendingEvents: WebSocketMessage[];   // Eventos acumulados durante pausa

  // --- Celebrations ---
  celebrationQueue: CelebrationQueueItem[];
  currentCelebration: CelebrationQueueItem | null;

  // --- Event Log ---
  eventLog: EventLogEntry[];
}

// ============================================================
// ACTIONS
// ============================================================

interface PanelActions {
  // --- Event Handlers (chamados pelo WebSocket) ---
  handleSync: (teams: TeamState[]) => void;
  handleStageUpdate: (event: StageUpdateEvent) => void;
  handleWaiting: (event: WaitingEvent) => void;
  handlePivot: (event: PivotEvent) => void;
  handleHero: (event: HeroEvent) => void;
  handleCelebration: (event: CelebrationEvent) => void;
  handlePanelControl: (event: PanelControlEvent) => void;

  // --- Celebration Queue ---
  enqueueCelebration: (item: CelebrationQueueItem) => void;
  startNextCelebration: () => void;
  finishCelebration: () => void;

  // --- Connection ---
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;

  // --- Admin ---
  triggerManualCelebration: (teamId: string, type: CelebrationType) => void;
  resetPanel: () => void;
}

type PanelStore = PanelState & PanelActions;
```

## Estado Inicial

```typescript
const initialState: PanelState = {
  teams: {},
  connectionStatus: 'connecting',
  reconnectAttempts: 0,
  lastSyncAt: null,
  isPaused: false,
  pendingEvents: [],
  celebrationQueue: [],
  currentCelebration: null,
  eventLog: [],
};
```

## Implementacao das Actions

### handleSync

```typescript
handleSync: (teams) => {
  const teamsMap: Record<string, TeamState> = {};
  for (const team of teams) {
    teamsMap[team.team_id] = team;
  }
  set({
    teams: teamsMap,
    lastSyncAt: new Date().toISOString(),
  });
  // Log
  get().logEvent({ type: 'sync', teamCount: teams.length });
}
```

### handleStageUpdate

```typescript
handleStageUpdate: (event) => {
  const { team_id, to_stage, card, celebration_type } = event;

  // Se pausado, acumular evento
  if (get().isPaused) {
    set({ pendingEvents: [...get().pendingEvents, event] });
    return;
  }

  // Atualizar equipe
  const team = get().teams[team_id];
  if (!team) return;

  set({
    teams: {
      ...get().teams,
      [team_id]: {
        ...team,
        current_stage: to_stage,
        card: card ?? team.card,
        visual_state: 'celebrating',
        is_waiting: false,
      },
    },
  });

  // Enfileirar celebracao
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
}
```

### handleWaiting

```typescript
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
        visual_state: 'waiting',
      },
    },
  });
}
```

### handlePivot

```typescript
handlePivot: (event) => {
  const { team_id, to_stage, card } = event;

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
        visual_state: 'celebrating',
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
    celebration_type: 'pivot',
    from_stage: event.from_stage,
    to_stage,
    card: card ?? team.card,
    timestamp: event.timestamp,
  });
}
```

### handleHero

```typescript
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
        current_stage: 'hero',
        card: card_hero,
        visual_state: 'celebrating',
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
    celebration_type: 'max',
    from_stage: team.current_stage,
    to_stage: 'hero',
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
}
```

### handlePanelControl

```typescript
handlePanelControl: (event) => {
  switch (event.action) {
    case 'pause':
      set({ isPaused: true });
      break;

    case 'resume':
      set({ isPaused: false });
      // Processar eventos acumulados
      const pending = get().pendingEvents;
      set({ pendingEvents: [] });
      for (const evt of pending) {
        // Re-despachar cada evento
        dispatchEvent(evt, get());
      }
      break;

    case 'reset':
      set({
        teams: {},
        celebrationQueue: [],
        currentCelebration: null,
        isPaused: false,
        pendingEvents: [],
      });
      // Aguardar novo sync do Gerencial
      break;
  }
}
```

## Celebration Queue Management

### enqueueCelebration

```typescript
enqueueCelebration: (item) => {
  // Deduplicacao: verificar se ja existe celebracao com mesmo id
  const exists = get().celebrationQueue.some(c => c.id === item.id);
  if (exists) return;

  set({
    celebrationQueue: [...get().celebrationQueue, item],
  });

  // Se nao ha celebracao ativa, iniciar a proxima
  if (!get().currentCelebration) {
    get().startNextCelebration();
  }
}
```

### startNextCelebration

```typescript
startNextCelebration: () => {
  const queue = get().celebrationQueue;
  if (queue.length === 0) return;

  const [next, ...rest] = queue;
  set({
    currentCelebration: next,
    celebrationQueue: rest,
  });
}
```

### finishCelebration

```typescript
finishCelebration: () => {
  const current = get().currentCelebration;
  if (!current) return;

  // Restaurar visual_state da equipe
  const team = get().teams[current.team_id];
  if (team) {
    const newVisualState: VisualState = team.is_hero
      ? 'hero'
      : team.is_pivoted
        ? 'pivoted'
        : 'active';

    set({
      teams: {
        ...get().teams,
        [current.team_id]: {
          ...team,
          visual_state: newVisualState,
        },
      },
    });
  }

  set({ currentCelebration: null });

  // Iniciar proxima celebracao se houver
  if (get().celebrationQueue.length > 0) {
    // Pequeno delay para evitar transicao abrupta
    setTimeout(() => get().startNextCelebration(), 300);
  }
}
```

## Selectors

Selectors para evitar re-renders desnecessarios:

```typescript
// Selectors granulares
const useTeam = (teamId: string) =>
  usePanelStore((s) => s.teams[teamId]);

const useTeamIds = () =>
  usePanelStore((s) => Object.keys(s.teams));

const useTeamsByStage = (stageId: StageId) =>
  usePanelStore((s) =>
    Object.values(s.teams).filter((t) => t.current_stage === stageId)
  );

const useConnectionStatus = () =>
  usePanelStore((s) => s.connectionStatus);

const useCurrentCelebration = () =>
  usePanelStore((s) => s.currentCelebration);

const useIsPaused = () =>
  usePanelStore((s) => s.isPaused);

const useCelebrationQueueLength = () =>
  usePanelStore((s) => s.celebrationQueue.length);
```

## Fluxo Completo: Evento -> Render

```
1. WebSocket recebe mensagem JSON
        |
        v
2. event-parser.ts parseia e valida tipo
        |
        v
3. useWebSocket hook despacha para action correspondente
        |
        v
4. panelStore action atualiza estado
   - teams[team_id] atualizado
   - celebrationQueue enfileirada
        |
        v
5. React re-renders (via selectors)
   - TeamCard re-renderiza (estado mudou)
   - CelebrationOverlay re-renderiza (currentCelebration mudou)
        |
        v
6. Framer Motion anima
   - layout animation move card para nova posicao
   - celebration overlay entra com AnimatePresence
        |
        v
7. Canvas particulas ativado (se celebracao pesada)
        |
        v
8. Celebracao completa -> finishCelebration()
        |
        v
9. visual_state restaurado -> proxima celebracao na fila
```

## Middleware: localStorage Persistence (Fase 2)

```typescript
import { persist } from 'zustand/middleware';

const usePanelStore = create<PanelStore>()(
  persist(
    (set, get) => ({
      // ... state e actions
    }),
    {
      name: 'sw-painel-state',
      partialize: (state) => ({
        // Persistir apenas teams e lastSyncAt
        // NAO persistir celebrationQueue nem currentCelebration
        teams: state.teams,
        lastSyncAt: state.lastSyncAt,
      }),
    }
  )
);
```

## Admin Store (Fase 2)

```typescript
interface AdminStore {
  isAuthenticated: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0-1

  login: (password: string) => boolean;
  logout: () => void;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
}
```
