# ADR-002: Estrategia de Gerenciamento de Estado

## Status

Accepted

## Contexto

O SW Painel mantem estado exclusivamente em memoria: equipes, etapas, fila de celebracoes, status de conexao. Esse estado e atualizado em tempo real via WebSocket e precisa disparar re-renders granulares em componentes especificos (card de uma equipe, overlay de celebracao, indicador de conexao).

Opcoes: React Context + useReducer, Zustand, Jotai.

## Decisao

**Zustand** como store global unico.

## Justificativa

1. **Re-renders granulares via selectors.** Quando uma equipe avanca, apenas o card dessa equipe precisa re-renderizar. Zustand permite `useStore(state => state.teams[teamId])` sem re-render de componentes que nao dependem dessa equipe. React Context re-renderizaria todos os consumers.

2. **API simples e minimalista.** Zustand tem ~1KB gzipped. A API e `create()` + `useStore()`. Sem boilerplate de providers, reducers, ou actions tipadas.

3. **Funciona fora do React.** O hook `useWebSocket` pode atualizar o store diretamente sem estar dentro de um componente React. Isso simplifica a integracao WebSocket -> store.

4. **Middleware built-in.** `persist` middleware para localStorage fallback (US-028, Fase 2). `devtools` para debug durante desenvolvimento.

5. **Performance para updates frequentes.** Com 15 equipes e eventos a cada poucos minutos, Zustand lida trivialmente. Mas a arquitetura de selectors garante que mesmo com updates rapidos (multiplas celebracoes), nao ha cascata de re-renders.

## Alternativas Descartadas

### React Context + useReducer

- Re-renders excessivos: qualquer mudanca no state re-renderiza TODOS os consumers do context.
- Para um painel com 15 cards + overlay de celebracao + indicador de conexao, isso significa re-render de toda a arvore.
- Workaround (split contexts) adiciona complexidade sem beneficio.

### Jotai

- Atomic state e elegante, mas o modelo de dados do SW Painel e tree-shaped (PanelState -> teams -> team), nao atomic.
- Jotai brilha quando ha muitos atoms independentes. Aqui, o estado e coeso.

## Estrutura do Store

```typescript
interface PanelStore {
  // Estado
  teams: Record<string, TeamState>;
  connectionStatus: ConnectionStatus;
  isPaused: boolean;
  lastSyncAt: string | null;
  celebrationQueue: CelebrationQueueItem[];
  currentCelebration: CelebrationQueueItem | null;
  eventLog: EventLogEntry[];

  // Actions
  handleSync: (teams: TeamState[]) => void;
  handleStageUpdate: (event: StageUpdateEvent) => void;
  handleWaiting: (event: WaitingEvent) => void;
  handlePivot: (event: PivotEvent) => void;
  handleHero: (event: HeroEvent) => void;
  handlePanelControl: (event: PanelControlEvent) => void;
  handleCelebration: (event: CelebrationEvent) => void;

  // Celebration queue
  enqueueCelebration: (item: CelebrationQueueItem) => void;
  startNextCelebration: () => void;
  finishCelebration: () => void;

  // Connection
  setConnectionStatus: (status: ConnectionStatus) => void;
}
```

## Consequencias

### Positivas

- Re-renders minimos por design
- Zero boilerplate de providers
- Integracao trivial com WebSocket
- localStorage persistence via middleware (Fase 2)

### Negativas

- Dependencia externa (embora minima: ~1KB)
- Equipe precisa conhecer pattern de selectors

### Riscos

- Store muito grande: mitigacao com slices se necessario (improvavel com 15 equipes).
