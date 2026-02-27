# Wireframe: Design das Celebrações

## Decisão DEC-04: Estética das Celebrações na Paleta Violeta

**Escolha:** Sistema de "energia violeta" com partículas na paleta da marca.

**Princípios:**
1. **Nunca confetti colorido genérico.** Partículas são pontos de luz violeta (#7C3AED, #8B5CF6, #A78BFA), branco (#FFFFFF) e verde-limão (#BFFF00).
2. **Glow como linguagem visual.** O brilho (glow) é a principal forma de comunicar intensidade. Quanto maior a celebração, mais intenso o glow.
3. **Dourado reservado para HERO.** A cor #FFD700 só aparece na celebração máxima.
4. **Partículas são orgânicas.** Movimentam-se como fagulhas de energia, não como confetti retangular. Formas: pontos, traços curtos, arcos.
5. **Efeitos respeitam 60fps.** Cada nível tem um budget de partículas.

---

## Nível 1: Celebração Leve (~2s)

**Transições:** ZERO->IDEIA, IDEIA->PROBLEMA

**Visual: Deslize suave + pulse no nodo**

```
Fase 1 (0-500ms): Card desliza para nova posição
─────────────────────────────────────────────────────

     [IDEIA]                    [PROBLEMA]
       ◎ ════════════════════════ ◎
       │                          │
    ┌──┴──┐                      │
    │Card │  ──── desliza ──→    │
    │ X   │   (ease-smooth)      │
    └─────┘                      │


Fase 2 (500-1500ms): Pulse sutil no nodo de destino
─────────────────────────────────────────────────────

     [IDEIA]                    [PROBLEMA]
       ◎ ════════════════════════ ◎ ← glow violet expand/contract
       │                          │
       │                       ┌──┴──┐
       │                       │Card │ ← scale 1.0 → 1.05 → 1.0
       │                       │ X   │
       │                       └─────┘

  Nodo de destino: glow-violet expande de 20px → 40px → 20px (1 ciclo)
  Card: scale bounce sutil (1.0 → 1.05 → 1.0)


Fase 3 (1500-2000ms): Fade para estado normal
─────────────────────────────────────────────────────

  Glow retorna ao tamanho padrão (20px)
  Card em estado "ativa" normal
```

**Budget de performance:** Zero partículas. Apenas CSS transforms + box-shadow.

---

## Nível 2: Celebração Média (~3s)

**Transição:** PROBLEMA->VALIDAÇÃO (primeiro checkpoint de mentor)

**Visual: Flash + destaque moderado**

```
Fase 1 (0-300ms): Flash branco no card
─────────────────────────────────────────────────────

                       ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
                       ╎   ████████    ╎  ← flash branco (opacity 0 → 1 → 0)
                       ╎   ████████    ╎     no card inteiro
                       ╎   ████████    ╎     glow-white: 0 → 40px → 0
                       └╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘


Fase 2 (300-800ms): Card desliza com bounce
─────────────────────────────────────────────────────

     [PROBLEMA]                   [VALIDAÇÃO]
       ◎ ══════════════════════════ ◎
       │                            │
    ┌──┴──┐                        │
    │Card │  ──── bounce ──→       │
    │ X   │   (ease-bounce)        │
    └─────┘                        │
                                ┌──┴──┐
                                │Card │
                                │ X   │
                                └─────┘


Fase 3 (800-2200ms): Glow expandido + nome em destaque
─────────────────────────────────────────────────────

     [VALIDAÇÃO]
       ◎ ← glow-lime 0 → 30px (etapa de mentor = verde-limão)
       │
    ┌──┴──────────────────┐
    │                      │
    │    ┌─────────┐       │
    │    │  Card X │       │  Card em scale 1.1
    │    └─────────┘       │
    │                      │
    │  ★ TEAM ALPHA ★      │  Nome: Montserrat Black 64px
    │                      │  Aparece por 1.4s, fade in/out
    └──────────────────────┘

  Nome da equipe aparece abaixo do card, tamanho aumentado
  Glow verde-limão no nodo (etapa de checkpoint)


Fase 4 (2200-3000ms): Retorno ao normal
─────────────────────────────────────────────────────

  Scale: 1.1 → 1.0 (ease-smooth, 400ms)
  Glow: 30px → 20px (ease-smooth)
  Nome ampliado: fade out (300ms)
```

**Budget:** Zero partículas. CSS transforms + box-shadow + texto animado.

---

## Nível 3: Celebração Média-Alta (~5s)

**Transições:** VALIDAÇÃO->MVP, MVP->SOL.VALIDADA, SOL.VALIDADA->PITCH

**Visual: Flash + partículas violeta + nome em destaque grande**

```
Fase 1 (0-300ms): Flash branco no card + nodo
─────────────────────────────────────────────────────

  Flash branco cobre card e nodo de origem
  glow-white: 60px no card, 40px no nodo
  Toda a coluna da etapa de origem "pulsa" branco


Fase 2 (300-1000ms): Card desliza + partículas saem do ponto de partida
─────────────────────────────────────────────────────

     [etapa A]                    [etapa B]
       ◎ ════════════════════════ ◎
       │  ·  ✦                    │
    ┌──┴──┐  ·  ✧                │
    │Card │──·──✦──────→         │
    │ X   │  ✧    ·              │
    └─────┘     ✦  ·          ┌──┴──┐
                              │Card │
                              │ X   │
                              └─────┘

  12-20 partículas saem da posição do card
  Formas: pontos e traços curtos
  Cores: #7C3AED (60%), #BFFF00 (20%), #FFFFFF (20%)
  Direção: radial, dissipando para fora
  Cada partícula: vida 600-1000ms, opacity fade out


Fase 3 (1000-3500ms): Nome ampliado + partículas orbitam + glow intenso
─────────────────────────────────────────────────────

  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │            ✦  ·  ✧  ·  ✦                           │
  │         ·                  ·                       │
  │      ✧    ┌──────────┐    ✦                       │
  │     ·     │  Card X  │     ·   Card: scale 1.15   │
  │      ✦    └──────────┘    ✧                       │
  │         ·                  ·                       │
  │            ✧  ·  ✦  ·  ✧                           │
  │                                                    │
  │         ★★★ TEAM ALPHA ★★★                         │
  │                                                    │
  └────────────────────────────────────────────────────┘

  Card: scale 1.15, z-index 30 (acima de outros cards)
  8-12 partículas orbitam lentamente ao redor do card
  Órbita: raio ~150px, velocidade angular 360deg em 3s
  Nome: Montserrat Black 96px, branco, centralizado abaixo
  Glow do nodo: violeta intenso, 50px
  Background local escurece levemente (overlay #0F0A1A 40%)


Fase 4 (3500-5000ms): Partículas dissipam, retorno
─────────────────────────────────────────────────────

  Partículas: opacity → 0 (ease-out, 800ms)
  Card: scale 1.15 → 1.0 (ease-smooth, 600ms)
  Nome: fade out (400ms)
  Overlay: dissolve (600ms)
  Card pousa no estado "ativa" na nova etapa
```

**Budget:** 20-30 partículas simultâneas max. Canvas 2D overlay na região do card.

---

## Nível 4: Celebração MÁXIMA / HERO (~8s)

**Transição:** PITCH->HERO (ou evento `hero`)

**Visual: TAKEOVER completo do painel**

```
Fase 1 (0-500ms): Flash branco TOTAL
─────────────────────────────────────────────────────

  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │             ████████████████████████               │
  │             ████████████████████████               │
  │             ████████████████████████               │
  │             █ FLASH BRANCO TOTAL ██               │
  │             ████████████████████████               │
  │             ████████████████████████               │
  │             ████████████████████████               │
  │                                                    │
  └────────────────────────────────────────────────────┘

  Overlay branco: opacity 0 → 0.8 → 0 (500ms)
  Toda a trilha some momentaneamente sob o flash
  Efeito: "explosão de energia"


Fase 2 (500-1500ms): Zoom no card da equipe
─────────────────────────────────────────────────────

  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │       (trilha desfocada, opacity 20%)              │
  │                                                    │
  │              ╔═══════════════╗                      │
  │              ║               ║                      │
  │              ║  [card HERO]  ║  ← scale animando   │
  │              ║               ║     de 1.0 a 2.0    │
  │              ║               ║     (400x480px)     │
  │              ╚═══════════════╝                      │
  │                                                    │
  │                                                    │
  └────────────────────────────────────────────────────┘

  Trilha: blur(10px) + opacity 20%
  Card: centraliza no painel + scale até 400x480px
  Borda: dourada #FFD700, 4px, glow-gold 40px
  Background: gradiente radial de #FFD700 (10%) para #0F0A1A


Fase 3 (1500-5000ms): Card centralizado + nome gigante + partículas douradas
─────────────────────────────────────────────────────

  ┌────────────────────────────────────────────────────┐
  │  ✦ ·    ✧     ·   ✦    ·    ✧    ·   ✦    ·  ✧   │
  │    ✧  ·                                  ·  ✦     │
  │  ·       ╔═══════════════╗                   ·    │
  │ ✦        ║               ║                  ✧     │
  │    ·     ║  [card HERO]  ║     ·                  │
  │  ✧       ║               ║       ✦                │
  │    ✦     ╚═══════════════╝     ✧                  │
  │  ·                                   ·  ✦         │
  │      ★★★★★ TEAM OMEGA ★★★★★                       │
  │                                                    │
  │  ✧  ·  ✦  ·  ✧  ·  ✦  ·  ✧  ·  ✦  ·  ✧  ·  ✦   │
  └────────────────────────────────────────────────────┘

  Card centralizado, 400x480px, borda dourada
  Nome: Montserrat Black 128px, dourado #FFD700
  Partículas douradas em espiral:
    - 40-60 partículas
    - Cores: #FFD700 (70%), #FFFFFF (20%), #BFFF00 (10%)
    - Formas: pontos brilhantes + traços curtos + arcos
    - Movimento: espiral ascendente + radial
    - Espiral: gira ao redor do card, raio 200-600px
  Glow dourado: pulsa lentamente (2s ciclo)
  Background: radial gradient dourado sutil


Fase 4 (5000-7000ms): "HERO!" aparece
─────────────────────────────────────────────────────

  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │              ╔═══════════════╗                      │
  │              ║  [card HERO]  ║                      │
  │              ╚═══════════════╝                      │
  │                                                    │
  │           ██  ██ ██████ █████   ████  ██           │
  │           ██  ██ ██     ██  ██ ██  ██ ██           │
  │           ██████ ████   █████  ██  ██ ██           │
  │           ██  ██ ██     ██  ██ ██  ██              │
  │           ██  ██ ██████ ██  ██  ████  ██           │
  │                                                    │
  │         ★★★★★ TEAM OMEGA ★★★★★                     │
  │  ✦  ✧  ✦  ✧  ✦  ✧  ✦  ✧  ✦  ✧  ✦  ✧  ✦  ✧     │
  └────────────────────────────────────────────────────┘

  "HERO!" em Montserrat Black 192px, dourado #FFD700
  Scale animation: 0 → 1.2 → 1.0 (ease-bounce, 600ms)
  Glow dourado intenso (60px) no texto
  Partículas continuam em espiral (dissipando)


Fase 5 (7000-8000ms): Zoom out suave, retorno à trilha
─────────────────────────────────────────────────────

  Texto "HERO!" fade out (400ms)
  Card shrink de 400x480 para 210x252 (ligeiramente maior que padrão)
  Card move para posição HERO na trilha (ease-smooth, 600ms)
  Trilha: blur remove + opacity 20% → 100% (600ms)
  Partículas: opacity → 0 (800ms)
  Card permanece com estado visual "HERO" (dourado permanente)
```

**Budget:** 60 partículas max. Canvas 2D em fullscreen. GPU-accelerated.

---

## Celebração de Pivot (~3s)

**Evento:** `pivot`

**Visual: Recalcular rota (tom positivo)**

```
Fase 1 (0-400ms): Card treme/vibra
─────────────────────────────────────────────────────

    ┌─────┐
    │Card │ ← vibração: translateX alternando +-3px
    │ X   │    4 ciclos rápidos em 400ms
    └─────┘    ease-linear


Fase 2 (400-1000ms): Ícone de recálculo + traço ondulado
─────────────────────────────────────────────────────

     [etapa A]                    [etapa B]
       ◎                            ◎
       │                            │
    ┌──┴──┐    ↺                    │
    │Card │  ~~~~→                  │     Traço ondulado (não reto)
    │ X   │   ✧ recalculando...    │     Cor: #818CF8 (indigo)
    └─────┘                        │     Duração: 600ms

  Ícone ↺ (RotateCcw) aparece ao lado do card, 64px
  Cor: #818CF8 (indigo)
  Traço ondulado (SVG path animado) indica nova rota
  Texto "recalculando..." em Inter 36px, lilás (opcional, se espaço)


Fase 3 (1000-2000ms): Card desliza para nova posição
─────────────────────────────────────────────────────

     [etapa A]                    [etapa B]
       ◎                            ◎
       │                            │
       │                         ┌──┴──┐
       │     ←── desliza ──      │Card │
       │    (ease-smooth, suave) │ X   │
       │                         └─────┘

  Card desliza PARA TRÁS na trilha (pivot = retrocesso)
  Movimento suave, sem bounce (tom calmo, positivo)
  Traço ondulado persiste durante o movimento


Fase 4 (2000-3000ms): Borda muda para tracejada
─────────────────────────────────────────────────────

    ┌╌╌╌╌╌╌╌┐
    ╎ Card X ╎ ← borda transiciona: solid → dashed (300ms)
    ╎   ↺    ╎    cor: violet → indigo #818CF8
    └╌╌╌╌╌╌╌┘    ícone ↺ permanece

  Traço ondulado desaparece (fade out)
  Card agora no estado visual "pivotada" permanente
```

**Budget:** Zero partículas. SVG path animation + CSS transforms.

---

## Estado Aguardando (Contínuo, não é celebração)

**Evento:** `waiting`

```
Estado permanente enquanto equipe aguarda mentor:

    ┌─ ─ ─ ─ ─┐
      Card X       Borda: #BFFF00, pulsando
      ⏳
    └─ ─ ─ ─ ─┘

  Ciclo: 2000ms, infinito, ease-in-out

  t=0ms:    glow-lime opacity 40%, border opacity 40%
  t=1000ms: glow-lime opacity 100%, border opacity 100%
  t=2000ms: glow-lime opacity 40%, border opacity 40%

  Visível a 10-15m: brilho verde-limão aparece e desaparece
  Ícone ⏳ (relógio) ao lado do nome

  Removido automaticamente quando stage_update chega
  Transição: aguardando → celebrando (celebration substitui)
```

---

## Fila de Celebrações

### Comportamento Visual

```
Fila com 3 celebrações pendentes:

  Celebração 1 (executando)     Fila:
  ┌─────────────────┐           ┌───┐┌───┐
  │ ★ TEAM ALPHA ★  │           │ B ││ C │  ← aguardando
  │  (medium_high)   │           └───┘└───┘
  └─────────────────┘

  1. Celebração A executa completamente (5s)
  2. Pausa de 500ms entre celebrações
  3. Celebração B inicia
  4. Celebração C aguarda
```

**Regras de prioridade:**
1. Celebração HERO (`max`) tem **prioridade máxima** -- pula para frente da fila
2. Demais celebrações: FIFO (primeira a chegar, primeira a executar)
3. Se uma celebração HERO chega durante outra celebração em execução, a atual termina normalmente, depois HERO executa imediatamente

**Indicador visual da fila (opcional):**
- Nenhum indicador no painel público (audiência não precisa saber)
- Admin mostra contagem da fila em tempo real

---

## Resumo de Budget de Performance por Nível

| Nível | Partículas | Canvas | Duração | Impacto GPU |
|-------|-----------|--------|---------|-------------|
| Leve | 0 | Não | 2s | Mínimo |
| Média | 0 | Não | 3s | Baixo |
| Média-Alta | 20-30 | Sim (região) | 5s | Médio |
| HERO/Máxima | 40-60 | Sim (fullscreen) | 8s | Alto |
| Pivot | 0 | Não (SVG) | 3s | Baixo |
| Aguardando | 0 | Não | Contínuo | Mínimo |
