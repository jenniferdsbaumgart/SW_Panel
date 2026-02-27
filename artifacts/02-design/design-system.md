# Design System -- SW Painel

## Identidade Visual

### Conceito: "Circuito de Energia"

O SW Painel usa a metafora visual de um **circuito de energia orgânico** -- uma trilha que pulsa como um sistema nervoso digital. Linhas curvas (não retas, não rígidas) conectam as etapas como nodos de uma rede neural, com energia (luz violeta) fluindo conforme equipes avançam. O conceito une tecnologia (circuito) com organicidade (blobs, curvas), refletindo o Startup Weekend: estrutura + criatividade.

**Elementos-chave do conceito:**
- Trilha como "filamento de energia" que brilha quando equipes avançam
- Nodos (etapas) pulsam como sinapses quando ativados
- Blobs orgânicos violeta no fundo, como nebulosas de energia
- Cards flutuam sobre a trilha como unidades de energia em movimento

---

## Cores

### Paleta Principal (Regra 60-25-10-5)

| Token | Hex | RGB | Uso | Proporção |
|-------|-----|-----|-----|-----------|
| `--color-violet` | `#7C3AED` | 124, 58, 237 | Cor dominante: trilha, blobs, bordas, glow | 60% |
| `--color-night` | `#0F0A1A` | 15, 10, 26 | Fundo principal do painel | 25% |
| `--color-white` | `#FFFFFF` | 255, 255, 255 | Textos, nomes de etapa, rótulos | 10% |
| `--color-lime` | `#BFFF00` | 191, 255, 0 | Acentos, indicadores de ação, destaques pontuais | 5% |

### Paleta Auxiliar

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-violet-deep` | `#4C1D95` | Gradientes, sombras internas, trilha inativa |
| `--color-violet-dark` | `#5B21B6` | Bordas de cards, separadores |
| `--color-lavender` | `#DDD6FE` | Backgrounds claros (admin), hover states |
| `--color-lilac` | `#C4B5FD` | Transições, subheadings, texto secundário |
| `--color-night-light` | `#1A1128` | Fundo de cards, áreas elevadas |
| `--color-night-lighter` | `#2D1F4E` | Hover no admin, cards admin |

### Cores de Estado Visual

| Estado | Token | Cor | Efeito |
|--------|-------|-----|--------|
| Ativa (padrão) | `--state-active` | `#7C3AED` | Borda sólida violeta, sem animação |
| Aguardando | `--state-waiting` | `#BFFF00` | Borda verde-limão com pulsação (glow on/off a cada 2s) |
| Celebrando | `--state-celebrating` | `#FFFFFF` | Flash branco + brilho intenso (durante celebração) |
| Pivotada | `--state-pivoted` | `#818CF8` | Borda tracejada indigo, ícone de recálculo |
| HERO | `--state-hero` | `#FFD700` | Borda dourada, glow dourado permanente |

### Cores por Etapa da Jornada

Todas variações dentro da paleta violeta (nunca cores aleatórias):

| Etapa | Nodo (círculo) | Trilha ativa | Texto |
|-------|---------------|-------------|-------|
| 0 - ZERO | `#7C3AED` | `#4C1D95` | `#FFFFFF` |
| 1 - IDEIA | `#8B5CF6` | `#5B21B6` | `#FFFFFF` |
| 2 - PROBLEMA | `#A78BFA` | `#6D28D9` | `#FFFFFF` |
| 3 - VALIDAÇÃO | `#BFFF00` (destaque) | `#7C3AED` | `#FFFFFF` |
| 4 - MVP | `#C4B5FD` | `#7C3AED` | `#0F0A1A` |
| 5 - SOL. VALIDADA | `#BFFF00` (destaque) | `#8B5CF6` | `#FFFFFF` |
| 6 - PITCH | `#DDD6FE` | `#A78BFA` | `#0F0A1A` |
| 7 - HERO | `#FFD700` | `#FFD700` | `#0F0A1A` |

**Regra:** Etapas que requerem mentor (3, 5) usam verde-limão no nodo para indicar "checkpoint". As demais usam gradações de violeta, ficando progressivamente mais claras até o HERO (dourado).

---

## Tipografia

### Famílias

| Token | Família | Peso | Uso |
|-------|---------|------|-----|
| `--font-display` | Montserrat | 900 (Black) | Nomes de etapa, nome da equipe em celebração, "HERO!", títulos |
| `--font-body` | Inter | 400-700 | Labels, informações secundárias, admin |

### Escala para LED 4K (3840x1920px)

A tipografia precisa ser legível a 10-15 metros em um painel de 2x4m. Referência: 1cm no LED corresponde a ~9.6px na resolução 4K.

| Token | Tamanho (px) | Tamanho (rem) | Altura no LED | Uso | Legibilidade |
|-------|-------------|---------------|---------------|-----|-------------|
| `--text-hero` | 192px | 12rem | ~20cm | "HERO!" durante takeover | 20m+ |
| `--text-stage-name` | 96px | 6rem | ~10cm | Nomes das etapas (ZERO, IDEIA...) | 15m+ |
| `--text-team-celebration` | 128px | 8rem | ~13cm | Nome da equipe durante celebração | 15m+ |
| `--text-team-name` | 48px | 3rem | ~5cm | Nome da equipe no card | 10m+ |
| `--text-stage-label` | 64px | 4rem | ~6.7cm | Labels das etapas na trilha | 12m+ |
| `--text-info` | 36px | 2.25rem | ~3.8cm | Informações secundárias | 8m |
| `--text-small` | 24px | 1.5rem | ~2.5cm | Indicadores discretos (conexão) | 5m |

### Admin (tela normal, não LED)

| Token | Tamanho | Uso |
|-------|---------|-----|
| `--admin-h1` | 24px / 1.5rem | Títulos de seção |
| `--admin-h2` | 20px / 1.25rem | Subtítulos |
| `--admin-body` | 16px / 1rem | Corpo de texto |
| `--admin-small` | 14px / 0.875rem | Labels, timestamps |
| `--admin-mono` | 13px / 0.8125rem | Log de eventos (monospace) |

---

## Espaçamento

### Grid System (proporção 1:2)

O painel opera em resolução lógica de **3840x1920px** (4K com aspect ratio 2:1).

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 8px | Mínimo entre elementos inline |
| `--space-2` | 16px | Padding interno de cards |
| `--space-3` | 24px | Gap entre cards na mesma etapa |
| `--space-4` | 32px | Margem entre etapa e cards |
| `--space-6` | 48px | Gap entre nodos da trilha |
| `--space-8` | 64px | Margem do painel (safe area) |
| `--space-12` | 96px | Separação entre fileiras da serpentina |
| `--space-16` | 128px | Header/footer height |

### Safe Area do LED

```
┌──────────────────────────────────────────────────────┐
│  64px padding (safe area -- conteúdo pode ser        │
│  cortado nas bordas do LED físico)                   │
│  ┌──────────────────────────────────────────────┐    │
│  │                                              │    │
│  │         ÁREA ÚTIL: 3712 x 1792px            │    │
│  │                                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Bordas e Sombras

### Cards

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-card` | 16px | Border radius dos cards de equipe |
| `--radius-node` | 50% (círculo) | Nodos das etapas na trilha |
| `--radius-button` | 8px | Botões no admin |
| `--border-card` | 3px solid | Borda dos cards (cor varia por estado) |
| `--border-trail` | 6px | Largura da trilha (filamento de energia) |

### Sombras (Glow)

| Token | Valor | Uso |
|-------|-------|-----|
| `--glow-violet` | `0 0 20px rgba(124, 58, 237, 0.5)` | Card ativo, nodo ativo |
| `--glow-lime` | `0 0 24px rgba(191, 255, 0, 0.6)` | Card aguardando (pulsante) |
| `--glow-white` | `0 0 40px rgba(255, 255, 255, 0.8)` | Flash de celebração |
| `--glow-gold` | `0 0 30px rgba(255, 215, 0, 0.7)` | Card HERO permanente |
| `--glow-trail` | `0 0 12px rgba(124, 58, 237, 0.3)` | Trilha ativa (filamento) |

---

## Animações

### Timing Functions

| Token | Valor | Uso |
|-------|-------|-----|
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transições padrão |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebração: card chega na posição |
| `--ease-celebrate` | `cubic-bezier(0.22, 1, 0.36, 1)` | Expansão de glow, flash |
| `--ease-pulse` | `ease-in-out` | Pulsação do estado aguardando |

### Durações por Nível de Celebração

| Nível | Duração Total | Fases |
|-------|---------------|-------|
| **Leve** (`light`) | 2000ms | 0-500ms: card desliza para nova posição. 500-1500ms: pulse sutil no nodo de destino. 1500-2000ms: fade para estado normal. |
| **Média** (`medium`) | 3000ms | 0-300ms: flash branco no card. 300-800ms: card desliza com bounce. 800-2200ms: glow expandido no nodo + nome em destaque. 2200-3000ms: fade para normal. |
| **Média-Alta** (`medium_high`) | 5000ms | 0-300ms: flash branco no card + nodo. 300-1000ms: card desliza com bounce + partículas violeta saem do ponto de partida. 1000-3500ms: nome da equipe ampliado no centro, partículas orbitam, glow intenso. 3500-5000ms: partículas dissipam, retorna ao normal. |
| **Máxima / HERO** (`max`) | 8000ms | 0-500ms: flash branco total do painel. 500-1500ms: zoom no card da equipe (takeover). 1500-5000ms: card centralizado + nome gigante + partículas douradas em espiral. 5000-7000ms: "HERO!" aparece em dourado. 7000-8000ms: zoom out suave, retorna à trilha com card dourado. |
| **Pivot** | 3000ms | 0-400ms: card treme/vibra levemente. 400-1000ms: ícone de recálculo aparece + traço ondulado de rota. 1000-2000ms: card desliza para a nova posição (tom positivo). 2000-3000ms: borda muda para tracejada, ícone de pivot permanece. |

### Estado Aguardando (Contínuo)

```
Pulsação infinita:
0% → glow-lime a 40% opacidade
50% → glow-lime a 100% opacidade
100% → glow-lime a 40% opacidade
Duração do ciclo: 2000ms
Easing: ease-in-out
```

### Animações de Fundo (Blobs)

```
Blobs orgânicos violeta no fundo:
- 3-5 blobs posicionados assimetricamente
- Cada blob: ~400-800px de diâmetro
- Animação: morphing lento (transform) + drift suave (translate)
- Duração do ciclo: 20-40s por blob (dessincronizados)
- Opacidade: 10-20% (subtis, não competem com conteúdo)
- Blur: filter: blur(80px)
- Cores: #7C3AED, #4C1D95, #5B21B6
```

---

## Ícones por Etapa

| Etapa | Ícone (Lucide) | Alternativa |
|-------|----------------|-------------|
| ZERO | `Rocket` | Ponto de partida |
| IDEIA | `Lightbulb` | Lâmpada |
| PROBLEMA | `Search` | Lupa |
| VALIDAÇÃO | `CheckCircle` | Check |
| MVP | `Hammer` | Construção |
| SOL. VALIDADA | `BadgeCheck` | Selo |
| PITCH | `Mic` | Microfone |
| HERO | `Trophy` | Troféu / Coroa |
| PIVOT | `RotateCcw` | Recalcular |

---

## Z-Index Layers

| Layer | Z-Index | Conteúdo |
|-------|---------|----------|
| Background (blobs) | 0 | Blobs orgânicos animados |
| Trail (trilha) | 10 | Filamento de energia + nodos |
| Cards | 20 | Cards das equipes |
| Card Elevated (celebrando) | 30 | Card em celebração |
| Celebration Overlay | 40 | Partículas, glow expandido |
| HERO Takeover | 50 | Takeover completo do painel |
| Status Indicators | 60 | Conexão, pause indicator |

---

## Responsividade

O painel público **não é responsivo** -- opera em resolução fixa 2:1. Porém:

| Contexto | Resolução | Comportamento |
|----------|-----------|---------------|
| LED 4K (2x4m) | 3840x1920 | Resolução nativa, 1:1 pixel |
| LED Full HD | 1920x960 | Escala proporcionalmente via CSS `scale()` |
| Monitor dev | Qualquer | `aspect-ratio: 2/1` com letterboxing |
| Admin | Qualquer | Layout responsivo normal (desktop/tablet) |

---

## Design Tokens JSON

Os valores consolidados estão no arquivo `design-tokens.json` neste mesmo diretório.
