# Wireframe: Painel Principal (LED 2x4m)

## Decisão DEC-02: Layout Serpentina

**Escolha:** Layout em serpentina (2 fileiras, caminho em S).

**Justificativa:**
1. **Uso do espaço vertical**: A proporção 1:2 tem metade vertical disponível. Um layout puramente linear desperdiça ~50% do espaço vertical.
2. **Narrativa visual**: A serpentina cria sensação de jornada/caminho -- mais engajante que uma linha reta.
3. **Agrupamento**: Com 2 fileiras, cada fileira abriga 4 etapas, distribuindo melhor os cards.
4. **Leitura natural**: Fileira superior lê-se da esquerda para a direita (etapas 0-3). Fileira inferior lê-se da direita para a esquerda (etapas 4-7). A "curva" no meio reforça o conceito de jornada.
5. **Complexidade moderada**: Mais visual que linear, menos complexo que espiral ou caminho livre.

## Decisão DEC-10: Conceito Visual -- "Circuito de Energia"

**Escolha:** Circuito de energia orgânico / neural pathway.

**Justificativa:** Combina a identidade tech (Startup Weekend) com a estética orgânica (blobs, curvas). O "filamento de energia" que conecta as etapas pulsa e brilha quando equipes avançam, criando feedback visual a distância.

---

## Layout Geral (3840x1920px)

### Estado: Success (Happy Path) -- 12 equipes distribuídas

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  64px safe area                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                          STARTUP WEEKEND 2026                          [ws: ●]   │    │
│  │                                                                                  │    │
│  │   ┌─ZERO─┐ ════════ ┌IDEIA─┐ ════════ ┌PROBL.┐ ════════ ┌VALID.┐              │    │
│  │   │  ◎   │ filament │  ◎   │ filament │  ◎   │ filament │  ◎   │              │    │
│  │   │ 🚀  │──────────│  💡  │──────────│  🔍  │──────────│  ✓   │              │    │
│  │   └──┬───┘          └──┬───┘          └──┬───┘          └──┬───┘              │    │
│  │      │                 │                 │                 │    ╚══╗           │    │
│  │   ┌──┴──┐           ┌──┴──┐          ┌──┴──┐            ┌──┴──┐   ║           │    │
│  │   │Card │           │Card │          │Card │            │Card │   ║ curva     │    │
│  │   │ A   │           │Card │          │ E   │            │ G   │   ║           │    │
│  │   │     │           │ B   │          └─────┘            │     │   ║           │    │
│  │   └─────┘           │     │           ┌─────┐           └─────┘   ║           │    │
│  │   ┌─────┐           └─────┘          │Card │            ┌─────┐   ║           │    │
│  │   │Card │           ┌─────┐          │ F   │            │Card │   ║           │    │
│  │   │ C   │           │Card │          └─────┘            │ H   │   ║           │    │
│  │   └─────┘           │ D   │                             └─────┘   ║           │    │
│  │                     └─────┘                                       ║           │    │
│  │ ──────────────────────────────────────────────────────────────────╝           │    │
│  │                                                                                  │    │
│  │   ┌─HERO─┐ ════════ ┌PITCH┐ ════════ ┌S.VAL.┐ ════════ ┌─MVP──┐              │    │
│  │   │  ◎   │ filament │  ◎   │ filament │  ◎   │ filament │  ◎   │              │    │
│  │   │ 🏆  │──────────│  🎤  │──────────│  ✓✓  │──────────│  🔨  │              │    │
│  │   └──┬───┘          └──┬───┘          └──┬───┘          └──┬───┘              │    │
│  │      │                 │                 │                 │                    │    │
│  │   ┌──┴──┐           ┌──┴──┐          ┌──┴──┐            ┌──┴──┐              │    │
│  │   │Card │           │Card │          │Card │            │Card │              │    │
│  │   │ L   │           │ K   │          │ J   │            │ I   │              │    │
│  │   │HERO │           │     │          │     │            │     │              │    │
│  │   │ ★★★ │           └─────┘          └─────┘            └─────┘              │    │
│  │   └─────┘                                                                     │    │
│  │                                                                                  │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Anatomia do Layout

```
┌──────────────────── 3840px (2:1 ratio) ────────────────────┐
│                                                             │
│  ┌─ Header: 80px ──────────────────────────────────────┐   │
│  │ Nome do evento (Montserrat Black 48px)   [ws: ●]    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ Fileira Superior: ~760px ──────────────────────────┐   │
│  │                                                      │   │
│  │  [ZERO] ═══ [IDEIA] ═══ [PROBLEMA] ═══ [VALIDAÇÃO]  │   │
│  │    │           │            │              │         │   │
│  │  cards       cards        cards          cards       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ Curva Central: 96px ───────────────────────────────┐   │
│  │  Filamento de energia curvando da direita p/ baixo   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ Fileira Inferior: ~760px ──────────────────────────┐   │
│  │                                                      │   │
│  │  [HERO] ═══ [PITCH] ═══ [SOL.VALID.] ═══ [MVP]      │   │
│  │    │           │            │              │         │   │
│  │  cards       cards        cards          cards       │   │
│  │  (leitura: direita para esquerda)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ Footer: 16px (mínimo) ─────────────────────────────┐   │
│  │ (reservado para indicador discreto de pause)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dimensões Detalhadas

| Elemento | Largura | Altura | Posição |
|----------|---------|--------|---------|
| Safe area | 64px cada lado | 64px topo/base | Borda do painel |
| Header | 3712px | 80px | Topo (dentro da safe area) |
| Nodo de etapa | 120px diâmetro | 120px | Centro horizontal de cada coluna |
| Filamento (trilha) | 6px largura | variável | Conecta nodos |
| Área de cards por etapa | ~860px | ~560px | Abaixo de cada nodo |
| Card de equipe | 200x240px | -- | Dentro da área de cards |
| Curva central | 3712px | 96px | Entre fileiras |
| Espaço entre colunas | ~68px | -- | Gap horizontal entre etapas |

---

### Distribuição Horizontal (4 etapas por fileira)

```
│  64px  │   860px   │  68px  │   860px   │  68px  │   860px   │  68px  │   860px   │  64px  │
│ safe   │  col. 1   │  gap   │  col. 2   │  gap   │  col. 3   │  gap   │  col. 4   │ safe   │
│        │           │        │           │        │           │        │           │        │
│        │ ZERO/HERO │        │IDEIA/PITCH│        │PROB/S.VAL │        │VALID./MVP │        │
```

Total: 64 + 860 + 68 + 860 + 68 + 860 + 68 + 860 + 64 = 3772px (dentro dos 3840px)

---

## Decisão DEC-06/DEC-03: Agrupamento de Equipes na Mesma Etapa

**Escolha:** Fan-out vertical com redimensionamento adaptativo.

**Regras:**
1. **1-2 equipes**: Cards no tamanho padrão (200x240px), lado a lado verticalmente
2. **3-4 equipes**: Cards reduzidos para 170x204px, 2 colunas x 2 linhas
3. **5-8 equipes**: Cards reduzidos para 140x168px (tamanho mínimo), grid adaptativo
4. **9+ equipes**: Cards no tamanho mínimo + scroll temporal (exibe 8, rotaciona a cada 4s)

```
1-2 equipes:          3-4 equipes:         5-8 equipes:
┌────────┐           ┌───────┐┌───────┐   ┌─────┐┌─────┐┌─────┐
│ 200x240│           │170x204││170x204│   │ 140 ││ 140 ││ 140 │
│        │           │       ││       │   │x168 ││x168 ││x168 │
│        │           └───────┘└───────┘   └─────┘└─────┘└─────┘
└────────┘           ┌───────┐┌───────┐   ┌─────┐┌─────┐┌─────┐
┌────────┐           │170x204││170x204│   │ 140 ││ 140 ││     │
│ 200x240│           │       ││       │   │x168 ││x168 ││     │
│        │           └───────┘└───────┘   └─────┘└─────┘└─────┘
│        │
└────────┘
```

---

## Estado: Loading

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      [ws: ◌]    │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │                           ┌────────────────────────┐                             │    │
│  │                           │                        │                             │    │
│  │                           │     ◌ Conectando...    │                             │    │
│  │                           │                        │                             │    │
│  │                           │  ░░░░░░░░░░░░░░░░░░░░  │                             │    │
│  │                           │                        │                             │    │
│  │                           └────────────────────────┘                             │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘

Notas:
- Fundo: Preto Noturno #0F0A1A com blobs violeta em opacidade 5% (quase imperceptíveis)
- Texto "Conectando..." em Montserrat Black 64px, cor #C4B5FD (lilás)
- Spinner/indicador animado em violeta
- Indicador de conexão [ws: ◌] no canto superior direito (círculo vazio = desconectado)
- Esta tela aparece apenas na carga inicial, antes do primeiro evento `sync`
```

## Estado: Empty (Sync recebido, 0 equipes)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                          STARTUP WEEKEND 2026                          [ws: ●]   │    │
│  │                                                                                  │    │
│  │   ┌─ZERO─┐ ════════ ┌IDEIA─┐ ════════ ┌PROBL.┐ ════════ ┌VALID.┐              │    │
│  │   │  ◎   │ ░░░░░░░░ │  ◎   │ ░░░░░░░░ │  ◎   │ ░░░░░░░░ │  ◎   │              │    │
│  │   └──────┘          └──────┘          └──────┘          └──────┘              │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │                        Aguardando equipes...                                     │    │
│  │                        A jornada começa em breve.                                │    │
│  │                                                                                  │    │
│  │                                                                   ╚══╗           │    │
│  │ ─────────────────────────────────────────────────────────────────────╝           │    │
│  │                                                                                  │    │
│  │   ┌─HERO─┐ ════════ ┌PITCH┐ ════════ ┌S.VAL.┐ ════════ ┌─MVP──┐              │    │
│  │   │  ◎   │ ░░░░░░░░ │  ◎   │ ░░░░░░░░ │  ◎   │ ░░░░░░░░ │  ◎   │              │    │
│  │   └──────┘          └──────┘          └──────┘          └──────┘              │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘

Notas:
- Trilha visível mas em opacidade 30% (filamentos apagados, ░░░░░░)
- Nodos das etapas visíveis mas sem glow (silhueta)
- Texto "Aguardando equipes..." centralizado, Montserrat Black 64px, lilás #C4B5FD
- Subtexto "A jornada começa em breve." em Inter 36px, lilás 50% opacidade
- [ws: ●] verde = conectado ao WebSocket
- Blobs de fundo em animação normal (ambiente vivo)
```

## Estado: Error (Desconectado > 30s)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐    │
│  │                          STARTUP WEEKEND 2026                          [ws: ✕]   │    │
│  │                                                                                  │    │
│  │   (trilha e cards do último estado válido permanecem visíveis)                   │    │
│  │                                                                                  │    │
│  │   ┌─ZERO─┐ ════════ ┌IDEIA─┐ ════════ ┌PROBL.┐ ════════ ┌VALID.┐              │    │
│  │   │  ◎   │──────────│  ◎   │──────────│  ◎   │──────────│  ◎   │              │    │
│  │   └──┬───┘          └──┬───┘          └──┬───┘          └──┬───┘              │    │
│  │      │ cards...        │ cards...       │ cards...        │ cards...            │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │                                                                                  │    │
│  │   ┌─HERO─┐ ════════ ┌PITCH┐ ════════ ┌S.VAL.┐ ════════ ┌─MVP──┐              │    │
│  │   │  ◎   │──────────│  ◎   │──────────│  ◎   │──────────│  ◎   │              │    │
│  │   └──┬───┘          └──┬───┘          └──┬───┘          └──┬───┘              │    │
│  │      │ cards...        │ cards...       │ cards...        │ cards...            │    │
│  │                                                                                  │    │
│  │  ┌──────────────────────────────────────────┐                                    │    │
│  │  │  ⚠ Reconectando... tentativa 4 (8s)     │  ← visível apenas < 3m           │    │
│  │  └──────────────────────────────────────────┘                                    │    │
│  └──────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘

Notas:
- NUNCA limpar a tela. Último estado renderizado permanece.
- Indicador discreto no canto inferior esquerdo (só visível a < 3m)
- Texto pequeno (24px), fundo semi-transparente #0F0A1A com 80% opacidade
- Mostra número da tentativa e próximo retry
- [ws: ✕] vermelho no header = desconectado
- Para a audiência a 10-15m, nada muda visualmente (estado congelado parece normal)
```

## Estado: Paused (via admin)

```
Idêntico ao estado normal, exceto:
- Pequeno ícone "⏸" no canto inferior direito, 24px, opacidade 30%
- Visível apenas a < 2m (staff que está próximo)
- Nenhum indicador óbvio para a audiência
```

## Direção de Leitura

```
  FILEIRA SUPERIOR: esquerda → direita
  ┌────────────────────────────────────────────┐
  │  ZERO ──→ IDEIA ──→ PROBLEMA ──→ VALIDAÇÃO │
  └────────────────────────────────────┬───────┘
                                       │
                                    CURVA ↓
                                       │
  ┌────────────────────────────────────┴───────┐
  │  HERO ←── PITCH ←── SOL.VALID. ←── MVP    │
  └────────────────────────────────────────────┘
  FILEIRA INFERIOR: direita → esquerda (leitura invertida)
```

**Indicação visual da direção:** O filamento de energia tem setas sutis / gradiente direcional que indica o fluxo. Na fileira inferior, as setas apontam para a esquerda.
