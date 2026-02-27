# Vision Document: SW Painel

| Campo | Valor |
|-------|-------|
| Produto | SW Painel |
| Versao | 1.0 (MVP) |
| Data | 2026-02-27 |
| Autor | Product Strategist (STRAAS Squad) |

---

## Visao

Transformar cada avanço de equipe no Startup Weekend em um momento visual memoravel, projetado em um painel LED de 2x4m que narra a jornada "From Zero to Hero" em tempo real.

## Norte Emocional

> "A equipe apresentou pro mentor. O mentor aprova na plataforma. O n8n dispara. Nosso painel de 2x4m EXPLODE com celebracao. Todo auditorio olha. A equipe comemora. As outras pensam: eu quero ser o proximo."

---

## Problema

### Contexto

O progresso das equipes durante o Startup Weekend e acompanhado por post-its em backdrop fisico. Estatico, limitado, desperdica o potencial emocional dos momentos de avanço.

### Dores Atuais

1. **Estatico e sem vida**: Post-its nao celebram, nao criam tensao, nao engajam.
2. **Falta de gamificacao**: Nao ha senso de competicao saudavel entre equipes.
3. **Momentos de avanço desperdicados**: Aprovacao de mentor e um marco que ninguem ve.
4. **Baixa visibilidade coletiva**: Audiencia nao sabe em que ponto cada equipe esta.
5. **Sem impacto emocional**: A narrativa "do zero ao heroi" existe, mas ninguem a sente.

### Quem Tem Este Problema

- **Organizadores** do Startup Weekend -- querem engajamento e dinamismo visual.
- **Equipes participantes** -- querem reconhecimento publico a cada avanço.
- **Audiencia/mentores** -- querem acompanhar a narrativa do evento.
- **Staff tecnico** -- precisa de controle sobre o painel sem complexidade.

---

## Solucao

Um painel digital fullscreen projetado em LED de 2x4m (proporcao 1:2) que:

1. **Recebe eventos em tempo real** via WebSocket conectado ao endpoint `/ws/journey` do sistema Gerencial.
2. **Recebe cards prontos** gerados pelo n8n, sem gerar cards localmente.
3. **Renderiza trilha estilo board game** com 8 etapas + pivot, mostrando 8-15 equipes simultaneamente.
4. **Dispara celebracoes visuais** com 4 niveis de intensidade (leve, media-alta, maxima, pivot).
5. **Mantem estado em memoria** para exibicao, sem banco de dados.
6. **Oferece painel admin basico** para staff do SW controlar o painel.

### Fluxo de Dados

```
Plataforma dos Mentores (Sofia)
        |
        v
  Mentor aprova etapa
        |
        v
  n8n processa e gera card
        |
        v
  WebSocket /ws/journey
        |
        v
  SW Painel recebe evento + card
        |
        v
  Renderiza na trilha + dispara celebracao
```

### O que o SW Painel NAO faz

- NAO gerencia cadastro de equipes
- NAO gera cards (recebe prontos do n8n)
- NAO tem logica de aprovacao de mentores
- NAO tem interacao do publico (display-only)

---

## Publico-Alvo

### Usuarios Primarios (Observadores do Painel)

| Persona | Papel | Interacao |
|---------|-------|-----------|
| Audiencia do evento | Todos presentes no auditorio | Passiva -- observam o LED de 2x4m a 10-15m de distancia |
| Equipes participantes | Veem seu progresso celebrado publicamente | Passiva -- motivacao e competicao saudavel |
| Mentores/Jurados | Acompanham evolucao de quem mentoram | Passiva -- referencia visual |

### Usuarios Operacionais

| Persona | Papel | Interacao |
|---------|-------|-----------|
| Staff do SW | Opera o painel admin | Ativa -- override, pause/resume, log |

---

## Proposta de Valor

O SW Painel transforma um backdrop estatico de post-its em uma experiencia digital ao vivo que:

- **Cria tensao narrativa**: Todo mundo ve quem esta avancando.
- **Celebra publicamente**: Cada avanço explode no painel de 2x4m.
- **Gamifica naturalmente**: Equipes veem umas as outras e querem ser as proximas.
- **Automatiza a comunicacao**: Zero intervencao manual -- o fluxo Sofia -> n8n -> WebSocket faz tudo.

---

## Metricas de Sucesso

### Desempenho Tecnico

| Metrica | Meta |
|---------|------|
| Latencia evento -> animacao | < 500ms |
| Uptime continuo | 99.9% (54h sem interrupcao) |
| Celebracoes perdidas | Zero |
| Reconexao automatica | < 5s |
| Frame rate | 60fps constante |

### Experiencia

| Metrica | Meta |
|---------|------|
| Legibilidade a distancia | 10-15 metros |
| Suporte simultaneo | 8-15 equipes |
| Celebracao HERO visivel | Para todo o auditorio |

---

## Restricoes

### Tecnicas

1. **Proporcao fixa 1:2**: Otimizada para painel LED de 2x4m.
2. **Display-only**: O painel publico nao tem interacao. E apenas exibicao.
3. **WebSocket client**: Recebe dados de `/ws/journey` do Gerencial. Nao expoe server.
4. **Estado em memoria**: Nao usa banco de dados. Estado reconstituido via evento `sync`.
5. **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, animacoes (Framer Motion ou GSAP -- decisao em aberto).

### Identidade Visual

1. **Violeta Intenso** `#7C3AED` (60%) -- cor dominante.
2. **Preto Noturno** `#0F0A1A` (25%) -- fundo.
3. **Branco** `#FFFFFF` (10%) -- textos e acentos.
4. **Verde-Limao** `#BFFF00` (5%) -- destaques.
5. **Tipografia**: Montserrat Black (display), Inter (corpo).
6. **Elementos**: Blobs organicos violeta como fundo.
7. **SEM cores quentes**. SEM skyline SW.

### Operacionais

1. **Evento de 54 horas**: Deve rodar continuamente sem degradacao.
2. **Setup rapido**: Basta abrir URL no navegador do LED.
3. **Resiliencia**: Reconexao automatica, fallback gracioso.

---

## Premissas

1. O sistema Gerencial (Sofia) e o n8n estarao operacionais e conectados.
2. O endpoint WebSocket `/ws/journey` estara disponivel no Gerencial.
3. Cards serao gerados pelo n8n e entregues nos payloads dos eventos.
4. O painel LED de 2x4m estara configurado e acessivel via navegador.
5. O numero maximo de equipes e 15 (tipico: 8-12).
6. A rede local do evento permite comunicacao WebSocket estavel.

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| WebSocket desconecta durante evento | Media | Alto | Reconexao automatica < 5s + evento `sync` para recarregar estado |
| Celebracoes sobrepostas (varias equipes avancam juntas) | Alta | Medio | Fila sequencial de celebracoes |
| Memory leak em 54h de execucao | Baixa | Alto | Testes de estresse prolongado |
| Latencia > 500ms na animacao | Baixa | Alto | Otimizacao de render, 60fps target |
| Painel LED nao exibe proporcao 1:2 | Baixa | Alto | CSS com aspect-ratio fixo, testes no hardware real |

---

## Fases de Entrega

### Fase 1 -- MVP

- Conexao WebSocket com `/ws/journey`
- Estado em memoria (recebido via `sync` + `stage_update`)
- Trilha board game com 8 etapas
- Cards das equipes posicionados na etapa correta
- Estados visuais basicos (ativa, celebrando)
- Celebracao unica para todos os avanços

### Fase 2 -- Visual Completo

- 4 niveis de celebracao (leve, media-alta, maxima, pivot)
- Fila sequencial de celebracoes
- Estado visual "aguardando" (pulsando)
- Estado visual "pivotada" (tracejado + icone)
- Estado visual "HERO" (dourado)
- Identidade visual completa (paleta, tipografia, blobs)
- Painel admin basico (override, pause/resume)

### Fase 3 -- Polish

- 60fps garantido com otimizacao
- Som opcional nas celebracoes
- Admin avancado com log de eventos
- Otimizacao para LED real
- Testes de resiliencia (54h continuas)
