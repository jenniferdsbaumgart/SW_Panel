# SW Painel

## Project Info

| Field | Value |
|-------|-------|
| **Project** | SW Painel |
| **Client** | Startup Weekend |
| **Type** | Greenfield |
| **Start Date** | 2026-02-27 |
| **Status** | Development -- Phase 1 (MVP) Complete |

## Description

Painel digital fullscreen para LED de 2x4m (proporcao 1:2) que exibe a jornada "From Zero to Hero" de todas as equipes do Startup Weekend em tempo real. Recebe eventos via WebSocket do Gerencial, renderiza trilha board game com 8 etapas, e dispara celebracoes visuais com 5 temas tecnologicos a cada avanco.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + Canvas 2D |
| State | Zustand 5.x (persist middleware) |
| Real-time | WebSocket client (/ws/journey) |
| Fonts | Montserrat Black + Inter (next/font local) |

## Architecture Overview

```
Plataforma Mentores (Sofia) -> Mentor aprova -> n8n gera card -> WebSocket /ws/journey -> SW Painel renderiza + celebracao
```

## Pipeline

| Phase | Directory | Files | Status | Agent |
|-------|-----------|-------|--------|-------|
| Audit | 00-audit/ | 0 | Skip (greenfield) | - |
| Discovery | 01-discovery/ | 10 | Done | Product Strategist |
| Design | 02-design/ | 8 + 5 wireframes | Done | UX/UI Designer |
| Architecture | 03-architecture/ | 8 + 6 ADRs | Done | Architect |
| Development | src/ | 49 files | In Progress | Frontend Developer |
| QA | 04-qa/ | 0 | Pending | QA Tester |
| Deploy | 05-deploy/ | 0 | Pending | DevOps |

## Development Status

### Completed (10 commits)

1. **Project setup** -- Next.js 16, Zustand, Framer Motion, Tailwind v4, design tokens
2. **Type definitions** -- StageId, CelebrationType, VisualState (6 states incl. pivoting), events, state
3. **State management** -- Zustand store with celebration queue, deferred pivot stage updates, persist middleware
4. **WebSocket client** -- Exponential backoff, event parser, sync/stage_update/pivot/hero/celebration handlers
5. **Journey board** -- S-curve SVG trail (2 rows x 4 stages), stage nodes, connectors, background blobs
6. **Celebrations** -- 5 themed components (Neural Pulse, Rocket Launch, Circuit Board, Supernova, Recalculating Route) + particle system with 7 presets
7. **Pivot system** -- Dotted L-shaped SVG path outside trail, card travels via getPointAtLength(), deferred stage move
8. **Admin dashboard** -- Login, team list, celebration trigger, event log, panel controls (pause/resume/reset)
9. **Display page** -- Fullscreen 4K layout, celebration queue manager, connection/pause indicators
10. **Demo controls** -- Fake team injection, stage advancement, celebration triggers via `?demo=true`

### Source Structure (49 files)

```
src/
├── app/
│   ├── layout.tsx                         # Root layout with fonts
│   ├── globals.css                        # Global styles + keyframes
│   ├── (display)/
│   │   ├── layout.tsx                     # Display route group
│   │   └── page.tsx                       # Fullscreen display page
│   └── (admin)/
│       ├── layout.tsx                     # Admin route group
│       └── admin/page.tsx                 # Admin dashboard page
├── components/
│   ├── board/
│   │   ├── journey-board.tsx              # Main board container
│   │   ├── journey-track.tsx              # SVG S-curve trail + stage positions
│   │   ├── stage-node.tsx                 # Stage circle with label
│   │   ├── stage-connector.tsx            # Curved path between stages
│   │   ├── stage-label.tsx                # Stage name label
│   │   └── background-blobs.tsx           # Animated background
│   ├── cards/
│   │   ├── team-card.tsx                  # Team card component
│   │   ├── cards-cluster.tsx              # Cards grouped at stage (fan-out)
│   │   ├── card-image.tsx                 # Card image display
│   │   ├── card-placeholder.tsx           # Initials fallback
│   │   └── card-states.ts                # Visual state variants + transitions
│   ├── celebrations/
│   │   ├── celebration-queue-manager.tsx   # Queue orchestrator
│   │   ├── celebration-overlay.tsx         # Overlay dispatcher
│   │   ├── celebration-light.tsx           # Neural Pulse (5s)
│   │   ├── celebration-medium.tsx          # Rocket Launch (6s)
│   │   ├── celebration-medium-high.tsx     # Circuit Board (7s)
│   │   ├── celebration-hero.tsx            # Supernova (10s)
│   │   ├── celebration-pivot.tsx           # Dotted path detour (5s)
│   │   ├── celebration-card.tsx            # Reusable celebration card
│   │   └── particle-canvas.tsx            # Canvas 2D particle renderer
│   ├── admin/
│   │   ├── admin-dashboard.tsx            # Admin main layout
│   │   ├── admin-login.tsx                # Simple password login
│   │   ├── team-list.tsx                  # Team table with states
│   │   ├── celebration-trigger.tsx         # Manual celebration modal
│   │   ├── connection-status.tsx           # WS connection display
│   │   ├── event-log.tsx                  # Event history viewer
│   │   └── panel-controls.tsx             # Pause/resume/reset
│   ├── demo/
│   │   └── demo-controls.tsx              # Test controls (?demo=true)
│   └── ui/
│       ├── connection-indicator.tsx        # Board connection badge
│       └── pause-indicator.tsx             # Pause overlay
├── hooks/
│   ├── use-websocket.ts                   # WebSocket connection hook
│   └── use-fullscreen.ts                  # Fullscreen API hook
├── lib/
│   ├── constants.ts                       # Stages, durations, config
│   ├── env.ts                             # Environment variables
│   ├── event-parser.ts                    # WS message parser
│   ├── particle-system.ts                 # 7 particle presets
│   └── ws-client.ts                       # WebSocket client class
├── stores/
│   ├── panel-store.ts                     # Main Zustand store
│   └── admin-store.ts                     # Admin auth store
└── types/
    ├── index.ts                           # Re-exports
    ├── stages.ts                          # StageId, CelebrationType
    ├── state.ts                           # TeamState, VisualState, CelebrationQueueItem
    ├── events.ts                          # WebSocket event types
    └── celebrations.ts                    # Celebration type definitions
```

## Key Decisions (Resolved)

1. **DEC-01**: Horizontal orientation confirmed (2m height x 4m width)
2. **DEC-02**: Layout serpentina (2 fileiras, 4 etapas cada, caminho em S)
3. **DEC-03/06**: Fan-out vertical com redimensionamento adaptativo (120x144, 100x120, 85x102)
4. **DEC-04**: Sistema de energia violeta (glow + particulas na paleta, sem confetti generico)
5. **DEC-05**: WebSocket (Gerencial endpoint already defines WS protocol)
6. **DEC-06**: Zustand for state management (granular selectors, works outside React)
7. **DEC-07**: Sound optional, Phase 3, Web Audio API, off by default
8. **DEC-08**: Framer Motion (DOM 80%) + Canvas 2D (particles 20%)
9. **DEC-09**: Image cards via `image_url` from n8n (confirmed existing contract)
10. **DEC-10**: Conceito visual "Circuito de Energia" (neural pathway organico)
11. **DEC-11**: Pivot uses deferred stage update -- card moves only after animation completes
12. **DEC-12**: 5 themed celebrations (Neural Pulse, Rocket, Circuit, Supernova, Recalculating)
13. **DEC-13**: Pivot path is L-shaped outside trail (y=82, x=2) with rounded Q corners

## Design Artifacts

- `artifacts/02-design/design-system.md` -- Design System completo (conceito, cores, tipografia, animacoes)
- `artifacts/02-design/design-tokens.json` -- Tokens estruturados em JSON
- `artifacts/02-design/tailwind.config.js` -- Config Tailwind pronto para uso
- `artifacts/02-design/sitemap.md` -- Arquitetura de informacao
- `artifacts/02-design/user-flows.md` -- 5 fluxos criticos
- `artifacts/02-design/components.md` -- Biblioteca de componentes (Display + Admin)
- `artifacts/02-design/wireframes/panel-layout.md` -- Wireframe do painel LED (serpentina)
- `artifacts/02-design/wireframes/card-design.md` -- Design dos cards (5 estados visuais)
- `artifacts/02-design/wireframes/celebrations.md` -- 4 niveis de celebracao + pivot
- `artifacts/02-design/wireframes/admin-panel.md` -- Painel admin (/admin)
- `artifacts/02-design/wireframes/states-and-transitions.md` -- Mapa de estados e transicoes
- `artifacts/02-design/handoff.yaml` -- Handoff para Architect/Developer

## Architecture Artifacts

- `artifacts/03-architecture/adr/ADR-001-websocket-vs-sse.md`
- `artifacts/03-architecture/adr/ADR-002-state-management.md`
- `artifacts/03-architecture/adr/ADR-003-animation-stack.md`
- `artifacts/03-architecture/adr/ADR-004-card-visual.md`
- `artifacts/03-architecture/adr/ADR-005-reconnection-resilience.md`
- `artifacts/03-architecture/adr/ADR-006-sound-celebrations.md`
- `artifacts/03-architecture/folder-structure.md`
- `artifacts/03-architecture/component-tree.md`
- `artifacts/03-architecture/state-management.md`
- `artifacts/03-architecture/websocket-architecture.md`
- `artifacts/03-architecture/implementation-plan.md`
- `artifacts/03-architecture/CLAUDE.md`
- `artifacts/03-architecture/handoff.yaml`

## Next Steps

1. Connect to real WebSocket endpoint and test with live data
2. Polish animations and responsive behaviour for 4K LED
3. Add sound effects (Phase 3, Web Audio API)
4. QA testing with automated test suites
5. Deploy to production
