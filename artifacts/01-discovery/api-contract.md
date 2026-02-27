# Contrato WebSocket - SW Painel

## Visao Geral

O SW Painel e um **cliente WebSocket** que se conecta ao endpoint `/ws/journey` do sistema Gerencial. Toda comunicacao e **unidirecional**: o Gerencial envia eventos, o SW Painel recebe e renderiza. O SW Painel nao expoe server WebSocket proprio.

### Conexao

```
ws://<gerencial-host>/ws/journey
```

### Protocolo

- Protocolo: WebSocket (RFC 6455)
- Formato das mensagens: JSON
- Direcao: Server (Gerencial) -> Client (SW Painel)
- Heartbeat: Gerenciado pelo protocolo WebSocket (ping/pong)

### Reconexao

| Parametro | Valor |
|-----------|-------|
| Tentativa inicial | < 2 segundos apos desconexao |
| Backoff | Exponencial: 2s, 4s, 8s, 16s, 30s (max) |
| Apos reconexao | Aguardar evento `sync` para reconstruir estado |
| Durante desconexao | Manter ultimo estado renderizado (nunca limpar tela) |
| Meta total | Reconexao + sync < 5 segundos |

---

## Eventos Recebidos

### 1. `stage_update`

Emitido quando uma equipe avanca de etapa.

```typescript
interface StageUpdateEvent {
  type: "stage_update";
  team_id: string;
  team_name: string;
  team_color: string;       // Hex color, ex: "#7C3AED"
  from_stage: StageId;      // Ex: "ideia"
  to_stage: StageId;        // Ex: "problema"
  celebration_type: CelebrationType; // "light" | "medium" | "medium_high" | "max"
  card: CardData | null;    // Card gerado pelo n8n (pode ser null)
  timestamp: string;        // ISO 8601
}
```

**Comportamento esperado:**
1. Atualizar estado da equipe em memoria (mover para `to_stage`).
2. Animar card da posicao `from_stage` para `to_stage`.
3. Disparar celebracao do tipo indicado em `celebration_type`.
4. Se `card` presente, atualizar imagem do card.

---

### 2. `waiting`

Emitido quando uma equipe submete para aprovacao de mentor.

```typescript
interface WaitingEvent {
  type: "waiting";
  team_id: string;
  stage: StageId;           // Etapa em que esta aguardando
  timestamp: string;        // ISO 8601
}
```

**Comportamento esperado:**
1. Mudar estado visual do card para "aguardando" (pulsante/brilhante).
2. Manter na mesma posicao da trilha.
3. Estado "aguardando" e removido quando `stage_update` subsequente chega.

---

### 3. `celebration`

Emitido para disparar celebracao avulsa (pode ser redundante com `stage_update`, usado para replays ou triggers manuais).

```typescript
interface CelebrationEvent {
  type: "celebration";
  team_id: string;
  celebration_type: CelebrationType;
  from_stage: StageId;
  to_stage: StageId;
  card: CardData | null;
}
```

**Comportamento esperado:**
1. Disparar celebracao do tipo indicado.
2. Se ja existe celebracao em execucao, enfileirar.

---

### 4. `pivot`

Emitido quando uma equipe muda de direcao.

```typescript
interface PivotEvent {
  type: "pivot";
  team_id: string;
  from_stage: StageId;
  to_stage: StageId;        // Etapa para a qual a equipe retorna
  reason: string;           // Motivo do pivot
  card: CardData | null;    // Novo card pos-pivot
  timestamp: string;        // ISO 8601
}
```

**Comportamento esperado:**
1. Mover card de `from_stage` para `to_stage`.
2. Disparar animacao de pivot (~3s, tom positivo, "recalcular rota").
3. Aplicar estado visual "pivotada" (contorno tracejado + icone).
4. Se `card` presente, atualizar imagem do card.

---

### 5. `hero`

Emitido quando uma equipe completa a jornada inteira.

```typescript
interface HeroEvent {
  type: "hero";
  team_id: string;
  card_hero: CardData;      // Card especial HERO
  timestamp: string;        // ISO 8601
}
```

**Comportamento esperado:**
1. Mover card para etapa HERO (7).
2. Disparar celebracao MAXIMA (~8s, takeover do painel, fogos dourados).
3. Aplicar estado visual "HERO" permanente (dourado).
4. Atualizar card com `card_hero`.

---

### 6. `sync`

Emitido na conexao inicial e apos reconexao. Contem estado completo de todas as equipes.

```typescript
interface SyncEvent {
  type: "sync";
  teams: TeamState[];
}
```

**Comportamento esperado:**
1. Substituir estado completo em memoria.
2. Renderizar todas as equipes nas posicoes corretas.
3. Nao disparar celebracoes (e snapshot de estado, nao transicao).

---

### 7. `panel_control`

Emitido pelo admin para controlar o painel.

```typescript
interface PanelControlEvent {
  type: "panel_control";
  action: "pause" | "resume" | "reset";
}
```

**Comportamento esperado:**
- `pause`: Congelar painel no estado atual. Nao processar novos eventos visuais (acumular em fila).
- `resume`: Retomar processamento. Executar eventos acumulados em sequencia.
- `reset`: Limpar estado em memoria. Aguardar novo `sync`.

---

## Tipos Compartilhados (TypeScript)

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

### CelebrationType

```typescript
type CelebrationType =
  | "light"         // ~2s - etapas iniciais
  | "medium"        // ~3s - transicao para mentor
  | "medium_high"   // ~5s - marcos importantes
  | "max"           // ~8s - HERO
  | "pivot";        // ~3s - mudanca de direcao
```

### CardData

```typescript
interface CardData {
  image_url: string;        // URL da imagem gerada pelo n8n
  title?: string;           // Titulo do card (opcional)
  subtitle?: string;        // Subtitulo (opcional)
}
```

### TeamState

```typescript
interface TeamState {
  team_id: string;
  team_name: string;
  team_color: string;       // Hex color
  current_stage: StageId;
  card: CardData | null;    // Card atual
  is_waiting: boolean;      // Se esta aguardando mentor
  is_pivoted: boolean;      // Se ja pivotou alguma vez
  pivot_count: number;      // Quantas vezes pivotou
  is_hero: boolean;         // Se completou a jornada
}
```

### WebSocketMessage (Union Type)

```typescript
type WebSocketMessage =
  | StageUpdateEvent
  | WaitingEvent
  | CelebrationEvent
  | PivotEvent
  | HeroEvent
  | SyncEvent
  | PanelControlEvent;
```

---

## Fluxo Tipico

```
1. SW Painel conecta em ws://<host>/ws/journey
2. Gerencial envia evento `sync` com estado inicial
3. SW Painel renderiza todas as equipes na trilha
4. Mentor aprova equipe na Sofia
5. n8n processa, gera card, envia para Gerencial
6. Gerencial emite `stage_update` via WebSocket
7. SW Painel recebe, atualiza estado, anima card, dispara celebracao
8. (Repete 4-7 durante 54 horas)
9. Equipe completa jornada -> Gerencial emite `hero`
10. SW Painel dispara celebracao MAXIMA
```

## Notas de Implementacao

1. **Parsing de mensagens**: Toda mensagem WebSocket e JSON. Parsear e discriminar pelo campo `type`.
2. **Ordem de eventos**: Eventos podem chegar fora de ordem. Usar `timestamp` para resolver conflitos quando relevante.
3. **Idempotencia**: O SW Painel deve tolerar eventos duplicados graciosamente (nao duplicar cards, nao re-disparar celebracoes identicas).
4. **Cards**: `CardData.image_url` aponta para imagens geradas externamente pelo n8n. O SW Painel apenas exibe.
5. **Volume**: Maximo ~15 equipes, poucas transicoes por hora. Volume muito baixo.
