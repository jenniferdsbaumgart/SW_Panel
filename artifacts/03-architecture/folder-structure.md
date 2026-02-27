# Folder Structure - SW Painel

## Estrutura Completa

```
sw-painel/
├── public/
│   ├── sounds/                     # Sons de celebracao (Fase 3)
│   │   ├── chime-soft.mp3
│   │   ├── chime-medium.mp3
│   │   ├── fanfare.mp3
│   │   ├── epic-fanfare.mp3
│   │   └── whoosh.mp3
│   └── favicon.ico
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (display)/              # Grupo de rotas: painel publico
│   │   │   ├── layout.tsx          # Layout fullscreen, sem padding, fundo preto
│   │   │   └── page.tsx            # Pagina principal do painel LED
│   │   │
│   │   ├── (admin)/                # Grupo de rotas: painel admin
│   │   │   ├── layout.tsx          # Layout admin (com sidebar/header)
│   │   │   └── admin/
│   │   │       └── page.tsx        # Dashboard admin
│   │   │
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   └── globals.css             # Tailwind imports + custom CSS
│   │
│   ├── components/
│   │   ├── board/                  # Componentes da trilha board game
│   │   │   ├── journey-board.tsx   # Container principal da trilha
│   │   │   ├── journey-track.tsx   # Trilha com as 8 etapas
│   │   │   ├── stage-node.tsx      # No individual de uma etapa
│   │   │   ├── stage-connector.tsx # Conector visual entre etapas
│   │   │   └── stage-label.tsx     # Label da etapa (nome + icone)
│   │   │
│   │   ├── cards/                  # Componentes de cards das equipes
│   │   │   ├── team-card.tsx       # Card principal da equipe
│   │   │   ├── card-image.tsx      # Imagem do card com fallback
│   │   │   ├── card-placeholder.tsx # Placeholder quando sem imagem
│   │   │   ├── card-states.tsx     # Variantes visuais (active, waiting, pivoted, hero)
│   │   │   └── cards-cluster.tsx   # Agrupamento de cards na mesma etapa
│   │   │
│   │   ├── celebrations/           # Componentes de celebracao
│   │   │   ├── celebration-overlay.tsx    # Overlay container (AnimatePresence)
│   │   │   ├── celebration-light.tsx      # Celebracao leve (~2s)
│   │   │   ├── celebration-medium.tsx     # Celebracao media (~3s)
│   │   │   ├── celebration-medium-high.tsx # Celebracao media-alta (~5s)
│   │   │   ├── celebration-hero.tsx       # Celebracao HERO (~8s, takeover)
│   │   │   ├── celebration-pivot.tsx      # Celebracao pivot (~3s)
│   │   │   ├── particle-canvas.tsx        # Canvas overlay para particulas
│   │   │   └── celebration-queue-manager.tsx # Gerenciador da fila de celebracoes
│   │   │
│   │   ├── admin/                  # Componentes do admin
│   │   │   ├── admin-dashboard.tsx # Dashboard principal
│   │   │   ├── team-list.tsx       # Lista de equipes com estado
│   │   │   ├── celebration-trigger.tsx # Override manual de celebracao
│   │   │   ├── panel-controls.tsx  # Pause/Resume/Reset
│   │   │   ├── connection-status.tsx # Status da conexao WS
│   │   │   ├── event-log.tsx       # Log de eventos (Fase 3)
│   │   │   └── admin-login.tsx     # Tela de login simples
│   │   │
│   │   └── ui/                     # Componentes base reutilizaveis
│   │       ├── connection-indicator.tsx # Indicador de conexao (dot)
│   │       └── pause-indicator.tsx     # Indicador de pausa
│   │
│   ├── hooks/                      # React hooks customizados
│   │   ├── use-websocket.ts        # Hook de conexao WebSocket com reconexao
│   │   ├── use-celebration-queue.ts # Hook para gerenciar fila de celebracoes
│   │   ├── use-fullscreen.ts       # Hook para modo fullscreen
│   │   └── use-admin-auth.ts       # Hook para autenticacao admin (Fase 2)
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── panel-store.ts          # Store principal (teams, connection, celebrations)
│   │   └── admin-store.ts          # Store do admin (auth, settings)
│   │
│   ├── lib/                        # Utilitarios e configuracoes
│   │   ├── constants.ts            # Constantes (STAGES, cores, duracoes)
│   │   ├── ws-client.ts            # Cliente WebSocket com reconnect logic
│   │   ├── event-parser.ts         # Parser e validador de eventos WS
│   │   ├── celebration-utils.ts    # Utilitarios de celebracao (prioridade, duracao)
│   │   ├── particle-system.ts      # Sistema de particulas para Canvas 2D
│   │   ├── sound-manager.ts        # Gerenciador de som (Fase 3)
│   │   └── env.ts                  # Validacao de env vars (requireEnv)
│   │
│   └── types/                      # TypeScript types e interfaces
│       ├── events.ts               # Tipos dos eventos WebSocket
│       ├── state.ts                # Tipos do estado (TeamState, PanelState)
│       ├── stages.ts               # StageId, StageDefinition, CelebrationType
│       └── celebrations.ts         # CelebrationQueueItem, CelebrationConfig
│
├── artifacts/                      # Artefatos STRAAS Squad (nao vai pro build)
│   ├── 01-discovery/
│   ├── 02-design/
│   └── 03-architecture/
│
├── .env.example                    # Variaveis de ambiente exemplo
├── .env.local                      # Variaveis de ambiente locais (gitignored)
├── .gitignore
├── CLAUDE.md                       # Contexto para desenvolvedores
├── PROJECT.md                      # Status do projeto
├── next.config.ts                  # Configuracao Next.js
├── tailwind.config.ts              # Configuracao Tailwind (cores, fontes)
├── tsconfig.json                   # TypeScript strict mode
├── package.json
└── eslint.config.mjs
```

## Detalhamento por Diretorio

### `src/app/(display)/`

Grupo de rotas para o painel publico (LED). Layout fullscreen sem scroll, sem padding, fundo `#0F0A1A`.

- **`page.tsx`**: Server Component que renderiza `<JourneyBoard />` (client component). Metadata para fullscreen.
- **`layout.tsx`**: Background preto, sem overflow, aspect-ratio 1:2 centrado.

### `src/app/(admin)/admin/`

Grupo de rotas para o painel admin. Layout com header e sidebar.

- **`page.tsx`**: Dashboard do admin com estado do painel, controles, e log.
- **`layout.tsx`**: Layout responsivo para laptop/tablet do staff.

### `src/components/board/`

Componentes da trilha board game. Responsavel pelo layout das 8 etapas e posicionamento dos cards.

- **`journey-board.tsx`**: Container raiz. Aspect ratio 1:2. Posiciona a trilha e o overlay de celebracoes.
- **`journey-track.tsx`**: Renderiza as 8 etapas em sequencia. Calcula posicoes baseado no espaco disponivel.
- **`stage-node.tsx`**: Uma etapa individual. Recebe lista de equipes naquela etapa. Renderiza label + cluster de cards.
- **`stage-connector.tsx`**: Linha/curva visual conectando duas etapas.
- **`stage-label.tsx`**: Nome da etapa + icone. Tipografia Montserrat Black, legivel a 15m.

### `src/components/cards/`

Componentes dos cards das equipes. Cada card e uma `motion.div` com variantes para estados visuais.

- **`team-card.tsx`**: Card principal. Recebe `TeamState`. Usa Framer Motion `layout` para animacao automatica quando muda de etapa. Delegate visual para variantes.
- **`card-image.tsx`**: Wrapper de `<img>` com loading state e fallback `onError`.
- **`card-placeholder.tsx`**: Fallback visual quando imagem nao existe ou falha.
- **`card-states.tsx`**: Definicoes de variantes Framer Motion para cada `VisualState`.
- **`cards-cluster.tsx`**: Organiza multiplos cards na mesma etapa sem sobreposicao.

### `src/components/celebrations/`

Overlay de celebracoes. Renderizado acima da trilha com `z-index` alto.

- **`celebration-overlay.tsx`**: Container com `AnimatePresence`. Monta/desmonta celebracao ativa.
- **`celebration-*.tsx`**: Componente especifico para cada tipo. Duracoes e efeitos distintos.
- **`particle-canvas.tsx`**: `<canvas>` overlay para efeitos de particulas. Controlado imperativamamente.
- **`celebration-queue-manager.tsx`**: Componente "headless" que observa a fila no store e orquestra execucao.

### `src/hooks/`

Hooks customizados. Encapsulam logica complexa.

- **`use-websocket.ts`**: Conecta ao WS, parseia eventos, despacha para o store. Gerencia reconexao com backoff.
- **`use-celebration-queue.ts`**: Observa `celebrationQueue` no store. Quando `currentCelebration` termina, inicia a proxima.
- **`use-fullscreen.ts`**: Wrapper para Fullscreen API. Toggle via tecla (F11) ou botao admin.

### `src/stores/`

Zustand stores. Estado global da aplicacao.

- **`panel-store.ts`**: Store principal. Teams, connection, celebrations, pause state. Todas as actions.
- **`admin-store.ts`**: Estado do admin (autenticado, settings de som, etc.).

### `src/lib/`

Utilitarios puros (sem React). Testavel independentemente.

- **`constants.ts`**: STAGES array, COLORS, CELEBRATION_DURATIONS, STAGE_ORDER.
- **`ws-client.ts`**: Classe `WebSocketClient` com reconexao, backoff, event emitter.
- **`event-parser.ts`**: Funcao que parseia JSON e valida contra tipos TypeScript.
- **`particle-system.ts`**: Engine de particulas para Canvas 2D. Cria, atualiza, renderiza, limpa.
- **`env.ts`**: `requireEnv()` para variaveis obrigatorias.

### `src/types/`

Types derivados do contrato WebSocket (api-contract.md). Source of truth para tipagem.

- **`events.ts`**: `StageUpdateEvent`, `WaitingEvent`, `SyncEvent`, etc. Union type `WebSocketMessage`.
- **`state.ts`**: `TeamState`, `PanelState`, `ConnectionStatus`, `VisualState`.
- **`stages.ts`**: `StageId`, `StageDefinition`, `CelebrationType`.
- **`celebrations.ts`**: `CelebrationQueueItem`, `CelebrationConfig`.

## Environment Variables

```bash
# .env.example

# WebSocket endpoint do Gerencial (OBRIGATORIA)
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws/journey

# Senha do admin (OBRIGATORIA para Fase 2)
ADMIN_PASSWORD=

# URL publica da aplicacao
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Habilitar som (Fase 3)
NEXT_PUBLIC_SOUND_ENABLED=false
```

## Convencoes de Naming

| Tipo | Convencao | Exemplo |
|------|-----------|---------|
| Arquivos | kebab-case | `team-card.tsx` |
| Componentes | PascalCase | `TeamCard` |
| Hooks | camelCase com `use` | `useWebSocket` |
| Stores | camelCase com `Store` | `panelStore` |
| Types/Interfaces | PascalCase | `TeamState` |
| Constantes | SCREAMING_SNAKE | `CELEBRATION_DURATIONS` |
| Event handlers | camelCase com `handle` | `handleStageUpdate` |
