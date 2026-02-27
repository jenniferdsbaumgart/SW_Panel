# Etapas da Jornada - "From Zero to Hero"

## Visao Geral

A jornada do Startup Weekend e composta por 8 etapas sequenciais mais uma etapa especial de pivot. Cada equipe avanca pela trilha conforme conquista marcos, validados automaticamente ou por mentores. O painel exibe essa jornada como um board game visual.

---

## Etapas

### 0. ZERO

| Campo | Valor |
|-------|-------|
| Numero | 0 |
| ID | `zero` |
| Nome de Exibicao | ZERO |
| Descricao | Equipe formada, jornada iniciada |
| Tipo de Avanço | Automatico |
| Cor na Paleta | Violeta Intenso `#7C3AED` (cor primaria) |
| Icone Sugerido | RocketLaunch / SparkleIcon |
| Estados Visuais Possiveis | Ativa |
| Celebracao ao Entrar | Nenhuma (estado inicial) |

---

### 1. IDEIA

| Campo | Valor |
|-------|-------|
| Numero | 1 |
| ID | `ideia` |
| Nome de Exibicao | IDEIA |
| Descricao | Ideia definida pela equipe |
| Tipo de Avanço | Automatico |
| Cor na Paleta | Violeta Intenso `#7C3AED` (variacao clara) |
| Icone Sugerido | Lightbulb / IdeaIcon |
| Estados Visuais Possiveis | Ativa, Celebrando |
| Celebracao ao Entrar | Leve (~2s) -- deslize suave + pulse sutil |

---

### 2. PROBLEMA

| Campo | Valor |
|-------|-------|
| Numero | 2 |
| ID | `problema` |
| Nome de Exibicao | PROBLEMA |
| Descricao | Problema articulado e definido |
| Tipo de Avanço | Automatico |
| Cor na Paleta | Violeta Intenso `#7C3AED` (variacao media) |
| Icone Sugerido | Search / AlertTriangle |
| Estados Visuais Possiveis | Ativa, Celebrando |
| Celebracao ao Entrar | Leve (~2s) -- deslize suave + pulse sutil |

---

### 3. VALIDACAO

| Campo | Valor |
|-------|-------|
| Numero | 3 |
| ID | `validacao` |
| Nome de Exibicao | VALIDACAO |
| Descricao | Hipotese validada com usuarios/mercado |
| Tipo de Avanço | Mentor (aprovacao necessaria) |
| Cor na Paleta | Verde-Limao `#BFFF00` (cor de destaque) |
| Icone Sugerido | CheckCircle / ShieldCheck |
| Estados Visuais Possiveis | Ativa, Aguardando, Celebrando |
| Celebracao ao Entrar | Media (transicao 2->3, primeiro marco de mentor) |

**Nota:** Esta e a primeira etapa que requer aprovacao de mentor. O estado "aguardando" (pulsante) indica que a equipe submeteu e aguarda aprovacao.

---

### 4. MVP

| Campo | Valor |
|-------|-------|
| Numero | 4 |
| ID | `mvp` |
| Nome de Exibicao | MVP |
| Descricao | Prototipo funcional construido |
| Tipo de Avanço | Mentor (aprovacao necessaria) |
| Cor na Paleta | Branco `#FFFFFF` sobre fundo violeta |
| Icone Sugerido | Hammer / WrenchIcon |
| Estados Visuais Possiveis | Ativa, Aguardando, Celebrando |
| Celebracao ao Entrar | Media-Alta (~5s) -- flash + particulas + bounce + nome em destaque |

---

### 5. SOLUCAO VALIDADA

| Campo | Valor |
|-------|-------|
| Numero | 5 |
| ID | `sol_validada` |
| Nome de Exibicao | SOL. VALIDADA |
| Descricao | Solucao confirmada com feedback real |
| Tipo de Avanço | Mentor (aprovacao necessaria) |
| Cor na Paleta | Verde-Limao `#BFFF00` (destaque de conquista) |
| Icone Sugerido | BadgeCheck / Award |
| Estados Visuais Possiveis | Ativa, Aguardando, Celebrando |
| Celebracao ao Entrar | Media-Alta (~5s) -- flash + particulas + bounce + nome em destaque |

---

### 6. PITCH

| Campo | Valor |
|-------|-------|
| Numero | 6 |
| ID | `pitch` |
| Nome de Exibicao | PITCH |
| Descricao | Apresentacao final para jurados |
| Tipo de Avanço | Mentor (aprovacao necessaria) |
| Cor na Paleta | Branco `#FFFFFF` com glow violeta |
| Icone Sugerido | Mic / Presentation |
| Estados Visuais Possiveis | Ativa, Aguardando, Celebrando |
| Celebracao ao Entrar | Media-Alta (~5s) -- flash + particulas + bounce + nome em destaque |

---

### 7. HERO

| Campo | Valor |
|-------|-------|
| Numero | 7 |
| ID | `hero` |
| Nome de Exibicao | HERO |
| Descricao | Jornada completa! A equipe e heroi. |
| Tipo de Avanço | Automatico* (ativado apos PITCH aprovado) |
| Cor na Paleta | Dourado `#FFD700` com brilho especial |
| Icone Sugerido | Trophy / Crown / Star |
| Estados Visuais Possiveis | HERO (estado unico permanente) |
| Celebracao ao Entrar | MAXIMA (~8s) -- takeover do painel, fogos dourados, nome gigante |

**Nota:** O estado HERO e permanente. Uma vez HERO, a equipe nao muda mais de estado.

---

### Especial: PIVOT

| Campo | Valor |
|-------|-------|
| ID | `pivot` |
| Nome de Exibicao | PIVOT |
| Descricao | Equipe mudou de direcao. Nao e etapa sequencial -- e um evento que move a equipe para uma etapa anterior. |
| Tipo de Avanço | Manual (decisao do mentor/equipe) |
| Cor na Paleta | Violeta Intenso `#7C3AED` com tracejado |
| Icone Sugerido | RefreshCw / RotateCcw |
| Estados Visuais | Pivotada (contorno tracejado + icone de recalculo) |
| Celebracao | Pivot (~3s) -- "recalcular rota", tom positivo |

**Nota:** Apos pivot, a equipe pode estar em qualquer etapa de 0 a 5 (definida em `to_stage`). O badge visual de pivot permanece no card.

---

## Mapa Visual da Trilha

```
 ZERO -----> IDEIA -----> PROBLEMA -----> VALIDACAO -----> MVP -----> SOL.VALIDADA -----> PITCH -----> HERO
  (0)         (1)          (2)              (3)            (4)          (5)               (6)          (7)
  auto        auto         auto           mentor         mentor       mentor            mentor       auto*

                              ^                                          |
                              |                                          |
                              +------------ PIVOT (pode retornar) ------+
```

## Regras de Transicao

1. **Avanço normal**: Equipe avanca uma etapa por vez (0->1->2->...->7).
2. **Etapas automaticas** (0, 1, 2): Avancam sem necessidade de aprovacao de mentor.
3. **Etapas de mentor** (3, 4, 5, 6): Requerem aprovacao na plataforma Sofia. Estado "aguardando" aparece quando a equipe submete.
4. **HERO** (7): Ativado automaticamente apos PITCH aprovado. Celebracao maxima.
5. **Pivot**: Pode acontecer de qualquer etapa (exceto HERO). Move a equipe para `to_stage` definido no evento. Badge permanente.
6. **Nao retroceder**: Exceto por pivot, equipes nao voltam para etapas anteriores.
7. **Multiplos pivots**: Uma equipe pode pivotar mais de uma vez.
8. **HERO e irreversivel**: Uma vez HERO, nao ha pivot nem retrocesso.

## 4 Niveis de Celebracao por Transicao

| Transicao | Nivel | Duracao | Visual |
|-----------|-------|---------|--------|
| 0->1 (ZERO->IDEIA) | Leve | ~2s | Deslize suave, pulse sutil |
| 1->2 (IDEIA->PROBLEMA) | Leve | ~2s | Deslize suave, pulse sutil |
| 2->3 (PROBLEMA->VALIDACAO) | Media | ~3s | Flash + destaque moderado |
| 3->4 (VALIDACAO->MVP) | Media-Alta | ~5s | Flash + particulas + bounce + nome em destaque |
| 4->5 (MVP->SOL.VALIDADA) | Media-Alta | ~5s | Flash + particulas + bounce + nome em destaque |
| 5->6 (SOL.VALIDADA->PITCH) | Media-Alta | ~5s | Flash + particulas + bounce + nome em destaque |
| 6->7 (PITCH->HERO) | MAXIMA | ~8s | Takeover do painel, fogos dourados |
| Qualquer->Qualquer (PIVOT) | Pivot | ~3s | "Recalcular rota", tom positivo |

## Identidade Visual por Etapa

Todas as etapas seguem a paleta definida:
- **Dominante**: Violeta Intenso `#7C3AED` (60%)
- **Fundo**: Preto Noturno `#0F0A1A` (25%)
- **Textos**: Branco `#FFFFFF` (10%)
- **Destaques**: Verde-Limao `#BFFF00` (5%)
- **HERO**: Dourado `#FFD700` (especial)

Nao usar cores quentes (vermelho, laranja, amarelo) como cores de etapa. Nao usar skyline SW.
