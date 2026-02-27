# SW Painel

## Quick Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint code
- `npx tsc --noEmit` - Type check

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode, no `any`)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (DOM transitions) + Canvas 2D (particle effects)
- **State**: Zustand (in-memory, no database)
- **Real-time**: WebSocket client to `/ws/journey` (Gerencial)
- **Fonts**: Montserrat Black + Inter (next/font local)
- **Deployment**: Static/SSR on any Node.js host

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (display)/              # Public LED panel (fullscreen)
│   │   ├── layout.tsx          # Fullscreen, bg #0F0A1A, no scroll
│   │   └── page.tsx            # Main panel page
│   ├── (admin)/admin/          # Staff admin panel
│   │   └── page.tsx            # Admin dashboard
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   └── globals.css             # Tailwind + custom CSS
├── components/
│   ├── board/                  # Journey track, stages, layout
│   ├── cards/                  # Team cards, visual states
│   ├── celebrations/           # 4 celebration levels + Canvas
│   ├── admin/                  # Admin components
│   └── ui/                     # Base components
├── hooks/                      # useWebSocket, useCelebrationQueue, useFullscreen
├── stores/                     # Zustand stores (panel-store, admin-store)
├── lib/                        # Utils, constants, ws-client, particle-system
└── types/                      # TypeScript interfaces (events, state, stages)
```

## Conventions

- **Files**: kebab-case (`team-card.tsx`)
- **Components**: PascalCase (`TeamCard`)
- **Functions**: camelCase (`handleStageUpdate`)
- **Constants**: SCREAMING_SNAKE (`CELEBRATION_DURATIONS`)
- **Hooks**: camelCase with `use` prefix (`useWebSocket`)
- **Commits**: `feat: [TASK-XXX-DEV] description`

## Architecture Decisions

1. **WebSocket** (not SSE): Gerencial exposes `/ws/journey` as WS. Unidirectional client.
2. **Zustand** (not Context): Granular selectors prevent unnecessary re-renders.
3. **Framer Motion + Canvas 2D**: FM for DOM transitions (80%), Canvas for particles (20%).
4. **Image cards**: n8n sends `image_url`. Panel just renders `<img>`. No client-side generation.
5. **Reconnection**: Exponential backoff (2s, 4s, 8s, 16s, max 30s). State preserved during disconnect.
6. **Sound**: Optional (Phase 3), off by default, toggle in admin.

## Key Constraints

- **Aspect ratio 1:2** (2m height x 4m width LED panel)
- **Readability at 10-15 meters** (large fonts, high contrast)
- **60fps constant** (GPU-accelerated animations only)
- **54 hours continuous operation** (no memory leaks)
- **Latency event-to-animation < 500ms**
- **8-15 simultaneous teams**

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Violeta Intenso | `#7C3AED` | Primary (60%) |
| Preto Noturno | `#0F0A1A` | Background (25%) |
| Branco | `#FFFFFF` | Text/accents (10%) |
| Verde-Limao | `#BFFF00` | Highlights (5%) |
| Dourado | `#FFD700` | HERO state |

**NO warm colors (red, orange, yellow). NO SW skyline.**

## Environment Variables

```bash
# REQUIRED - WebSocket endpoint (app crashes without it)
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws/journey

# REQUIRED for admin (Phase 2)
ADMIN_PASSWORD=your-password-here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOUND_ENABLED=false
```

### requireEnv Pattern (MANDATORY)

```typescript
// src/lib/env.ts
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Usage - NEVER use fallback for secrets
const ADMIN_PASSWORD = requireEnv('ADMIN_PASSWORD');

// Client-side vars use NEXT_PUBLIC_ prefix
// These CAN have fallbacks for dev
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001/ws/journey';
```

## WebSocket Events

The panel receives 7 event types from Gerencial:

| Event | Description | Action |
|-------|-------------|--------|
| `sync` | Full state snapshot | Replace all teams |
| `stage_update` | Team advances | Move card + celebrate |
| `waiting` | Team submitted to mentor | Pulse card |
| `pivot` | Team pivots | Move card back + pivot animation |
| `hero` | Team completes journey | HERO celebration (takeover) |
| `celebration` | Manual/replay celebration | Enqueue celebration |
| `panel_control` | pause/resume/reset | Control panel state |

## State Management Pattern

```typescript
// Read state with granular selectors (prevents re-renders)
const team = usePanelStore((s) => s.teams[teamId]);
const status = usePanelStore((s) => s.connectionStatus);
const celebration = usePanelStore((s) => s.currentCelebration);

// NEVER read entire store
const store = usePanelStore(); // BAD - re-renders on any change

// Update state via actions
store.handleStageUpdate(event);
store.enqueueCelebration(item);
store.finishCelebration();
```

## Types Convention

- Domain types are defined in `src/types/` based on the WebSocket contract
- Types in `src/types/events.ts` are the source of truth for event shapes
- Types in `src/types/state.ts` are the source of truth for state shapes
- NEVER redefine types that exist in `src/types/`
- Use union types for finite sets: `StageId`, `CelebrationType`, `VisualState`, `ConnectionStatus`

## Celebration Levels

| Type | Duration | Visual | When |
|------|----------|--------|------|
| `light` | ~2s | Slide + pulse | Stages 0->1, 1->2 |
| `medium` | ~3s | Flash + highlight | Stage 2->3 |
| `medium_high` | ~5s | Flash + particles + bounce + name | Stages 3->4, 4->5, 5->6 |
| `max` | ~8s | Full takeover + golden fireworks | Stage 6->7 (HERO) |
| `pivot` | ~3s | Route recalculation effect | Any pivot |

**Queue rules:**
- HERO (`max`) gets priority (inserted at front of queue)
- Sequential processing (never overlap)
- 300ms gap between celebrations
- Deduplicate by celebration ID

## Animation Rules

- **DOM animations** (Framer Motion): `transform` and `opacity` ONLY (GPU accelerated)
- **Particle effects** (Canvas 2D): Separate `<canvas>` overlay with `requestAnimationFrame`
- **NEVER animate** `width`, `height`, `top`, `left`, `margin`, `padding` (triggers layout)
- **Always use** `layoutId` on TeamCard for automatic position animations
- **Cleanup Canvas** after every celebration (prevent memory leaks over 54h)

## Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];
```

Note: No CSP/HSTS needed -- this runs on local network for an event, not public internet.

## STRAAS Squad

### Artifacts Directory

Each agent outputs to its designated directory. NEVER save artifacts outside the assigned directory.

```
artifacts/
├── 00-audit/        # Technical auditor outputs
├── 01-discovery/    # Product strategist outputs
├── 02-design/       # UX/UI designer outputs
├── 03-architecture/ # Architect outputs
├── 04-qa/           # QA tester outputs
├── 05-deploy/       # DevOps outputs
└── errors/          # Error logs from hooks
```

### Parallel Execution Rules

Frontend NEVER starts before Backend is done when they share the same feature.
Schema/Model MUST be complete before API that uses it.
Tests MUST run after feature code is done.
