# SW Painel

## Project Info

| Field | Value |
|-------|-------|
| **Project** | SW Painel |
| **Client** | Startup Weekend |
| **Type** | Greenfield |
| **Start Date** | 2026-02-27 |
| **Status** | Architecture Complete -- Awaiting Plan Approval |

## Description

Painel digital fullscreen para LED de 2x4m (proporcao 1:2) que exibe a jornada "From Zero to Hero" de todas as equipes do Startup Weekend em tempo real. Recebe eventos via WebSocket do Gerencial, renderiza trilha board game com 8 etapas, e dispara celebracoes visuais com 4 niveis de intensidade a cada avanço.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Animations | Framer Motion + Canvas 2D |
| State | Zustand (in-memory) |
| Real-time | WebSocket client (/ws/journey) |
| Fonts | Montserrat Black + Inter (next/font local) |

## Architecture Overview

```
Plataforma Mentores (Sofia) -> Mentor aprova -> n8n gera card -> WebSocket /ws/journey -> SW Painel renderiza + celebracao
```

## Pipeline

| Phase | Directory | Status | Agent |
|-------|-----------|--------|-------|
| Audit | 00-audit/ | Skip (greenfield) | - |
| Discovery | 01-discovery/ | Done | Product Strategist |
| Design | 02-design/ | Done | UX/UI Designer |
| Architecture | 03-architecture/ | Done | Architect |
| Development | src/ | Pending (awaiting plan approval) | Frontend Developer |
| QA | 04-qa/ | Pending | QA Tester |
| Deploy | 05-deploy/ | Pending | DevOps |

## Key Decisions (Resolved)

1. **DEC-01**: Horizontal orientation confirmed (2m height x 4m width)
2. **DEC-02**: Layout serpentina (2 fileiras, 4 etapas cada, caminho em S)
3. **DEC-03/06**: Fan-out vertical com redimensionamento adaptativo (200px -> 170px -> 140px min)
4. **DEC-04**: Sistema de energia violeta (glow + particulas na paleta, sem confetti generico)
5. **DEC-05**: WebSocket (Gerencial endpoint already defines WS protocol)
6. **DEC-06**: Zustand for state management (granular selectors, works outside React)
7. **DEC-07**: Sound optional, Phase 3, Web Audio API, off by default
8. **DEC-08**: Framer Motion (DOM 80%) + Canvas 2D (particles 20%)
9. **DEC-09**: Image cards via `image_url` from n8n (confirmed existing contract)
10. **DEC-10**: Conceito visual "Circuito de Energia" (neural pathway organico)

## Implementation Plan

- **File**: `artifacts/03-architecture/implementation-plan.md`
- **Tasks**: 24 total (1 ARCH Done, 18 DEV, 4 QA, 1 UX N/A)
- **Phases**: 3 (MVP ~10d, Visual ~10d, Polish ~7d)
- **Status**: AWAITING HUMAN APPROVAL

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
