# Biblioteca de Componentes -- SW Painel

## Visão Geral

O SW Painel possui dois contextos de UI distintos:
1. **Display (LED)**: Componentes para o painel público. Sem interação. Tipografia grande. Animações.
2. **Admin**: Componentes para o painel de controle. Interativo. Tipografia normal. Funcional.

---

## Componentes do Display (LED)

### `<PanelContainer />`

Container raiz do painel público. Garante aspect-ratio 2:1 e safe area.

| Prop | Tipo | Descrição |
|------|------|-----------|
| -- | -- | Sem props. Container fixo. |

```
Specs:
- aspect-ratio: 2/1
- background: #0F0A1A
- padding: 64px (safe area)
- overflow: hidden
- position: relative (para layers)
- width/height: 100vw/100vh com letterboxing se necessário
```

### `<BackgroundBlobs />`

Blobs orgânicos animados no fundo.

| Prop | Tipo | Descrição |
|------|------|-----------|
| count | number | Número de blobs (padrão: 4) |

```
Specs:
- z-index: 0
- 3-5 divs com border-radius orgânico
- Cores: #7C3AED, #4C1D95, #5B21B6
- Opacity: 10-20%
- Filter: blur(80px)
- Tamanho: 400-800px cada
- Animação: blob-morph (20-40s cada, dessincronizados)
- Posição: absolute, distribuídos assimetricamente
```

### `<Trail />`

Trilha serpentina que conecta as 8 etapas.

| Prop | Tipo | Descrição |
|------|------|-----------|
| stages | StageDefinition[] | Definição das 8 etapas |
| activeSegments | StageId[] | Segmentos ativos (com equipes) |

```
Specs:
- z-index: 10
- SVG path com stroke-width: 6px
- Cor padrão: #4C1D95 (violeta profundo)
- Segmentos ativos: #7C3AED com glow-trail
- Curva central (serpentina) via SVG bezier
- Indicadores de direção sutis (gradiente direcional)
```

### `<StageNode />`

Nodo circular representando uma etapa na trilha.

| Prop | Tipo | Descrição |
|------|------|-----------|
| stage | StageDefinition | Dados da etapa |
| teamCount | number | Número de equipes nesta etapa |
| isActive | boolean | Se tem equipe ativa |

```
Specs:
- width/height: 120px (80px mínimo se espaço limitado)
- border-radius: 50%
- background: cor da etapa (ver design-system)
- Ícone: Lucide icon, 48px, branco
- Nome: abaixo do nodo, Montserrat Black 64px, branco
- Glow: glow-violet se ativa, sem glow se vazia
- Badge de contagem: se teamCount > 0, badge circular no canto
```

### `<TeamCard />`

Card visual de uma equipe.

| Prop | Tipo | Descrição |
|------|------|-----------|
| team | TeamState | Estado da equipe |
| size | "default" \| "medium" \| "small" | Tamanho baseado na densidade |

```
Specs (tamanho default):
- width: 200px, height: 240px
- border-radius: 16px (card)
- border: 3px solid (cor varia por estado)
- background: #1A1128
- Conteúdo:
  - Imagem (75% do card): object-fit cover, border-radius top
  - Nome (25%): Montserrat Black, branco, padding 8px
  - Dot: team_color, 12px, ao lado do nome
- Sombra: glow-violet (ativa), glow-lime (aguardando), etc.

Variações por tamanho:
- medium: 170x204px, nome 36px
- small: 140x168px, nome 28px
```

### `<TeamCardPlaceholder />`

Fallback quando card não tem imagem.

| Prop | Tipo | Descrição |
|------|------|-----------|
| teamName | string | Nome da equipe |
| teamColor | string | Cor da equipe |

```
Specs:
- Mesmas dimensões que TeamCard
- Background: team_color com 20% opacidade
- Centro: iniciais da equipe em Montserrat Black 64px, branco
- Mesmo border/shadow que TeamCard
```

### `<CelebrationOverlay />`

Overlay para celebrações (partículas, flash, takeover).

| Prop | Tipo | Descrição |
|------|------|-----------|
| celebration | CelebrationQueueItem | Dados da celebração ativa |
| onComplete | () => void | Callback quando celebração termina |

```
Specs:
- z-index: 40 (celebration) ou 50 (HERO takeover)
- position: absolute, inset: 0
- Contém: canvas 2D para partículas, overlay para flash
- Gerencia timeline da celebração (fases)
- pointer-events: none (não bloqueia nada, display-only)
```

### `<ParticleSystem />`

Sistema de partículas para celebrações (Canvas 2D).

| Prop | Tipo | Descrição |
|------|------|-----------|
| type | "radial" \| "spiral" \| "orbit" | Tipo de movimento |
| colors | string[] | Cores das partículas |
| count | number | Número de partículas |
| origin | {x, y} | Ponto de origem |
| duration | number | Duração em ms |

```
Specs:
- Canvas 2D (não WebGL -- suficiente para 60 partículas)
- Partículas: pontos (2-4px), traços (1x8px), arcos
- Bloom/glow: segunda passagem com blur
- GPU-accelerated: canvas com will-change: transform
- Cleanup: remove canvas do DOM após duração
```

### `<ConnectionIndicator />`

Indicador discreto do status do WebSocket.

| Prop | Tipo | Descrição |
|------|------|-----------|
| status | ConnectionStatus | Estado da conexão |

```
Specs:
- Posição: canto superior direito, dentro do header
- Tamanho: 24px texto + 12px dot
- ● verde (#22C55E) = conectado
- ○ vazio = conectando
- ✕ vermelho (#EF4444) = desconectado
- Texto apenas visível a < 5m
```

### `<PauseIndicator />`

Indicador discreto de pausa.

| Prop | Tipo | Descrição |
|------|------|-----------|
| isPaused | boolean | Se o painel está pausado |

```
Specs:
- Posição: canto inferior direito
- "⏸" em 24px, opacity 30%
- Visível apenas a < 2m
- Aparece/desaparece com fade de 200ms
```

---

## Componentes do Admin

### `<AdminLayout />`

Layout raiz do admin.

```
Specs:
- background: #0F0A1A
- color: #FFFFFF
- font-family: Inter
- padding: 24px
- max-width: 1200px, margin: auto
```

### `<AdminHeader />`

Header do admin com logo, status e logout.

```
Specs:
- display: flex, justify-between, align-center
- border-bottom: 1px solid #5B21B6
- padding-bottom: 16px
- Logo: "SW PAINEL ADMIN", Montserrat Bold 20px
- Status: ConnectionIndicator (versão admin, com texto)
- Botão Sair: text button, #C4B5FD, hover #FFFFFF
```

### `<ControlBar />`

Barra de controles (pausar, reset, fila).

```
Specs:
- background: #1A1128
- border: 1px solid #5B21B6
- border-radius: 16px
- padding: 16px 24px
- display: flex, gap: 16px, align-center
```

### `<Button />`

Botão reutilizável.

| Variant | Background | Text | Border | Uso |
|---------|-----------|------|--------|-----|
| primary | #7C3AED | #FFFFFF | none | Ação principal (Entrar, Disparar) |
| secondary | transparent | #C4B5FD | 1px #5B21B6 | Ação secundária (Cancelar) |
| danger | transparent | #EF4444 | 1px #EF4444 | Ação destrutiva (Reset) |
| success | #BFFF00 | #0F0A1A | none | Ação positiva (Retomar) |
| ghost | transparent | #C4B5FD | none | Ação terciária (Sair) |

```
Specs comuns:
- border-radius: 8px
- padding: 8px 16px
- font: Inter Semibold 14px
- transition: all 200ms ease
- hover: opacity 0.8 / border-color lighten
- cursor: pointer
- disabled: opacity 0.5, cursor not-allowed
```

### `<TeamTable />`

Tabela de equipes no admin.

```
Specs:
- width: 100%
- background: #1A1128
- border: 1px solid #5B21B6
- border-radius: 16px
- overflow: hidden

Header row:
- background: #2D1F4E
- font: Inter Semibold 14px, #C4B5FD
- padding: 12px 16px

Body rows:
- alternating: #1A1128 / #0F0A1A
- font: Inter Regular 14px, #FFFFFF
- padding: 12px 16px
- hover: #2D1F4E
```

### `<StateBadge />`

Badge indicando estado visual da equipe.

| Estado | Background | Text |
|--------|-----------|------|
| Ativa | #7C3AED | #FFFFFF |
| Aguardando | #BFFF00 | #0F0A1A |
| Celebrando | #FFFFFF | #0F0A1A |
| Pivotada | #818CF8 | #FFFFFF |
| HERO | #FFD700 | #0F0A1A |

```
Specs:
- display: inline-flex
- padding: 2px 8px
- border-radius: 6px
- font: Inter Medium 12px
- text-transform: uppercase
```

### `<EventLog />`

Log de eventos estilo terminal.

```
Specs:
- background: #0F0A1A
- border: 1px solid #5B21B6
- border-radius: 16px
- padding: 16px
- max-height: 400px
- overflow-y: auto (auto-scroll)
- font: JetBrains Mono 13px

Entry:
- timestamp: #C4B5FD
- tipo: cor por tipo (ver admin-panel.md)
- dados: #FFFFFF
- entry com erro: background #2D1F1A (tom avermelhado)
```

### `<Modal />`

Modal genérico para ações do admin.

```
Specs:
- Overlay: #0F0A1A com 60% opacidade
- Modal: background #1A1128, border 1px #5B21B6, border-radius 16px
- Padding: 24px
- Min-width: 400px
- Título: Inter Bold 20px, #FFFFFF
- Fechar: botão ✕ no canto superior direito
- Ações: flex, justify-end, gap 12px
```

### `<Input />`

Campo de entrada (texto, senha).

```
Specs:
- width: 100%
- background: #0F0A1A
- border: 1px solid #5B21B6
- border-radius: 8px
- padding: 10px 14px
- font: Inter Regular 16px, #FFFFFF
- placeholder: #C4B5FD com 50% opacidade
- focus: border-color #7C3AED, box-shadow glow-violet
- error: border-color #EF4444
```

### `<Select />`

Dropdown de seleção.

```
Specs:
- Mesmos estilos de Input
- Ícone ▼ à direita, cor #C4B5FD
- Options: background #1A1128, hover #2D1F4E
```

### `<RadioGroup />`

Grupo de radio buttons.

```
Specs:
- Radio circle: 20px, border 2px #5B21B6
- Selected: fill #7C3AED, border #7C3AED
- Label: Inter Regular 14px, #FFFFFF
- Gap entre opções: 12px
```

### `<Alert />`

Banner de alerta no admin.

| Variant | Background | Border | Icon |
|---------|-----------|--------|------|
| info | #1A1128 | #818CF8 | Info |
| warning | #2D1F1A | #BFFF00 | AlertTriangle |
| error | #2D1F1A | #EF4444 | AlertCircle |
| success | #1A2D1A | #22C55E | CheckCircle |

```
Specs:
- border-radius: 8px
- padding: 12px 16px
- border-left: 4px solid (variant color)
- font: Inter Regular 14px
- icon: 20px, variant color
```

---

## Mapeamento Componente-a-User-Story

| Componente | User Stories Relacionadas |
|-----------|-------------------------|
| PanelContainer | US-011 (proporção 1:2) |
| BackgroundBlobs | US-010 (identidade visual) |
| Trail | US-010 (board game), US-015 (posicionar card) |
| StageNode | US-010 (8 etapas), US-013 (legibilidade) |
| TeamCard | US-014 (renderizar card), US-016 (estados visuais) |
| TeamCardPlaceholder | US-027 (fallback) |
| CelebrationOverlay | US-017, US-018, US-019, US-020, US-021 |
| ParticleSystem | US-018, US-019 (partículas) |
| ConnectionIndicator | US-001, US-002, US-026 |
| PauseIndicator | US-024 (pausar/retomar) |
| AdminLayout | US-022 |
| ControlBar | US-024 (pause/resume) |
| TeamTable | US-022 (estado atual) |
| EventLog | US-025 (log) |
| Modal | US-023 (override) |
