# Modelo de Dados Conceitual - SW Painel

## Visao Geral

O SW Painel mantem estado **exclusivamente em memoria** (nao usa banco de dados no MVP). O estado e reconstruido a cada conexao/reconexao via evento `sync` do WebSocket. Opcionalmente, localStorage e usado como fallback para reload do navegador.

---

## Diagrama de Entidades (In-Memory)

```
+-------------------+       +-------------------+       +---------------------+
|    PanelState     |       |    TeamState      |       |   CelebrationQueue  |
+-------------------+       +-------------------+       +---------------------+
| teams: Map<id,T>  |<──────| team_id      (PK) |       | queue: Event[]      |
| connectionStatus  |       | team_name         |       | isPlaying: boolean   |
| isPaused          |       | team_color        |       | currentCelebration   |
| lastSyncAt        |       | current_stage     |       +---------------------+
+-------------------+       | card: CardData    |
                            | visual_state      |
                            | is_waiting        |
                            | is_pivoted        |
                            | pivot_count       |
                            | is_hero           |
                            +-------------------+
```

---

## Estruturas TypeScript

### PanelState (Estado Global da Aplicacao)

```typescript
interface PanelState {
  /** Mapa de equipes indexado por team_id */
  teams: Map<string, TeamState>;

  /** Status da conexao WebSocket */
  connectionStatus: ConnectionStatus;

  /** Se o painel esta pausado (via panel_control) */
  isPaused: boolean;

  /** Timestamp do ultimo sync recebido */
  lastSyncAt: string | null;

  /** Fila de celebracoes pendentes */
  celebrationQueue: CelebrationQueueItem[];

  /** Celebracao atualmente em execucao */
  currentCelebration: CelebrationQueueItem | null;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";
```

### TeamState (Estado de uma Equipe)

```typescript
interface TeamState {
  /** Identificador unico da equipe */
  team_id: string;

  /** Nome de exibicao da equipe */
  team_name: string;

  /** Cor associada a equipe (hex) */
  team_color: string;

  /** Etapa atual na jornada */
  current_stage: StageId;

  /** Card visual atual (imagem gerada pelo n8n) */
  card: CardData | null;

  /** Estado visual atual para renderizacao */
  visual_state: VisualState;

  /** Se a equipe esta aguardando aprovacao de mentor */
  is_waiting: boolean;

  /** Se a equipe ja pivotou alguma vez */
  is_pivoted: boolean;

  /** Quantas vezes a equipe pivotou */
  pivot_count: number;

  /** Se a equipe completou a jornada (HERO) */
  is_hero: boolean;
}
```

### VisualState (Estado Visual do Card)

```typescript
type VisualState =
  | "active"       // Solido, cor da equipe. Trabalhando normalmente.
  | "waiting"      // Pulsando/brilhando. Submeteu para mentor.
  | "celebrating"  // Animacao ativa (2-8s). Acabou de avancar.
  | "pivoted"      // Contorno tracejado + icone de recalculo.
  | "hero";        // Dourado/especial. Completou a jornada.
```

### StageId

```typescript
type StageId =
  | "zero"
  | "ideia"
  | "problema"
  | "validacao"
  | "mvp"
  | "sol_validada"
  | "pitch"
  | "hero";
```

### StageDefinition (Metadados de cada etapa -- constante)

```typescript
interface StageDefinition {
  id: StageId;
  number: number;           // 0-7
  displayName: string;      // Nome de exibicao
  description: string;
  advanceType: "automatic" | "mentor" | "manual";
  icon: string;             // Nome do icone (Lucide, Phosphor, etc.)
  order: number;            // Posicao na trilha (0-7)
}

const STAGES: StageDefinition[] = [
  { id: "zero",          number: 0, displayName: "ZERO",           description: "Equipe formada",          advanceType: "automatic", icon: "Rocket",       order: 0 },
  { id: "ideia",         number: 1, displayName: "IDEIA",          description: "Ideia definida",          advanceType: "automatic", icon: "Lightbulb",    order: 1 },
  { id: "problema",      number: 2, displayName: "PROBLEMA",       description: "Problema articulado",     advanceType: "automatic", icon: "Search",       order: 2 },
  { id: "validacao",     number: 3, displayName: "VALIDACAO",      description: "Hipotese validada",       advanceType: "mentor",    icon: "CheckCircle",  order: 3 },
  { id: "mvp",           number: 4, displayName: "MVP",            description: "Prototipo funcional",     advanceType: "mentor",    icon: "Hammer",       order: 4 },
  { id: "sol_validada",  number: 5, displayName: "SOL. VALIDADA",  description: "Solucao confirmada",      advanceType: "mentor",    icon: "BadgeCheck",   order: 5 },
  { id: "pitch",         number: 6, displayName: "PITCH",          description: "Apresentacao final",      advanceType: "mentor",    icon: "Mic",          order: 6 },
  { id: "hero",          number: 7, displayName: "HERO",           description: "Jornada completa!",       advanceType: "automatic", icon: "Trophy",       order: 7 },
];
```

### CardData

```typescript
interface CardData {
  /** URL da imagem do card gerada pelo n8n */
  image_url: string;

  /** Titulo opcional do card */
  title?: string;

  /** Subtitulo opcional */
  subtitle?: string;
}
```

### CelebrationQueueItem

```typescript
interface CelebrationQueueItem {
  /** ID unico da celebracao (para deduplicacao) */
  id: string;

  /** ID da equipe */
  team_id: string;

  /** Nome da equipe (para exibicao durante celebracao) */
  team_name: string;

  /** Cor da equipe */
  team_color: string;

  /** Tipo de celebracao */
  celebration_type: CelebrationType;

  /** Etapa de origem (para contexto visual) */
  from_stage: StageId;

  /** Etapa de destino */
  to_stage: StageId;

  /** Card para exibir durante celebracao */
  card: CardData | null;

  /** Timestamp do evento original */
  timestamp: string;
}

type CelebrationType =
  | "light"        // ~2s
  | "medium"       // ~3s
  | "medium_high"  // ~5s
  | "max"          // ~8s
  | "pivot";       // ~3s
```

### ConnectionState (para UI de reconexao)

```typescript
interface ConnectionState {
  status: ConnectionStatus;
  lastConnectedAt: string | null;
  reconnectAttempts: number;
  nextRetryIn: number | null; // ms ate proxima tentativa
}
```

---

## Fluxo de Atualizacao de Estado

### Conexao Inicial / Reconexao

```
WebSocket conecta
    |
    v
Recebe evento `sync`
    |
    v
Substitui PanelState.teams inteiro
    |
    v
Renderiza trilha com todas as equipes
```

### Stage Update

```
Recebe evento `stage_update`
    |
    v
Atualiza TeamState.current_stage
    |
    v
Atualiza TeamState.card (se presente)
    |
    v
Muda TeamState.visual_state para "celebrating"
    |
    v
Enfileira CelebrationQueueItem
    |
    v
Processa fila (se nao ha celebracao ativa)
    |
    v
Apos celebracao, muda visual_state para "active"
```

### Pivot

```
Recebe evento `pivot`
    |
    v
Atualiza TeamState.current_stage para to_stage
    |
    v
Incrementa TeamState.pivot_count
    |
    v
Marca TeamState.is_pivoted = true
    |
    v
Muda TeamState.visual_state para "celebrating" -> depois "pivoted"
    |
    v
Enfileira celebracao tipo "pivot"
```

### Hero

```
Recebe evento `hero`
    |
    v
Atualiza TeamState.current_stage para "hero"
    |
    v
Marca TeamState.is_hero = true
    |
    v
Atualiza TeamState.card com card_hero
    |
    v
Enfileira celebracao tipo "max" (prioridade maxima na fila)
    |
    v
Apos celebracao, muda visual_state para "hero" (permanente)
```

---

## Persistencia (Opcional -- Fase 2)

### localStorage

```typescript
// Salvar estado apos cada atualizacao
const STORAGE_KEY = "sw-painel-state";

interface PersistedState {
  teams: TeamState[];       // Array (Map nao serializa diretamente)
  lastSyncAt: string;
  savedAt: string;          // Timestamp do save
}

// Carregar como fallback antes do sync
function loadPersistedState(): PersistedState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}
```

**Regra:** O estado do localStorage e apenas fallback visual. Assim que o evento `sync` chega via WebSocket, o estado do localStorage e completamente substituido.

---

## Notas

1. **Sem banco de dados**: O MVP nao usa SQLite, Prisma, nem nenhum banco. Tudo e in-memory.
2. **Fonte de verdade**: O Gerencial (via evento `sync`) e a unica fonte de verdade. O SW Painel e um "thin client" de visualizacao.
3. **Volume**: Maximo ~15 equipes. O Map em memoria lida facilmente com esse volume.
4. **Deduplicacao**: Usar `CelebrationQueueItem.id` para evitar celebracoes duplicadas em caso de eventos repetidos.
5. **GC**: Com 15 equipes e poucos eventos por hora, garbage collection nao e preocupacao. Sem risco de memory leak com este volume.
