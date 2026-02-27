# Component Tree - SW Painel

## Pagina Principal (Display)

```
RootLayout                              # src/app/layout.tsx
  |                                     # Fonts (Montserrat, Inter), metadata
  |
  +-- DisplayLayout                     # src/app/(display)/layout.tsx
       |                                # Fullscreen, bg-[#0F0A1A], no scroll
       |
       +-- DisplayPage                  # src/app/(display)/page.tsx
            |                           # Server Component, monta client components
            |
            +-- JourneyBoard [client]   # src/components/board/journey-board.tsx
                 |                      # Container raiz, aspect-ratio 1:2
                 |                      # Providers: WebSocket, CelebrationQueue
                 |
                 +-- ConnectionIndicator # src/components/ui/connection-indicator.tsx
                 |                       # Dot pulsante no canto (connected/reconnecting)
                 |
                 +-- PauseIndicator      # src/components/ui/pause-indicator.tsx
                 |                       # Badge discreto quando pausado
                 |
                 +-- JourneyTrack        # src/components/board/journey-track.tsx
                 |    |                  # Layout das 8 etapas na proporcao 1:2
                 |    |
                 |    +-- StageNode [x8] # src/components/board/stage-node.tsx
                 |    |    |             # Uma etapa: label + cluster de cards
                 |    |    |
                 |    |    +-- StageLabel # src/components/board/stage-label.tsx
                 |    |    |              # Nome + icone, Montserrat Black
                 |    |    |
                 |    |    +-- CardsCluster # src/components/cards/cards-cluster.tsx
                 |    |         |           # Organiza N cards sem sobreposicao
                 |    |         |
                 |    |         +-- TeamCard [x N] # src/components/cards/team-card.tsx
                 |    |              |              # motion.div com layout animation
                 |    |              |
                 |    |              +-- CardImage  # src/components/cards/card-image.tsx
                 |    |              |               # <img> com onError fallback
                 |    |              |
                 |    |              +-- CardPlaceholder # (condicional: quando sem imagem)
                 |    |                                  # Nome + cor da equipe
                 |    |
                 |    +-- StageConnector [x7] # src/components/board/stage-connector.tsx
                 |                            # Linha/curva entre etapas
                 |
                 +-- CelebrationOverlay       # src/components/celebrations/celebration-overlay.tsx
                 |    |                        # z-index alto, AnimatePresence
                 |    |
                 |    +-- (condicional por celebration_type)
                 |    |
                 |    +-- CelebrationLight      # ~2s, deslize + pulse
                 |    +-- CelebrationMedium     # ~3s, flash + destaque
                 |    +-- CelebrationMediumHigh # ~5s, flash + particulas + bounce + nome
                 |    +-- CelebrationHero       # ~8s, takeover total + fogos dourados
                 |    +-- CelebrationPivot      # ~3s, recalcular rota
                 |
                 +-- ParticleCanvas            # src/components/celebrations/particle-canvas.tsx
                 |                              # <canvas> overlay, z-index maximo
                 |                              # Controlado imperativamente pelo celebration
                 |
                 +-- CelebrationQueueManager   # src/components/celebrations/celebration-queue-manager.tsx
                                                # Headless: observa fila, orquestra execucao
```

## Pagina Admin

```
RootLayout
  |
  +-- AdminLayout                       # src/app/(admin)/layout.tsx
       |                                # Layout responsivo para laptop/tablet
       |
       +-- AdminPage                    # src/app/(admin)/admin/page.tsx
            |
            +-- AdminLogin [condicional] # src/components/admin/admin-login.tsx
            |                            # Se nao autenticado: form de senha
            |
            +-- AdminDashboard [client]  # src/components/admin/admin-dashboard.tsx
                 |                       # Se autenticado: dashboard completo
                 |
                 +-- ConnectionStatus    # src/components/admin/connection-status.tsx
                 |                       # Status WS detalhado (connected, attempts, last sync)
                 |
                 +-- TeamList            # src/components/admin/team-list.tsx
                 |    |                  # Tabela com todas as equipes e estado
                 |    |
                 |    +-- (lista de equipes com etapa, estado visual, actions)
                 |
                 +-- PanelControls       # src/components/admin/panel-controls.tsx
                 |                       # Botoes: Pause, Resume, Reset, Fullscreen
                 |
                 +-- CelebrationTrigger  # src/components/admin/celebration-trigger.tsx
                 |                       # Override manual: selecionar equipe + tipo
                 |
                 +-- EventLog            # src/components/admin/event-log.tsx (Fase 3)
                                         # Lista scrollavel de eventos recebidos
```

## Fluxo de Dados

```
                    WebSocket (/ws/journey)
                           |
                           v
                    useWebSocket hook
                           |
                           v  (parseia evento, despacha action)
                    Zustand PanelStore
                      /        |          \
                     v         v           v
              teams state   connection   celebration
                  |          status        queue
                  v            v             v
            JourneyTrack   Indicators   CelebrationOverlay
                  |                          |
                  v                          v
            StageNode [x8]            ParticleCanvas
                  |
                  v
            TeamCard [x N]
         (Framer Motion layout)
```

## Responsabilidades dos Componentes Chave

### JourneyBoard

- Monta o hook `useWebSocket` (inicia conexao)
- Monta `CelebrationQueueManager` (inicia processamento da fila)
- Define aspect-ratio 1:2 container
- Responsavel pelo layout macro (trilha + overlays)

### TeamCard

- Recebe `TeamState` via selector do store
- Usa Framer Motion `layoutId={team_id}` para animacao automatica entre etapas
- Renderiza variante visual baseada em `visual_state`
- Emite completion callback quando animacao de transicao termina

### CelebrationOverlay

- Observa `currentCelebration` no store
- Renderiza componente de celebracao correspondente
- Usa `AnimatePresence` para entrada/saida
- Chama `finishCelebration()` no store quando a celebracao completa

### CelebrationQueueManager

- Headless (nao renderiza nada)
- Observa `celebrationQueue` e `currentCelebration`
- Quando `currentCelebration` e `null` e fila tem itens, chama `startNextCelebration()`
- HERO tem prioridade maxima na fila (reordena)

### ParticleCanvas

- `<canvas>` com `position: fixed`, `pointer-events: none`
- Recebe ref exposta para o sistema de celebracoes
- Metodos: `startParticles(config)`, `stopParticles()`, `clear()`
- Usa `requestAnimationFrame` para render loop
- Cleanup automatico quando celebracao termina
