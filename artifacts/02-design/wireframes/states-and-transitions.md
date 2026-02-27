# Mapa de Estados e Transições Visuais

## Diagrama de Estados do Card

```
                          ┌─────────────────────────────────────────────────┐
                          │                                                 │
                          ▼                                                 │
  ┌─────────┐    stage_update    ┌────────────┐    celebração    ┌─────────┤──┐
  │         │ ──────────────────→│            │ ──  termina ───→│         │  │
  │  ATIVA  │                    │ CELEBRANDO │                  │  ATIVA  │  │
  │         │←───────────────────│            │                  │         │  │
  └─────┬───┘                    └──────┬─────┘                  └────┬────┘  │
        │                               │                             │       │
        │ waiting                       │ se pivot                    │       │
        ▼                               ▼                             │       │
  ┌───────────┐    stage_update   ┌───────────┐    stage_update      │       │
  │           │ ─────────────────→│           │ ─────────────────────┘       │
  │ AGUARDANDO│   (via celebrando)│ PIVOTADA  │                              │
  │           │                   │           │←──── pivot ──────────────────┘
  └───────────┘                   └─────┬─────┘
                                        │
                                        │ stage_update
                                        ▼
                                  ┌───────────┐
                                  │           │
                                  │ CELEBRANDO│ → retorna a ATIVA
                                  │           │
                                  └───────────┘


                          hero event
  (qualquer estado) ─────────────────→ CELEBRANDO (max) ──→ ┌──────┐
                                                             │      │
                                                             │ HERO │ (permanente)
                                                             │      │
                                                             └──────┘
```

---

## Tabela de Transições

### Transições de Estado Visual

| Estado Atual | Evento | Estado Seguinte | Animação | Duração |
|-------------|--------|----------------|----------|---------|
| Ativa | `stage_update` | Celebrando | Flash + deslize + celebração | 2-8s (conforme tipo) |
| Ativa | `waiting` | Aguardando | Borda muda para verde-limão + pulsação inicia | 300ms para transição |
| Ativa | `pivot` | Celebrando (pivot) | Vibração + deslize | 3s |
| Ativa | `hero` | Celebrando (max) | Flash total + takeover | 8s |
| Aguardando | `stage_update` | Celebrando | Pulsação para, flash + celebração inicia | 2-8s |
| Celebrando | (celebração termina) | Ativa | Fade suave para estado normal | 400ms |
| Celebrando (pivot) | (celebração termina) | Pivotada | Borda muda para tracejada | 300ms |
| Celebrando (max) | (celebração termina) | HERO | Card permanece dourado | 1000ms (zoom out) |
| Pivotada | `stage_update` | Celebrando | Borda tracejada desaparece, celebração | 2-8s |
| Pivotada | `pivot` | Celebrando (pivot) | Vibração + deslize | 3s |
| Pivotada | `waiting` | Aguardando | Borda muda para verde-limão | 300ms |
| HERO | -- | -- | Nenhuma (estado final, irreversível) | -- |

---

## Transições do Painel (Estado Global)

```
┌──────────────┐         sync recebido        ┌──────────────┐
│              │ ────────────────────────────→ │              │
│   LOADING    │                               │    ATIVO     │
│  (inicial)   │ ←─── reload / reconnect ──── │   (normal)   │
│              │                               │              │
└──────────────┘                               └──────┬───────┘
                                                      │
                                         panel_control│ pause
                                                      ▼
                                               ┌──────────────┐
                                               │              │
                                               │   PAUSADO    │
                                               │              │
                                               └──────┬───────┘
                                                      │
                                         panel_control│ resume
                                                      ▼
                                               ┌──────────────┐
                                               │              │
                                               │    ATIVO     │
                                               │              │
                                               └──────────────┘

                                         panel_control reset
                                               │
                                               ▼
                                          LOADING (solicita sync)
```

### Transições de Conexão WebSocket

```
┌──────────────┐        conectado         ┌──────────────┐
│              │ ───────────────────────→ │              │
│  CONNECTING  │                          │  CONNECTED   │
│              │                          │              │
└──────────────┘                          └──────┬───────┘
       ▲                                         │
       │                              desconexão │
       │                                         ▼
       │         tentativa OK         ┌──────────────┐
       │ ←─────────────────────────── │              │
       │                              │ DISCONNECTED │
       │                              │              │
       │         backoff              └──────┬───────┘
       │                                     │
       │                                     ▼
       │                              ┌──────────────┐
       └───────────────────────────── │              │
                                      │ RECONNECTING │
                                      │ (backoff)    │
                                      └──────────────┘
```

---

## Timing Detalhado de Cada Transição

### 1. Avanço de Etapa (stage_update)

```
t=0ms       Evento recebido
t=0-100ms   Estado em memória atualizado
t=100ms     Flash branco no card (se celebração > leve)
t=100-400ms Card inicia deslize para nova posição
t=400ms     Card chega na nova posição (bounce)
t=400ms+    Celebração específica do nível inicia
t=2000-8000ms Celebração termina
t=+400ms    Card retorna ao estado "ativa" (fade)
```

### 2. Aguardando Mentor (waiting)

```
t=0ms       Evento recebido
t=0-100ms   Estado atualizado
t=100-400ms Borda: violeta → verde-limão (transition)
t=400ms     Pulsação verde-limão inicia (ciclo 2s infinito)
t=400ms     Ícone ⏳ aparece (fade in 200ms)
```

### 3. Pivot

```
t=0ms       Evento recebido
t=0-100ms   Estado atualizado
t=100-500ms Card vibra (4 ciclos de +-3px)
t=500ms     Ícone ↺ aparece + traço ondulado SVG
t=500-1600ms Card desliza para nova posição (suave)
t=1600-2000ms Traço ondulado desaparece
t=2000-2400ms Borda transiciona para tracejada + indigo
t=2400-3000ms Estabilização visual
```

### 4. HERO

```
t=0ms       Evento recebido
t=0-100ms   Estado atualizado, celebração enfileirada com prioridade
t=100-500ms Flash branco total do painel (overlay 80%)
t=500-1500ms Trilha desfoca, card centraliza + zoom (scale 2.0)
t=1500-5000ms Card central + nome gigante + partículas douradas espiral
t=5000-7000ms Texto "HERO!" aparece (192px, bounce scale)
t=7000-8000ms Zoom out: card volta para posição HERO na trilha
t=8000ms    Trilha volta ao normal, card no estado HERO permanente
```

### 5. Sync (Reconstrução de Estado)

```
t=0ms       Evento sync recebido
t=0-200ms   Estado em memória substituído completamente
t=200-800ms Cards aparecem nas posições corretas (fade in sequencial)
            Cada card: 100ms delay + 400ms fade in
            Para 12 equipes: ~1600ms total
t=800ms     Trilha totalmente renderizada
            Nenhuma celebração disparada (sync é snapshot, não transição)
```

### 6. Pause / Resume

```
Pause:
t=0ms       Evento panel_control(pause) recebido
t=0ms       isPaused = true, novos eventos acumulam na fila
t=0ms       Painel congela (nenhuma mudança visual para audiência)
t=0ms       Indicador "⏸" aparece no canto (só visível < 2m)

Resume:
t=0ms       Evento panel_control(resume) recebido
t=0ms       isPaused = false
t=0-500ms   Primeiro evento da fila é processado
t=500ms+    Demais eventos processados sequencialmente
            Celebrações executam normalmente
            Indicador "⏸" desaparece
```

### 7. Reset

```
t=0ms       Evento panel_control(reset) recebido
t=0-400ms   Todos os cards fade out (simultâneo)
t=400ms     Trilha limpa, estado vazio
t=400ms     Solicita novo sync via WebSocket
t=400-1200ms Aguarda sync (mostra trilha vazia com nodos)
t=1200ms+   Sync recebido, cards renderizam (como sync normal)
```

---

## Prioridade de Animações (Conflitos)

Quando múltiplos eventos chegam, a prioridade visual é:

| Prioridade | Evento | Comportamento |
|-----------|--------|--------------|
| 1 (Máxima) | HERO takeover | Interrompe tudo. Takeover do painel. |
| 2 | Celebração em execução | Executa até o fim. Novos eventos enfileirados. |
| 3 | Pivot | Enfileirado. Executado após celebrações. |
| 4 | Stage update | Enfileirado. FIFO. |
| 5 | Waiting | Executado imediatamente (não é celebração, é mudança de estado). Não conflita. |
| 6 | Sync | Executado imediatamente. Se celebração em andamento, aguarda término, depois reconstrói. |

**Regra de ouro:** O estado em memória é SEMPRE atualizado imediatamente (t=0). Apenas a representação visual (animação) é enfileirada. Isso garante que o painel nunca perde dados, mesmo que a fila visual esteja cheia.

---

## Mapa de Cores por Transição

| De | Para | Cor da Trilha Ativada | Cor do Flash |
|----|------|----------------------|-------------|
| ZERO | IDEIA | #4C1D95 → #5B21B6 | -- (sem flash) |
| IDEIA | PROBLEMA | #5B21B6 → #6D28D9 | -- (sem flash) |
| PROBLEMA | VALIDAÇÃO | #6D28D9 → #7C3AED | #FFFFFF (branco) |
| VALIDAÇÃO | MVP | #7C3AED → #7C3AED | #FFFFFF |
| MVP | SOL. VALIDADA | #7C3AED → #8B5CF6 | #FFFFFF |
| SOL. VALIDADA | PITCH | #8B5CF6 → #A78BFA | #FFFFFF |
| PITCH | HERO | #A78BFA → #FFD700 | #FFFFFF (total) |
| Qualquer | Pivot | -- | #818CF8 (indigo) |

O filamento de energia entre dois nodos "acende" (glow mais intenso) quando um card passa por ele durante a transição.
