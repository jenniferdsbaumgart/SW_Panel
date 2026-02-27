# ADR-003: Stack de Animacao

## Status

Accepted

## Contexto

O SW Painel e intensamente visual. Animacoes incluem:

1. **Transicoes de cards** entre etapas (slide/translate)
2. **Estados visuais** (pulse, glow, borda tracejada)
3. **Celebracoes leves** (~2s, deslize + pulse)
4. **Celebracoes media-alta** (~5s, flash + particulas + bounce + nome em destaque)
5. **Celebracao HERO** (~8s, takeover completo, fogos dourados, nome gigante)
6. **Celebracao pivot** (~3s, efeito de recalculo de rota)

Requisitos: 60fps constante em LED 4K, 54h de operacao sem degradacao.

## Opcoes Consideradas

### Opcao A: Framer Motion puro

- Declarativo, React-native
- AnimatePresence para mount/unmount
- Layout animations para mover cards
- Limitado para particulas e fogos

### Opcao B: GSAP puro

- Performance superior, controle granular de timelines
- Imperativo (refs + useEffect)
- Plugins para particulas (mas licenca comercial)
- Nao se integra naturalmente com React

### Opcao C: Framer Motion + Canvas overlay para celebracoes pesadas

- Framer Motion para transicoes e estados (80% dos casos)
- Canvas 2D overlay para particulas e fogos (celebracoes HERO e medium_high)
- Separacao clara de responsabilidades

### Opcao D: CSS Animations + Canvas

- Mais simples, sem dependencia de animacao
- CSS transitions para cards, Canvas para celebracoes
- Menos declarativo, mais manual

## Decisao

**Opcao C: Framer Motion + Canvas 2D overlay.**

## Justificativa

### Framer Motion para 80% das animacoes

1. **Transicoes de cards entre etapas**: `layout` prop + `AnimatePresence`. Quando `current_stage` muda, o card anima automaticamente para a nova posicao. Isso e trivial com Framer Motion e extremamente complexo com GSAP ou CSS.

2. **Estados visuais**: `animate` prop com variantes (pulse, glow, borda). Declarativo e reativo ao estado do store.

3. **Celebracoes leves**: `motion.div` com scale, opacity, e color transitions. 2 segundos de animacao simples.

4. **Performance**: Para transicoes DOM (translate, scale, opacity), Framer Motion usa `transform` e `opacity` que rodam na GPU. 60fps garantido para estas operacoes.

### Canvas 2D overlay para celebracoes pesadas

1. **Particulas e fogos**: Centenas de particulas animadas simultaneamente. DOM nao e adequado para isso. Canvas 2D e a escolha correta.

2. **Overlay isolado**: Um `<canvas>` posicionado absolutamente sobre o painel. Quando uma celebracao pesada dispara, o canvas e ativado. Quando termina, e limpo. Zero impacto no DOM do painel.

3. **60fps com particulas**: Canvas 2D com `requestAnimationFrame` e otimizado para este tipo de rendering. Sem layout recalculation, sem style recalculation.

4. **Memory management**: Particulas sao objetos simples em um array. Quando a celebracao termina, o array e limpo. Sem risk de memory leak em 54h.

### Por que nao GSAP?

- GSAP e imperativo. Para mover um card quando `current_stage` muda no Zustand store, seria necessario: observar mudanca no store -> encontrar ref do card -> criar timeline GSAP -> animar. Com Framer Motion, e apenas mudar a posicao no layout e o card anima sozinho.
- GSAP tem licenca comercial para uso em produtos (embora o SW Painel seja interno).
- A complexidade adicional nao se justifica quando Framer Motion + Canvas cobrem todos os casos.

### Por que nao WebGL/Three.js?

- Overkill para particulas 2D e fogos. Canvas 2D e suficiente.
- Three.js adiciona ~150KB. Para um painel que roda em rede local, tamanho nao e critico, mas simplicidade sim.

## Implementacao

### Layer 1: Framer Motion (DOM)

```
- Card transitions (layout prop)
- Card visual states (variants)
- Stage node animations
- Celebration overlay entrada/saida (AnimatePresence)
- Admin panel transitions
```

### Layer 2: Canvas 2D (Overlay)

```
- Particulas de celebracao medium_high
- Fogos dourados da celebracao HERO
- Efeito de recalculo do pivot
- Flash/glow effects
```

### Integracao

```
[Zustand Store] --evento--> [CelebrationQueue]
    |                              |
    v                              v
[Framer Motion]            [Canvas Controller]
(card move,                (particulas, fogos,
 overlay appear)            flash effects)
    |                              |
    v                              v
[DOM Layer]                [Canvas Layer]
(z-index: 1)              (z-index: 10)
```

## Consequencias

### Positivas

- Declarativo para 80% dos casos (produtividade alta)
- Performance garantida para celebracoes pesadas (Canvas)
- Separacao clara: DOM para layout, Canvas para efeitos
- Sem licenca comercial necessaria

### Negativas

- Duas APIs de animacao para manter (Framer Motion + Canvas)
- Canvas requer implementacao manual do sistema de particulas

### Riscos

- Se Framer Motion nao atingir 60fps com 15 cards animando simultaneamente: mitigacao com `will-change` e reducao de propriedades animadas.
- Canvas memory leak em 54h: mitigacao com cleanup rigoroso apos cada celebracao.
