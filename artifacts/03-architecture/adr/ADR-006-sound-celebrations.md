# ADR-006: Som nas Celebracoes

## Status

Accepted (Fase 3 -- implementacao opcional)

## Contexto

Sons podem amplificar o impacto emocional das celebracoes, especialmente HERO. Porem, o painel e exibido em auditorio com atividade constante (conversas, apresentacoes, mentoria).

## Decisao

**Sons opcionais, desligados por padrao, toggle no admin.** Implementar na Fase 3 apenas se houver tempo e sistema de som disponivel.

## Justificativa

1. **O impacto visual ja e forte.** Os 4 niveis de celebracao com particulas, takeover, e fogos dourados ja criam o efeito WOW. Som e bonus, nao requisito.

2. **Ambiente de auditorio e imprevisivel.** O painel pode estar ao lado de uma area de mentoria. Som inesperado pode atrapalhar.

3. **Depende de hardware.** O LED de 2x4m pode ou nao ter sistema de som acoplado. Se o audio sair do laptop que controla o LED, o volume sera insuficiente. Se houver sistema de som do evento, precisa de integracao fisica.

4. **Web Audio API e adequada.** Se implementado, Web Audio API fornece baixa latencia e controle granular. Nao precisa de biblioteca adicional.

## Implementacao (Fase 3)

Se implementado:

```typescript
// Sons por tipo de celebracao
const CELEBRATION_SOUNDS = {
  light: '/sounds/chime-soft.mp3',      // ~1s
  medium: '/sounds/chime-medium.mp3',   // ~2s
  medium_high: '/sounds/fanfare.mp3',   // ~3s
  max: '/sounds/epic-fanfare.mp3',      // ~5s
  pivot: '/sounds/whoosh.mp3',          // ~1s
};
```

- Toggle global no admin: "Ativar som" (off por padrao)
- Volume controlavel no admin (slider)
- Preload de todos os sons no init
- Sons curtos (< 5s) para nao sobrepor ao proximo evento

## Consequencias

### Positivas

- Nao bloqueia MVP nem Fase 2
- Controlavel pelo staff
- Baixo custo de implementacao quando feito

### Negativas

- Sem som, parte do impacto emocional e perdida
- Depende de hardware de audio no evento

### Riscos

- Staff esquece som ligado durante momento inadequado: mitigacao com toggle visivel no admin.
