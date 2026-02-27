# Implementation Plan - SW Painel

> Plano de implementacao com rastreabilidade completa de User Stories ate commits.

## Resumo

| Metrica | Valor |
|---------|-------|
| User Stories | 29 |
| Tasks Total | 24 |
| Tasks DEV | 18 |
| Tasks QA | 4 |
| Tasks ARCH | 1 (Done) |
| Gerado em | 2026-02-27 |
| Status | AGUARDANDO APROVACAO |

---

## Fases de Implementacao

O plano segue as 3 fases definidas no Discovery:
- **Fase 1 -- MVP**: Conexao, trilha, cards, celebracao basica
- **Fase 2 -- Visual Completo**: 4 niveis celebracao, estados visuais, admin
- **Fase 3 -- Polish**: Performance, som, resiliencia 54h

---

## Fase 1 -- MVP

### TASK-001-ARCH: Setup do Projeto e Arquitetura

| Campo | Valor |
|-------|-------|
| **ID** | TASK-001-ARCH |
| **Agente** | architect |
| **Descricao** | Definir stack, ADRs, folder structure, component tree, state management, WebSocket architecture |
| **Depende de** | - |
| **Tamanho** | L |
| **Status** | Done |
| **User Stories** | Todas (fundacao) |

---

### TASK-002-DEV: Setup Next.js + TypeScript + Tailwind + Zustand

| Campo | Valor |
|-------|-------|
| **ID** | TASK-002-DEV |
| **Agente** | developer |
| **Descricao** | Inicializar projeto Next.js 15 com App Router, TypeScript strict, Tailwind CSS, Zustand. Configurar fonts (Montserrat Black + Inter via next/font local). Criar folder structure base. Configurar `tailwind.config.ts` com paleta de cores. Configurar route groups `(display)` e `(admin)`. |
| **Depende de** | TASK-001-ARCH |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | Fundacao para todas |

**Pre-Flight Checks:**
```bash
[ -f "artifacts/03-architecture/folder-structure.md" ] && echo "OK folder-structure" || echo "BLOCKED"
[ -f "artifacts/03-architecture/adr/ADR-003-animation-stack.md" ] && echo "OK ADR-003" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/app/layout.tsx" ] && echo "OK root layout" || echo "MISSING"
[ -f "src/app/(display)/layout.tsx" ] && echo "OK display layout" || echo "MISSING"
[ -f "src/app/(display)/page.tsx" ] && echo "OK display page" || echo "MISSING"
[ -f "tailwind.config.ts" ] && echo "OK tailwind config" || echo "MISSING"
[ -f "src/stores/panel-store.ts" ] && echo "OK store" || echo "MISSING"
npx tsc --noEmit 2>&1 | tail -5
```

---

### TASK-003-DEV: Types e Constantes

| Campo | Valor |
|-------|-------|
| **ID** | TASK-003-DEV |
| **Agente** | developer |
| **Descricao** | Criar todos os tipos TypeScript em `src/types/` baseados no contrato WebSocket (`api-contract.md`) e modelo de dados (`data-model.md`). Criar constantes em `src/lib/constants.ts` (STAGES array, cores, duracoes de celebracao). Criar `src/lib/env.ts` com `requireEnv()`. |
| **Depende de** | TASK-002-DEV |
| **Tamanho** | S |
| **Status** | Done |
| **User Stories** | Fundacao para US-001 a US-009 |

**Pre-Flight Checks:**
```bash
[ -d "src/types" ] && echo "OK types dir" || echo "BLOCKED"
[ -f "artifacts/01-discovery/api-contract.md" ] && echo "OK contract" || echo "BLOCKED"
[ -f "artifacts/01-discovery/data-model.md" ] && echo "OK data model" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/types/events.ts" ] && echo "OK events.ts" || echo "MISSING"
[ -f "src/types/state.ts" ] && echo "OK state.ts" || echo "MISSING"
[ -f "src/types/stages.ts" ] && echo "OK stages.ts" || echo "MISSING"
[ -f "src/lib/constants.ts" ] && echo "OK constants.ts" || echo "MISSING"
[ -f "src/lib/env.ts" ] && echo "OK env.ts" || echo "MISSING"
grep -q "StageId" src/types/stages.ts && echo "OK StageId" || echo "MISSING StageId"
grep -q "WebSocketMessage" src/types/events.ts && echo "OK WSMessage" || echo "MISSING WSMessage"
```

---

### TASK-004-DEV: Zustand Store Principal

| Campo | Valor |
|-------|-------|
| **ID** | TASK-004-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `panel-store.ts` com estado e todas as actions conforme `state-management.md`. Incluir: handleSync, handleStageUpdate, handleWaiting, handlePivot, handleHero, handlePanelControl, handleCelebration. Celebration queue com prioridade HERO. Selectors granulares. |
| **Depende de** | TASK-003-DEV |
| **Tamanho** | L |
| **Status** | Done |
| **User Stories** | US-003, US-004, US-005, US-006, US-007, US-008, US-009 |

**Pre-Flight Checks:**
```bash
[ -f "src/types/events.ts" ] && echo "OK types" || echo "BLOCKED"
[ -f "src/types/state.ts" ] && echo "OK state types" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/stores/panel-store.ts" ] && echo "OK store" || echo "MISSING"
grep -q "handleSync" src/stores/panel-store.ts && echo "OK handleSync" || echo "MISSING"
grep -q "handleStageUpdate" src/stores/panel-store.ts && echo "OK handleStageUpdate" || echo "MISSING"
grep -q "enqueueCelebration" src/stores/panel-store.ts && echo "OK celebration queue" || echo "MISSING"
grep -q "finishCelebration" src/stores/panel-store.ts && echo "OK finishCelebration" || echo "MISSING"
```

---

### TASK-005-DEV: WebSocket Client com Reconexao

| Campo | Valor |
|-------|-------|
| **ID** | TASK-005-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `ws-client.ts` (classe WebSocketClient com exponential backoff, jitter, inactivity timeout) e `event-parser.ts` (parser e validador). Implementar `use-websocket.ts` hook que conecta o WS ao store. Seguir `websocket-architecture.md` e `ADR-005`. |
| **Depende de** | TASK-004-DEV |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | US-001, US-002, US-026 |

**Pre-Flight Checks:**
```bash
[ -f "src/stores/panel-store.ts" ] && echo "OK store" || echo "BLOCKED"
[ -f "artifacts/03-architecture/websocket-architecture.md" ] && echo "OK WS arch" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/lib/ws-client.ts" ] && echo "OK ws-client" || echo "MISSING"
[ -f "src/lib/event-parser.ts" ] && echo "OK parser" || echo "MISSING"
[ -f "src/hooks/use-websocket.ts" ] && echo "OK hook" || echo "MISSING"
grep -q "exponential\|backoff\|retryCount" src/lib/ws-client.ts && echo "OK backoff" || echo "MISSING backoff"
```

---

### TASK-006-DEV: Layout Fullscreen 1:2 e Root Layouts

| Campo | Valor |
|-------|-------|
| **ID** | TASK-006-DEV |
| **Agente** | developer |
| **Descricao** | Implementar root layout com fonts, display layout fullscreen com aspect-ratio 1:2 (2m altura x 4m largura), fundo `#0F0A1A`, sem scroll. Implementar `globals.css` com Tailwind e custom properties para paleta. Implementar `use-fullscreen.ts` hook. |
| **Depende de** | TASK-002-DEV |
| **Tamanho** | S |
| **Status** | Done |
| **User Stories** | US-011 |

**Post-Implementation Check:**
```bash
grep -q "aspect-ratio\|aspect" src/app/\(display\)/layout.tsx && echo "OK aspect" || echo "MISSING"
grep -q "0F0A1A" src/app/globals.css && echo "OK bg color" || echo "MISSING"
```

---

### TASK-007-DEV: Trilha Board Game (JourneyTrack + StageNode)

| Campo | Valor |
|-------|-------|
| **ID** | TASK-007-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `journey-board.tsx`, `journey-track.tsx`, `stage-node.tsx`, `stage-connector.tsx`, `stage-label.tsx`. Renderizar as 8 etapas na trilha com nomes e icones. Layout adaptavel a proporcao 1:2. Labels legiveis (Montserrat Black, tamanho grande). |
| **Depende de** | TASK-006-DEV, TASK-003-DEV |
| **Tamanho** | L |
| **Status** | Done |
| **User Stories** | US-010, US-013 |

**Pre-Flight Checks:**
```bash
[ -f "src/lib/constants.ts" ] && echo "OK constants" || echo "BLOCKED"
[ -f "src/app/(display)/layout.tsx" ] && echo "OK display layout" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/components/board/journey-board.tsx" ] && echo "OK board" || echo "MISSING"
[ -f "src/components/board/journey-track.tsx" ] && echo "OK track" || echo "MISSING"
[ -f "src/components/board/stage-node.tsx" ] && echo "OK node" || echo "MISSING"
grep -rn "STAGES\|StageDefinition" src/components/board/ | head -5
```

---

### TASK-008-DEV: TeamCard e CardImage com Fallback

| Campo | Valor |
|-------|-------|
| **ID** | TASK-008-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `team-card.tsx` com Framer Motion `layoutId` para animacao automatica entre etapas. Implementar `card-image.tsx` com `<img>` + fallback `onError`. Implementar `card-placeholder.tsx` com nome + cor. Implementar `cards-cluster.tsx` para organizar multiplos cards na mesma etapa sem sobreposicao. |
| **Depende de** | TASK-007-DEV, TASK-004-DEV |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | US-014, US-015, US-012, US-027 |

**Pre-Flight Checks:**
```bash
[ -f "src/components/board/stage-node.tsx" ] && echo "OK stage-node" || echo "BLOCKED"
[ -f "src/stores/panel-store.ts" ] && echo "OK store" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
[ -f "src/components/cards/team-card.tsx" ] && echo "OK card" || echo "MISSING"
[ -f "src/components/cards/card-image.tsx" ] && echo "OK image" || echo "MISSING"
[ -f "src/components/cards/card-placeholder.tsx" ] && echo "OK placeholder" || echo "MISSING"
[ -f "src/components/cards/cards-cluster.tsx" ] && echo "OK cluster" || echo "MISSING"
grep -q "layoutId\|layout" src/components/cards/team-card.tsx && echo "OK layout anim" || echo "MISSING"
```

---

### TASK-009-DEV: Display Page -- Integracao Completa

| Campo | Valor |
|-------|-------|
| **ID** | TASK-009-DEV |
| **Agente** | developer |
| **Descricao** | Montar a pagina `(display)/page.tsx` integrando: JourneyBoard + useWebSocket + ConnectionIndicator. Conectar WS ao store. Garantir que sync renderiza equipes, stage_update move cards. Implementar `connection-indicator.tsx` (dot no canto). |
| **Depende de** | TASK-005-DEV, TASK-007-DEV, TASK-008-DEV |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | US-001, US-003, US-004, US-009, US-026 |

**Pre-Flight Checks:**
```bash
[ -f "src/hooks/use-websocket.ts" ] && echo "OK ws hook" || echo "BLOCKED"
[ -f "src/components/board/journey-board.tsx" ] && echo "OK board" || echo "BLOCKED"
[ -f "src/components/cards/team-card.tsx" ] && echo "OK card" || echo "BLOCKED"
```

**Post-Implementation Check:**
```bash
grep -q "useWebSocket\|use-websocket" src/app/\(display\)/page.tsx src/components/board/journey-board.tsx 2>/dev/null && echo "OK WS connected" || echo "MISSING WS"
grep -q "ConnectionIndicator\|connection-indicator" src/components/board/journey-board.tsx && echo "OK indicator" || echo "MISSING"
```

---

### TASK-010-DEV: Celebracao Basica (unico nivel)

| Campo | Valor |
|-------|-------|
| **ID** | TASK-010-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `celebration-overlay.tsx` com AnimatePresence. Implementar `celebration-light.tsx` como celebracao unica basica (flash + scale + pulse, ~2-3s). Implementar `celebration-queue-manager.tsx` (headless, processa fila sequencialmente). Para MVP, todos os tipos usam a mesma celebracao basica. |
| **Depende de** | TASK-009-DEV |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | US-017, US-016 (parcial: active + celebrating) |

**Post-Implementation Check:**
```bash
[ -f "src/components/celebrations/celebration-overlay.tsx" ] && echo "OK overlay" || echo "MISSING"
[ -f "src/components/celebrations/celebration-light.tsx" ] && echo "OK light" || echo "MISSING"
[ -f "src/components/celebrations/celebration-queue-manager.tsx" ] && echo "OK queue mgr" || echo "MISSING"
```

---

### TASK-011-QA: Testes MVP com Eventos Simulados

| Campo | Valor |
|-------|-------|
| **ID** | TASK-011-QA |
| **Agente** | qa-tester |
| **Descricao** | Criar script de teste que simula servidor WebSocket enviando eventos sync, stage_update. Verificar: conexao inicial, sync renderiza equipes, stage_update move card e dispara celebracao, reconexao apos desconexao preserva estado visual. Testar com 8 e 15 equipes. |
| **Depende de** | TASK-009-DEV, TASK-010-DEV |
| **Tamanho** | M |
| **Status** | Pending |
| **User Stories** | US-001, US-002, US-003, US-004, US-009, US-010, US-011, US-012, US-014, US-015, US-017, US-026, US-027 |

---

## Fase 2 -- Visual Completo

### TASK-012-DEV: 4 Niveis de Celebracao + Canvas Particulas

| Campo | Valor |
|-------|-------|
| **ID** | TASK-012-DEV |
| **Agente** | developer |
| **Descricao** | Implementar celebracoes diferenciadas: `celebration-medium.tsx` (~3s), `celebration-medium-high.tsx` (~5s, particulas via Canvas), `celebration-hero.tsx` (~8s, takeover completo + fogos dourados), `celebration-pivot.tsx` (~3s, recalcular rota). Implementar `particle-canvas.tsx` e `particle-system.ts`. Overlay seleciona componente por `celebration_type`. |
| **Depende de** | TASK-010-DEV |
| **Tamanho** | XL |
| **Status** | Done |
| **User Stories** | US-017, US-018, US-019, US-020 |

**Post-Implementation Check:**
```bash
[ -f "src/components/celebrations/celebration-medium.tsx" ] && echo "OK medium" || echo "MISSING"
[ -f "src/components/celebrations/celebration-medium-high.tsx" ] && echo "OK medium-high" || echo "MISSING"
[ -f "src/components/celebrations/celebration-hero.tsx" ] && echo "OK hero" || echo "MISSING"
[ -f "src/components/celebrations/celebration-pivot.tsx" ] && echo "OK pivot" || echo "MISSING"
[ -f "src/components/celebrations/particle-canvas.tsx" ] && echo "OK canvas" || echo "MISSING"
[ -f "src/lib/particle-system.ts" ] && echo "OK particle system" || echo "MISSING"
```

---

### TASK-013-DEV: Fila de Celebracoes com Prioridade

| Campo | Valor |
|-------|-------|
| **ID** | TASK-013-DEV |
| **Agente** | developer |
| **Descricao** | Refinar `celebration-queue-manager.tsx` para processar fila sequencialmente com prioridade HERO (inserido no inicio da fila). Delay de 300ms entre celebracoes para transicao suave. Garantir deduplicacao por ID. |
| **Depende de** | TASK-012-DEV |
| **Tamanho** | S |
| **Status** | Done |
| **User Stories** | US-021 |

---

### TASK-014-DEV: Estados Visuais Completos dos Cards

| Campo | Valor |
|-------|-------|
| **ID** | TASK-014-DEV |
| **Agente** | developer |
| **Descricao** | Implementar variantes Framer Motion para todos os 5 estados visuais: `active` (solido), `waiting` (pulsacao/glow), `celebrating` (animacao ativa), `pivoted` (contorno tracejado + icone recalculo), `hero` (dourado permanente). Implementar `card-states.ts` com variants definition. |
| **Depende de** | TASK-008-DEV |
| **Tamanho** | M |
| **Status** | Done |
| **User Stories** | US-016, US-005, US-006, US-007 |

**Post-Implementation Check:**
```bash
grep -q "waiting\|pivoted\|hero" src/components/cards/card-states.tsx 2>/dev/null && echo "OK states" || echo "MISSING"
grep -q "variants\|animate" src/components/cards/team-card.tsx && echo "OK animation" || echo "MISSING"
```

---

### TASK-015-DEV: Card HERO Especial

| Campo | Valor |
|-------|-------|
| **ID** | TASK-015-DEV |
| **Agente** | developer |
| **Descricao** | Estado visual HERO permanente: borda dourada `#FFD700`, glow dourado, badge de trofeu. Card HERO usa `card_hero` (imagem especial do n8n). O visual HERO persiste apos a celebracao terminar. |
| **Depende de** | TASK-014-DEV |
| **Tamanho** | S |
| **Status** | Done |
| **User Stories** | US-007, US-016 |

---

### TASK-016-DEV: Admin Dashboard

| Campo | Valor |
|-------|-------|
| **ID** | TASK-016-DEV |
| **Agente** | developer |
| **Descricao** | Implementar pagina `/admin` com: `admin-login.tsx` (senha via env var `ADMIN_PASSWORD`), `admin-dashboard.tsx`, `team-list.tsx` (lista equipes com etapa e estado), `connection-status.tsx` (status WS detalhado), `panel-controls.tsx` (pause/resume/reset). Implementar `admin-store.ts`. |
| **Depende de** | TASK-004-DEV, TASK-002-DEV |
| **Tamanho** | L |
| **Status** | Done |
| **User Stories** | US-022, US-024 |

**Post-Implementation Check:**
```bash
[ -f "src/app/(admin)/admin/page.tsx" ] && echo "OK admin page" || echo "MISSING"
[ -f "src/components/admin/admin-dashboard.tsx" ] && echo "OK dashboard" || echo "MISSING"
[ -f "src/components/admin/admin-login.tsx" ] && echo "OK login" || echo "MISSING"
[ -f "src/components/admin/panel-controls.tsx" ] && echo "OK controls" || echo "MISSING"
[ -f "src/stores/admin-store.ts" ] && echo "OK admin store" || echo "MISSING"
```

---

### TASK-017-DEV: Override Manual de Celebracao

| Campo | Valor |
|-------|-------|
| **ID** | TASK-017-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `celebration-trigger.tsx` no admin: selecionar equipe + tipo de celebracao + disparar. Usa `triggerManualCelebration()` do store. A celebracao e identica a automatica (enfileirada normalmente). |
| **Depende de** | TASK-016-DEV, TASK-012-DEV |
| **Tamanho** | S |
| **Status** | Pending |
| **User Stories** | US-023 |

---

### TASK-018-DEV: Persistencia localStorage

| Campo | Valor |
|-------|-------|
| **ID** | TASK-018-DEV |
| **Agente** | developer |
| **Descricao** | Adicionar middleware `persist` do Zustand ao `panel-store.ts`. Persistir apenas `teams` e `lastSyncAt` em localStorage. No reload, carregar estado do localStorage como fallback ate `sync` chegar. |
| **Depende de** | TASK-004-DEV |
| **Tamanho** | S |
| **Status** | Done |
| **User Stories** | US-028 |

---

### TASK-019-QA: Testes Fase 2 -- Celebracoes e Estados

| Campo | Valor |
|-------|-------|
| **ID** | TASK-019-QA |
| **Agente** | qa-tester |
| **Descricao** | Testar: 4 niveis de celebracao com animacoes corretas, fila sequencial com prioridade HERO, 5 estados visuais dos cards, admin login/controles, override manual, pause/resume com acumulo de eventos, localStorage fallback. |
| **Depende de** | TASK-012-DEV a TASK-018-DEV |
| **Tamanho** | L |
| **Status** | Pending |
| **User Stories** | US-005 a US-008, US-016 a US-024, US-028 |

---

## Fase 3 -- Polish

### TASK-020-DEV: Otimizacao 60fps

| Campo | Valor |
|-------|-------|
| **ID** | TASK-020-DEV |
| **Agente** | developer |
| **Descricao** | Profile e otimizar para 60fps constante: `will-change` CSS, `transform` e `opacity` para GPU, reducao de re-renders via memo/selectors, Canvas cleanup, requestAnimationFrame otimizado. Testar com 15 equipes + celebracao HERO simultanea. |
| **Depende de** | TASK-012-DEV |
| **Tamanho** | M |
| **Status** | Pending |
| **User Stories** | US-029 |

---

### TASK-021-DEV: Som nas Celebracoes (Opcional)

| Campo | Valor |
|-------|-------|
| **ID** | TASK-021-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `sound-manager.ts` com Web Audio API. Preload de sons. Toggle no admin (off por padrao). Volume controlavel. Sons por tipo de celebracao conforme ADR-006. |
| **Depende de** | TASK-016-DEV |
| **Tamanho** | M |
| **Status** | Pending |
| **User Stories** | ADR-006 |

---

### TASK-022-DEV: Log de Eventos no Admin

| Campo | Valor |
|-------|-------|
| **ID** | TASK-022-DEV |
| **Agente** | developer |
| **Descricao** | Implementar `event-log.tsx` no admin: lista scrollavel de todos os eventos WebSocket com timestamp, tipo, dados resumidos. Auto-scroll para mais recente. Eventos com erro destacados em vermelho. Limitar buffer a 500 entradas. |
| **Depende de** | TASK-016-DEV |
| **Tamanho** | S |
| **Status** | Pending |
| **User Stories** | US-025 |

---

### TASK-023-QA: Teste de Resiliencia 54h

| Campo | Valor |
|-------|-------|
| **ID** | TASK-023-QA |
| **Agente** | qa-tester |
| **Descricao** | Teste automatizado acelerado: simular 54h de eventos em 2-4h. Monitorar: memory usage (sem leak), frame rate (60fps), reconexoes, estado consistente. Teste manual de 4-8h em ambiente similar ao evento. |
| **Depende de** | TASK-020-DEV |
| **Tamanho** | L |
| **Status** | Pending |
| **User Stories** | US-029 |

---

### TASK-024-DEV: Otimizacao para Resolucao LED

| Campo | Valor |
|-------|-------|
| **ID** | TASK-024-DEV |
| **Agente** | developer |
| **Descricao** | Ajustar tamanhos de fonte, espacamento, e layout para resolucao real do LED de 2x4m. Testar no hardware real ou simulador com resolucao equivalente. Garantir legibilidade a 10-15m. |
| **Depende de** | TASK-020-DEV |
| **Tamanho** | M |
| **Status** | Pending |
| **User Stories** | US-011, US-013 |

---

## Grafo de Dependencias

```
TASK-001-ARCH (Done)
    |
    v
TASK-002-DEV (Setup)
    |
    +---> TASK-003-DEV (Types) ---> TASK-004-DEV (Store) ---> TASK-005-DEV (WebSocket)
    |         |                         |                          |
    |         v                         |                          |
    +---> TASK-006-DEV (Layout)         |                          |
              |                         |                          |
              v                         |                          |
         TASK-007-DEV (Trilha) <--------+                          |
              |                                                    |
              v                                                    |
         TASK-008-DEV (Cards) <------------------------------------+
              |                                                    |
              v                                                    |
         TASK-009-DEV (Integracao) <-------------------------------+
              |
              v
         TASK-010-DEV (Celebracao basica)
              |
              +---> TASK-011-QA (Testes MVP)
              |
              v
         TASK-012-DEV (4 niveis celebracao)
              |
              +---> TASK-013-DEV (Fila prioridade)
              |
              +---> TASK-014-DEV (Estados visuais) ---> TASK-015-DEV (HERO)
              |
              +---> TASK-020-DEV (60fps) ---> TASK-023-QA (Resiliencia)
              |                           |
              |                           +---> TASK-024-DEV (LED)
              v
         TASK-016-DEV (Admin) <--- TASK-004-DEV
              |
              +---> TASK-017-DEV (Override) <--- TASK-012-DEV
              +---> TASK-021-DEV (Som)
              +---> TASK-022-DEV (Event log)

         TASK-018-DEV (localStorage) <--- TASK-004-DEV

         TASK-019-QA (Testes Fase 2) <--- TASK-012 a TASK-018
```

## Ordem de Execucao

| Ordem | Tasks | Paralelizavel? | Fase |
|-------|-------|----------------|------|
| 1 | TASK-002-DEV | Nao | 1 |
| 2 | TASK-003-DEV, TASK-006-DEV | Sim (independentes) | 1 |
| 3 | TASK-004-DEV | Nao (depende de TASK-003) | 1 |
| 4 | TASK-005-DEV, TASK-007-DEV | Sim (independentes) | 1 |
| 5 | TASK-008-DEV | Nao (depende de TASK-007 + store) | 1 |
| 6 | TASK-009-DEV | Nao (integracao) | 1 |
| 7 | TASK-010-DEV | Nao | 1 |
| 8 | TASK-011-QA | Nao | 1 |
| 9 | TASK-012-DEV, TASK-014-DEV, TASK-016-DEV, TASK-018-DEV | Sim (independentes) | 2 |
| 10 | TASK-013-DEV, TASK-015-DEV, TASK-017-DEV | Nao (dependencias) | 2 |
| 11 | TASK-019-QA | Nao | 2 |
| 12 | TASK-020-DEV, TASK-021-DEV, TASK-022-DEV | Sim (independentes) | 3 |
| 13 | TASK-023-QA, TASK-024-DEV | Nao (depende de TASK-020) | 3 |

## Estimativa de Esforco

### Por Tamanho

| Tamanho | Pontos | Descricao |
|---------|--------|-----------|
| XS | 1 | < 1 hora, trivial |
| S | 2 | 1-4 horas, simples |
| M | 3 | 4-8 horas, moderado |
| L | 5 | 1-2 dias, complexo |
| XL | 8 | 2-5 dias, muito complexo |

### Por Fase

| Fase | Tasks | Pontos |
|------|-------|--------|
| Fase 1 -- MVP | TASK-002 a TASK-011 | 3+2+5+3+2+5+3+3+3+3 = 32 |
| Fase 2 -- Visual Completo | TASK-012 a TASK-019 | 8+2+3+2+5+2+2+5 = 29 |
| Fase 3 -- Polish | TASK-020 a TASK-024 | 3+3+2+5+3 = 16 |
| **Total** | **24 tasks** | **77 pontos** |

### Estimativa de Calendario

Com 1 desenvolvedor:
- **Fase 1**: ~8-10 dias uteis
- **Fase 2**: ~8-10 dias uteis
- **Fase 3**: ~5-7 dias uteis
- **Total**: ~21-27 dias uteis (4-5 semanas)

---

## Secao de Aprovacao

**Status:** AGUARDANDO APROVACAO

### Checklist

- [x] Todas as User Stories tem tasks definidas
- [x] Todas as dependencias estao mapeadas
- [x] Tasks ARCH referenciam documentos de arquitetura
- [x] Tasks DEV tem escopo claro e pre-flight checks
- [x] Tasks QA cobrem criterios de aceite por fase
- [x] Estimativas sao razoaveis
- [ ] Aprovacao humana

### Assinaturas

| Papel | Nome | Data | Assinatura |
|-------|------|------|------------|
| Arquiteto | STRAAS Architect | 2026-02-27 | Done |
| Revisor Humano | | | Pendente |

---

*Gerado com STRAAS Implementation Planning v1.0*
