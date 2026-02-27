# Wireframe: Design dos Cards de Equipe

## Contexto

Os cards são **imagens recebidas do n8n**. O SW Painel não gera o conteúdo do card -- apenas o exibe com moldura/frame visual que indica o estado da equipe. O design aqui define como o card é **emoldurado e apresentado** no painel.

---

## Anatomia do Card

```
┌─────────────────────────┐
│ ┌─────────────────────┐ │ ← Moldura (3px, cor = estado)
│ │                     │ │
│ │                     │ │
│ │    IMAGEM DO CARD   │ │ ← Imagem do n8n (CardData.image_url)
│ │    (gerada pelo n8n)│ │
│ │                     │ │
│ │                     │ │
│ └─────────────────────┘ │
│  NOME DA EQUIPE          │ ← Montserrat Black 36-48px, branco
│  ● [cor da equipe]       │ ← Dot com team_color + borda violeta
└─────────────────────────┘
```

### Dimensões

| Cenário | Largura | Altura | Nome (px) | Legível a |
|---------|---------|--------|-----------|-----------|
| Padrão (1-2 por etapa) | 200px | 240px | 48px | 10m+ |
| Médio (3-4 por etapa) | 170px | 204px | 36px | 8m |
| Mínimo (5-8 por etapa) | 140px | 168px | 28px | 6m |

**Proporção do card:** 5:6 (largura:altura). Imagem ocupa ~75% do card, nome + indicador ocupam ~25%.

---

## 5 Estados Visuais

### 1. Ativa (Padrão)

```
┌─────────────────────────┐
│ ┌─────────────────────┐ │  Borda: 3px solid #7C3AED
│ │                     │ │  Sombra: glow-violet (sutil)
│ │    [imagem card]    │ │  Opacidade: 100%
│ │                     │ │  Fundo da moldura: #1A1128
│ └─────────────────────┘ │
│  Team Alpha              │  Nome: branco #FFFFFF
│  ●                       │  Dot: team_color
└─────────────────────────┘

- Sem animação
- Estado padrão quando equipe está trabalhando
- Borda sólida violeta
- Glow violeta sutil permanente
```

### 2. Aguardando (Submetido para Mentor)

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ┌─────────────────────┐    Borda: 3px solid #BFFF00 (PULSANTE)
  │                     │    Sombra: glow-lime (pulsando 40%-100%)
  │    [imagem card]    │    Animação: borda + glow pulsa a cada 2s
  │                     │
  └─────────────────────┘
   Team Beta               ⏳  Nome: branco + ícone relógio
   ●
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘

Animação de pulsação:
  0%:   border-color: #BFFF00 opacity 40%, glow 40%
  50%:  border-color: #BFFF00 opacity 100%, glow 100%
  100%: border-color: #BFFF00 opacity 40%, glow 40%
  Duração: 2000ms, infinite, ease-in-out

- Ícone de relógio (⏳) ao lado do nome (24px)
- Verde-limão indica "ação pendente de mentor"
- Pulsação visível a 10-15m (glow periódico)
```

### 3. Celebrando (Animação Ativa 2-8s)

```
     ✦  ·  ✧
   ·   ╔═══════════╗  ·   Flash branco inicial (300ms)
  ✦    ║           ║    ✧  Borda: 4px solid #FFFFFF
       ║  [card]   ║       Sombra: glow-white (intenso)
  ·    ║           ║    ·  Scale: 1.0 → 1.15 → 1.0 (bounce)
       ╚═══════════╝
  ✧  ★ TEAM GAMMA ★  ✦   Nome: ampliado, destaque
       ●                   Partículas: violeta + limão
     ·    ✦    ·

- Card eleva (z-index 30) sobre os demais
- Borda branca brilhante durante celebração
- Scale bounce (ease-bounce)
- Nome da equipe pode aparecer ampliado (depende do nível)
- Partículas em violeta #7C3AED e limão #BFFF00
- Duração varia: 2s (leve) a 8s (HERO)
- Ao terminar: transição suave de volta ao estado "ativa" ou "hero"
```

### 4. Pivotada (Após Pivot)

```
┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
╎ ┌─────────────────────┐ ╎  Borda: 3px DASHED #818CF8 (indigo)
╎ │                     │ ╎  Sombra: nenhuma (sem glow)
╎ │    [imagem card]    │ ╎  Opacidade: 90%
╎ │                     │ ╎
╎ └─────────────────────┘ ╎
╎  Team Delta          ↺  ╎  Nome: lilás #C4B5FD
╎  ●                      ╎  Ícone: ↺ (RotateCcw) permanente
└╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘

- Borda TRACEJADA (dash-array: 8 4) em indigo #818CF8
- Ícone de recálculo (↺) ao lado do nome, permanente
- Opacidade levemente reduzida (90%) -- sutil
- Se equipe tinha pivot_count > 1, badge "×2" no canto do card
- Estado permanente até próximo avanço (quando volta a "ativa")
- Tom: neutro/positivo (não é "erro", é "recalcular rota")
```

### 5. HERO (Permanente)

```
╔═════════════════════════╗
║ ┌─────────────────────┐ ║  Borda: 4px solid #FFD700 (dourado)
║ │                     │ ║  Sombra: glow-gold (permanente)
║ │   [card_hero img]   │ ║  Background: gradiente dourado sutil
║ │                     │ ║
║ └─────────────────────┘ ║
║  ★ TEAM OMEGA ★         ║  Nome: dourado #FFD700, Montserrat Black
║  ●        🏆            ║  Troféu ao lado do nome
╚═════════════════════════╝

- Borda DOURADA 4px sólida (mais grossa que padrão)
- Glow dourado permanente (não pulsante, constante)
- Background do card frame: gradiente de #1A1128 para #2D1F1A (toque dourado)
- Estrelas (★) ao redor do nome
- Ícone de troféu (🏆) permanente
- Card usa card_hero (imagem especial do n8n)
- Scale 1.05 permanente (ligeiramente maior que os demais)
- Este estado é IRREVERSÍVEL -- uma vez HERO, sempre HERO
```

---

## Card Fallback (Sem Imagem)

```
┌─────────────────────────┐
│ ┌─────────────────────┐ │  Borda: 3px solid (cor do estado)
│ │                     │ │
│ │   ┌───────────┐     │ │  Background: team_color a 20% opacidade
│ │   │  INICIAL  │     │ │  Iniciais da equipe (2 letras)
│ │   │           │     │ │  Montserrat Black 64px, branco
│ │   └───────────┘     │ │
│ │                     │ │
│ └─────────────────────┘ │
│  Team Alpha              │
│  ●                       │
└─────────────────────────┘

- Quando CardData é null ou image_url falha ao carregar
- Placeholder com iniciais da equipe (ex: "TA" para Team Alpha)
- Background: team_color com 20% opacidade
- Nunca mostrar imagem quebrada ou espaço vazio
- Transição suave se imagem carregar depois (fade in)
```

---

## Cards Agrupados na Mesma Etapa

### 2 cards

```
     ◎ ETAPA
     │
  ┌──┴──────────┐
  │  ┌────┐     │
  │  │Card│     │
  │  │ A  │     │
  │  └────┘     │
  │  ┌────┐     │
  │  │Card│     │
  │  │ B  │     │
  │  └────┘     │
  └─────────────┘
```

### 4 cards (grid 2x2)

```
     ◎ ETAPA
     │
  ┌──┴──────────────┐
  │  ┌────┐ ┌────┐  │
  │  │ A  │ │ B  │  │
  │  └────┘ └────┘  │
  │  ┌────┐ ┌────┐  │
  │  │ C  │ │ D  │  │
  │  └────┘ └────┘  │
  └─────────────────┘
```

### 6+ cards (grid 3xN, miniaturizado)

```
     ◎ ETAPA
     │
  ┌──┴────────────────────┐
  │  ┌───┐ ┌───┐ ┌───┐   │
  │  │ A │ │ B │ │ C │   │
  │  └───┘ └───┘ └───┘   │
  │  ┌───┐ ┌───┐ ┌───┐   │
  │  │ D │ │ E │ │ F │   │
  │  └───┘ └───┘ └───┘   │
  └───────────────────────┘
```

### 9+ cards (rotação temporal)

```
     ◎ ETAPA
     │
  ┌──┴────────────────────┐
  │  ┌───┐ ┌───┐ ┌───┐   │  Exibe 6-8 cards visíveis
  │  │ A │ │ B │ │ C │   │  Rotaciona suavemente a cada 4s
  │  └───┘ └───┘ └───┘   │  Indicador: "●●●○○" (dots de página)
  │  ┌───┐ ┌───┐ ┌───┐   │
  │  │ D │ │ E │ │ F │   │
  │  └───┘ └───┘ └───┘   │
  │        ●●●○○          │  ← dots indicam página
  └───────────────────────┘
```

---

## Transição de Card Entre Etapas

```
Posição A (etapa atual)          Posição B (nova etapa)

    ┌────┐                           ┌────┐
    │Card│  ─── desliza ───────→     │Card│
    │ X  │  (400ms, ease-smooth)     │ X  │
    └────┘                           └────┘

1. Card na posição A recebe flash branco (100ms)
2. Card desliza para posição B seguindo a trilha (curva, não linha reta)
3. Card chega em B com bounce (ease-bounce)
4. Celebração dispara no destino
5. Outros cards da etapa de destino reposicionam-se suavemente (200ms)
```

---

## Card em Diferentes Contextos

| Contexto | Comportamento |
|----------|--------------|
| Trilha normal | Card abaixo do nodo da etapa, dentro da área de cards |
| Celebração leve | Card eleva-se levemente (scale 1.05), retorna |
| Celebração média-alta | Card eleva-se (scale 1.15), nome ampliado ao centro |
| Celebração HERO | Card centralizado no painel (takeover), dimensão 400x480px |
| Admin | Lista de cards sem efeitos visuais, apenas estado textual |
