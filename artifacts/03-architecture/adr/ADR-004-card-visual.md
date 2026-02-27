# ADR-004: Card Visual -- Imagem Pronta vs Renderizacao Client-Side

## Status

Accepted

## Contexto

O n8n gera cards visuais para cada equipe. O SW Painel precisa exibir esses cards na trilha. A questao e: o card chega como imagem pronta (URL) ou como dados JSON para renderizar no client?

O contrato WebSocket (`api-contract.md`) ja define:

```typescript
interface CardData {
  image_url: string;
  title?: string;
  subtitle?: string;
}
```

## Decisao

**Imagem pronta via `image_url`**, confirmando o contrato existente.

## Justificativa

1. **Desacoplamento total.** O n8n controla a aparencia do card. O painel apenas exibe. Se o designer quiser mudar o visual do card, muda no n8n. Zero deploy no painel.

2. **Performance de rendering.** Uma `<img>` e renderizada pela GPU do browser. Sem layout calculation, sem DOM complexo por card. Com 15 cards simultaneos, isso importa.

3. **Consistencia.** O card que aparece no painel e exatamente o que o n8n gerou. Nao ha risco de divergencia entre o que o n8n "quis" e o que o painel "renderizou".

4. **Simplicidade.** `<img src={card.image_url} />` vs construir um componente React que interpreta JSON e renderiza tipografia, cores, layout, etc.

## Fallback

Quando `card` e `null` ou `image_url` falha ao carregar:

1. Exibir placeholder com `team_name` em tipografia Montserrat Black
2. Usar `team_color` como cor de fundo do placeholder
3. Manter dimensoes identicas ao card real (sem layout shift)

Implementar via `onError` no `<img>` + state local para fallback.

## Consequencias

### Positivas

- Zero complexidade de rendering de cards
- Visual controlado externamente (n8n)
- Performance otima

### Negativas

- Dependencia de URLs de imagem acessiveis na rede local
- Se o n8n gerar imagens grandes, pode haver latencia no carregamento

### Riscos

- Imagens inacessiveis (URL invalida, n8n offline): mitigacao com fallback placeholder.
- Latencia de carregamento: mitigacao com preload das imagens quando o evento `sync` chega.
