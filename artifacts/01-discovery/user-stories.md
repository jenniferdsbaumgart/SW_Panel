# User Stories - SW Painel

## Personas Referencia

| Persona | Descricao |
|---------|-----------|
| Audiencia | Qualquer pessoa observando o painel LED (participantes, mentores, jurados, visitantes). Interacao passiva. |
| Staff SW | Membro da equipe organizadora que opera o painel admin. Interacao ativa. |
| Sistema | O proprio SW Painel como cliente WebSocket, recebendo eventos do Gerencial/n8n. |

---

## EP-01: Conexao e Dados

### US-001: Conexao WebSocket com o Gerencial

**Epico**: EP-01
**Como** sistema, **quero** conectar via WebSocket ao endpoint `/ws/journey` do Gerencial, **para** receber eventos de mudanca de estado das equipes em tempo real.

**Criterios de aceite:**
- [ ] Given o painel e iniciado, when a aplicacao carrega, then uma conexao WebSocket e estabelecida com `/ws/journey`.
- [ ] Given a conexao e estabelecida, when o servidor envia um evento, then o painel recebe e processa o evento em menos de 100ms.
- [ ] Given a conexao falha no inicio, when o painel tenta conectar, then exibe indicador visual de "Conectando..." e tenta novamente com backoff.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-002: Reconexao Automatica

**Epico**: EP-01
**Como** sistema, **quero** reconectar automaticamente caso a conexao WebSocket caia, **para** garantir que nenhum evento seja perdido durante o evento de 54h.

**Criterios de aceite:**
- [ ] Given a conexao WebSocket cai, when o painel detecta a desconexao, then tenta reconectar em menos de 2 segundos.
- [ ] Given a reconexao falha, when tenta novamente, then usa backoff exponencial (2s, 4s, 8s, max 30s).
- [ ] Given a reconexao e bem-sucedida, when o WebSocket reconecta, then o painel solicita evento `sync` para reconstruir estado completo.
- [ ] Given a reconexao esta em andamento, when o painel esta exibido, then os dados existentes continuam visiveis (nunca limpa a tela).
- [ ] Given a reconexao e concluida, when o estado e sincronizado, then a latencia total reconexao + sync e menor que 5 segundos.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-003: Receber Evento sync e Construir Estado Inicial

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `sync` contendo o estado completo de todas as equipes, **para** renderizar o painel corretamente na carga inicial ou apos reconexao.

**Criterios de aceite:**
- [ ] Given o painel conecta pela primeira vez, when recebe evento `sync`, then carrega `teams: TeamState[]` e renderiza todas as equipes nas etapas corretas.
- [ ] Given o painel reconecta apos queda, when recebe evento `sync`, then substitui o estado em memoria pelo estado recebido.
- [ ] Given o evento `sync` contem 15 equipes, when processado, then todas as 15 equipes sao exibidas corretamente na trilha.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-004: Receber Evento stage_update

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `stage_update` quando uma equipe avanca de etapa, **para** atualizar a posicao da equipe na trilha e disparar a celebracao correspondente.

**Criterios de aceite:**
- [ ] Given um evento `stage_update` chega, when contem `team_id`, `from_stage`, `to_stage`, `celebration_type`, `card`, then o estado da equipe e atualizado em memoria.
- [ ] Given o estado e atualizado, when o card se move para a nova etapa, then a celebracao do tipo indicado e disparada.
- [ ] Given `celebration_type` e "light", when processado, then celebracao leve (~2s) e executada.
- [ ] Given `celebration_type` e "medium_high", when processado, then celebracao media-alta (~5s) e executada.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-005: Receber Evento waiting

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `waiting` quando uma equipe submete para mentor, **para** mudar o estado visual do card para "aguardando".

**Criterios de aceite:**
- [ ] Given um evento `waiting` chega, when contem `team_id` e `stage`, then o card da equipe muda para estado visual pulsante/brilhante.
- [ ] Given a equipe esta aguardando, when recebe `stage_update` subsequente, then o estado "aguardando" e removido e substituido pela celebracao.

**Prioridade**: Should
**Estimativa**: S
**Fase**: 2

---

### US-006: Receber Evento pivot

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `pivot` quando uma equipe muda de direcao, **para** exibir animacao de pivot e atualizar a posicao na trilha.

**Criterios de aceite:**
- [ ] Given um evento `pivot` chega, when contem `team_id`, `from_stage`, `to_stage`, `reason`, `card`, then a equipe e movida para a nova etapa.
- [ ] Given o pivot e processado, when a animacao dispara, then exibe tom positivo de "recalcular rota" (~3s).
- [ ] Given o card apos pivot, when renderizado, then exibe indicador visual de pivot (contorno tracejado + icone de recalculo).

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

### US-007: Receber Evento hero

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `hero` quando uma equipe completa a jornada, **para** disparar a celebracao maxima (HERO) com takeover do painel.

**Criterios de aceite:**
- [ ] Given um evento `hero` chega, when contem `team_id` e `card_hero`, then o card da equipe recebe estado visual especial dourado.
- [ ] Given o evento `hero`, when a celebracao dispara, then faz takeover do painel inteiro por ~8 segundos com fogos dourados.
- [ ] Given a celebracao HERO termina, when o painel volta ao normal, then o card permanece com visual dourado/especial.

**Prioridade**: Should
**Estimativa**: L
**Fase**: 2

---

### US-008: Receber Evento panel_control

**Epico**: EP-01
**Como** sistema, **quero** processar o evento `panel_control` com acoes pause/resume/reset, **para** permitir que o staff controle o painel remotamente.

**Criterios de aceite:**
- [ ] Given `action: "pause"`, when processado, then o painel congela no estado atual (sem novas animacoes).
- [ ] Given `action: "resume"`, when processado, then o painel retoma o processamento de eventos (eventos acumulados sao processados em sequencia).
- [ ] Given `action: "reset"`, when processado, then o painel limpa o estado e solicita novo `sync`.

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

### US-009: Estado em Memoria com Fallback

**Epico**: EP-01
**Como** sistema, **quero** manter o estado completo das equipes em memoria, **para** renderizar o painel sem depender de banco de dados e com performance maxima.

**Criterios de aceite:**
- [ ] Given eventos chegam via WebSocket, when processados, then o estado em memoria e atualizado incrementalmente.
- [ ] Given o painel e recarregado (F5), when a pagina reinicia, then o estado e reconstruido via evento `sync`.
- [ ] Given 15 equipes com historico de transicoes, when em memoria, then o consumo de memoria permanece estavel (sem leak).

**Prioridade**: Must
**Estimativa**: S
**Fase**: 1

---

## EP-02: Trilha e Layout

### US-010: Layout Board Game com 8 Etapas

**Epico**: EP-02
**Como** audiencia, **quero** ver uma trilha estilo board game com todas as 8 etapas da jornada "From Zero to Hero", **para** entender visualmente o percurso completo de cada equipe.

**Criterios de aceite:**
- [ ] Given o painel esta carregado, when a tela renderiza, then as 8 etapas sao exibidas em sequencia visual (ZERO -> IDEIA -> PROBLEMA -> VALIDACAO -> MVP -> SOL. VALIDADA -> PITCH -> HERO).
- [ ] Given a proporcao e 1:2, when o layout renderiza, then a trilha ocupa a area inteira sem overflow ou scroll.
- [ ] Given cada etapa tem nome e icone, when renderizada, then ambos sao legiveis a 10-15 metros de distancia.
- [ ] Given o fundo utiliza a paleta definida, when renderizado, then usa Preto Noturno `#0F0A1A` como base com blobs organicos violeta.

**Prioridade**: Must
**Estimativa**: L
**Fase**: 1

---

### US-011: Proporcao Fixa 1:2 para LED 2x4m

**Epico**: EP-02
**Como** audiencia, **quero** que o painel tenha proporcao fixa 1:2 otimizada para o LED de 2x4m, **para** que nao haja distorcao ou espacos vazios na exibicao.

**Criterios de aceite:**
- [ ] Given qualquer resolucao de tela, when o painel renderiza, then mantem aspect-ratio 1:2 com letterboxing se necessario.
- [ ] Given o LED de 2x4m, when o painel e exibido, then ocupa 100% da area util sem scroll.
- [ ] Given o modo fullscreen, when ativado (F11 ou via admin), then o painel ocupa toda a viewport.

**Prioridade**: Must
**Estimativa**: S
**Fase**: 1

---

### US-012: Suporte a 8-15 Equipes Simultaneas

**Epico**: EP-02
**Como** audiencia, **quero** visualizar de 8 a 15 equipes simultaneamente na trilha, **para** acompanhar todas as equipes do evento.

**Criterios de aceite:**
- [ ] Given 8 equipes no evento, when renderizadas, then todos os cards sao visiveis e legiveis.
- [ ] Given 15 equipes no evento, when renderizadas, then os cards sao redimensionados proporcionalmente para caber sem sobreposicao.
- [ ] Given equipes concentradas nas etapas iniciais, when o layout calcula, then distribui o espaco de forma equilibrada.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-013: Legibilidade a 10-15 Metros

**Epico**: EP-02
**Como** audiencia, **quero** que nomes de equipes, etapas e informacoes-chave sejam legiveis a 10-15 metros de distancia, **para** acompanhar o painel de qualquer ponto do auditorio.

**Criterios de aceite:**
- [ ] Given tipografia Montserrat Black para titulos, when renderizada no LED 2x4m, then e legivel a 15 metros.
- [ ] Given nomes de equipes nos cards, when renderizados com Inter, then sao legiveis a 10 metros.
- [ ] Given contraste texto/fundo, when exibido, then segue WCAG AA para tamanhos grandes.

**Prioridade**: Must
**Estimativa**: S
**Fase**: 1

---

## EP-03: Cards das Equipes

### US-014: Renderizar Card de Equipe com Imagem

**Epico**: EP-03
**Como** audiencia, **quero** ver o card visual de cada equipe com imagem gerada pelo n8n, **para** identificar rapidamente cada equipe na trilha.

**Criterios de aceite:**
- [ ] Given o evento `stage_update` ou `sync` contem `card` com dados de imagem, when o card renderiza, then a imagem do card e exibida como elemento principal.
- [ ] Given o card nao tem imagem disponivel, when renderiza, then exibe placeholder com nome da equipe e cor associada.
- [ ] Given o nome da equipe (`team_name`), when exibido no card, then e legivel a 10 metros.
- [ ] Given a cor da equipe (`team_color`), when aplicada ao card, then e usada como cor de destaque/borda.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-015: Posicionar Card na Etapa Correta

**Epico**: EP-03
**Como** audiencia, **quero** ver o card de cada equipe posicionado na etapa correspondente da trilha, **para** saber em que ponto da jornada cada equipe esta.

**Criterios de aceite:**
- [ ] Given uma equipe esta na etapa 3 (VALIDACAO), when o painel renderiza, then o card aparece na posicao correspondente a VALIDACAO na trilha.
- [ ] Given multiplas equipes estao na mesma etapa, when a etapa renderiza, then os cards sao organizados sem sobreposicao.
- [ ] Given uma equipe avanca de etapa via `stage_update`, when processado, then o card anima da posicao antiga para a nova.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-016: 5 Estados Visuais dos Cards

**Epico**: EP-03
**Como** audiencia, **quero** distinguir visualmente o estado de cada equipe (ativa, aguardando, celebrando, pivotada, HERO), **para** entender o que esta acontecendo com cada uma.

**Criterios de aceite:**
- [ ] Given equipe em estado "ativa", when renderizada, then card aparece solido na cor da equipe.
- [ ] Given equipe em estado "aguardando", when renderizada, then card pulsa/brilha indicando submissao para mentor.
- [ ] Given equipe em estado "celebrando", when renderizada, then animacao de celebracao esta ativa por 2-8 segundos.
- [ ] Given equipe em estado "pivotada", when renderizada, then card tem contorno tracejado e icone de recalculo.
- [ ] Given equipe em estado "HERO", when renderizada, then card tem visual dourado/especial permanente.

**Prioridade**: Must (ativa, celebrando) / Should (aguardando, pivotada, HERO)
**Estimativa**: L
**Fase**: 1 (ativa, celebrando) / 2 (aguardando, pivotada, HERO)

---

## EP-04: Celebracoes

### US-017: Celebracao Leve (Etapas 0->1, 1->2)

**Epico**: EP-04
**Como** audiencia, **quero** ver uma animacao sutil quando uma equipe avanca nas etapas iniciais, **para** perceber o progresso sem interromper o fluxo geral.

**Criterios de aceite:**
- [ ] Given `celebration_type` e "light" (etapas ZERO->IDEIA ou IDEIA->PROBLEMA), when disparada, then executa deslize suave + pulse sutil.
- [ ] Given a celebracao leve, when em execucao, then dura aproximadamente 2 segundos.
- [ ] Given a animacao, when renderizada, then mantem 60fps no LED.

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1 (versao basica) / 2 (versao completa)

---

### US-018: Celebracao Media-Alta (Etapas 3->4, 4->5, 5->6)

**Epico**: EP-04
**Como** audiencia, **quero** ver uma celebracao vibrante quando uma equipe conquista marcos importantes (MVP, solucao validada, pitch), **para** sentir o impacto emocional de cada conquista.

**Criterios de aceite:**
- [ ] Given `celebration_type` e "medium_high" (etapas VALIDACAO->MVP, MVP->SOL.VALIDADA, SOL.VALIDADA->PITCH), when disparada, then executa flash + particulas + bounce + nome em destaque.
- [ ] Given a celebracao media-alta, when em execucao, then dura aproximadamente 5 segundos.
- [ ] Given o nome da equipe em destaque, when exibido, then e legivel para todo o auditorio.

**Prioridade**: Should
**Estimativa**: L
**Fase**: 2

---

### US-019: Celebracao MAXIMA -- HERO (Etapa 6->7)

**Epico**: EP-04
**Como** audiencia, **quero** ver uma celebracao espetacular quando uma equipe completa a jornada inteira, **para** que o momento seja inesquecivel e todo o auditorio celebre.

**Criterios de aceite:**
- [ ] Given evento `hero` ou `stage_update` para etapa HERO, when disparada, then executa takeover do painel inteiro.
- [ ] Given a celebracao HERO, when em execucao, then dura aproximadamente 8 segundos.
- [ ] Given a animacao de takeover, when ativa, then exibe fogos dourados, nome da equipe em destaque maximo, e sensacao de conquista epica.
- [ ] Given a celebracao HERO termina, when o painel volta ao normal, then o card permanece com visual dourado permanente.

**Prioridade**: Should
**Estimativa**: XL
**Fase**: 2

---

### US-020: Celebracao de Pivot

**Epico**: EP-04
**Como** audiencia, **quero** ver uma animacao especial quando uma equipe pivota, **para** entender que houve mudanca de direcao mas com tom positivo.

**Criterios de aceite:**
- [ ] Given evento `pivot`, when a animacao dispara, then exibe efeito de "recalcular rota" com tom positivo.
- [ ] Given a celebracao de pivot, when em execucao, then dura aproximadamente 3 segundos.
- [ ] Given a animacao de pivot, when termina, then o card permanece com badge visual de pivot (tracejado + icone).

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

### US-021: Fila Sequencial de Celebracoes

**Epico**: EP-04
**Como** sistema, **quero** enfileirar celebracoes quando multiplas equipes avancam simultaneamente, **para** que nenhuma celebracao seja perdida e cada uma receba sua atencao.

**Criterios de aceite:**
- [ ] Given duas celebracoes chegam simultaneamente, when a primeira esta em execucao, then a segunda e enfileirada.
- [ ] Given a fila tem 3 celebracoes, when processada, then cada uma e executada em sequencia completa.
- [ ] Given a fila esta sendo processada, when uma celebracao HERO chega, then ela ganha prioridade e e executada primeiro.
- [ ] Given zero celebracoes perdidas como meta, when todas as celebracoes sao enfileiradas, then todas sao eventualmente executadas.

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

## EP-05: Admin

### US-022: Visualizar Estado Atual do Painel

**Epico**: EP-05
**Como** staff SW, **quero** ver um resumo do estado atual do painel (equipes por etapa, conexao WebSocket, fila de celebracoes), **para** monitorar que tudo esta funcionando.

**Criterios de aceite:**
- [ ] Given o admin e acessado em URL separada (ex: `/admin`), when carrega, then exibe lista de equipes com etapa atual.
- [ ] Given o WebSocket esta conectado, when o admin renderiza, then exibe indicador de conexao ativa.
- [ ] Given ha celebracoes na fila, when o admin renderiza, then exibe contagem da fila.

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

### US-023: Override Manual de Celebracao

**Epico**: EP-05
**Como** staff SW, **quero** disparar uma celebracao manualmente para qualquer equipe, **para** cobrir cenarios onde o WebSocket falhou ou para testes.

**Criterios de aceite:**
- [ ] Given o admin exibe lista de equipes, when seleciono uma equipe e tipo de celebracao, then a celebracao e disparada no painel.
- [ ] Given o override e executado, when a celebracao dispara, then e identica a celebracao automatica.

**Prioridade**: Should
**Estimativa**: M
**Fase**: 2

---

### US-024: Pausar e Retomar Painel

**Epico**: EP-05
**Como** staff SW, **quero** pausar e retomar o painel, **para** controlar o display durante momentos especificos do evento (ex: intervalo, pitch final no palco).

**Criterios de aceite:**
- [ ] Given o botao "Pausar" e clicado no admin, when ativado, then o painel congela no estado atual sem processar novos eventos.
- [ ] Given o painel esta pausado, when o botao "Retomar" e clicado, then o painel retoma e processa eventos acumulados em sequencia.
- [ ] Given o painel esta pausado, when exibido no LED, then um indicador sutil (so visivel para staff proximo) mostra que esta pausado.

**Prioridade**: Should
**Estimativa**: S
**Fase**: 2

---

### US-025: Log de Eventos

**Epico**: EP-05
**Como** staff SW, **quero** ver um log em tempo real de todos os eventos recebidos via WebSocket, **para** diagnosticar problemas durante o evento.

**Criterios de aceite:**
- [ ] Given eventos chegam via WebSocket, when o admin esta aberto, then cada evento aparece no log com timestamp, tipo e dados resumidos.
- [ ] Given o log tem mais de 100 entradas, when exibido, then mantem scroll automatico para o mais recente.
- [ ] Given um evento com erro, when logado, then e destacado visualmente em vermelho.

**Prioridade**: Could
**Estimativa**: M
**Fase**: 3

---

## EP-06: Resiliencia

### US-026: Reconexao Graceful sem Perda Visual

**Epico**: EP-06
**Como** audiencia, **quero** que o painel nunca fique em branco durante uma desconexao, **para** que a experiencia visual nao seja interrompida.

**Criterios de aceite:**
- [ ] Given a conexao WebSocket cai, when o painel perde conexao, then o ultimo estado renderizado permanece visivel.
- [ ] Given a reconexao e bem-sucedida, when o novo `sync` chega, then transiciona suavemente para o estado atualizado (sem flash ou reload).
- [ ] Given a desconexao dura mais de 30 segundos, when exibido, then um indicador discreto aparece (apenas para staff proximo).

**Prioridade**: Must
**Estimativa**: M
**Fase**: 1

---

### US-027: Fallback para Cards sem Imagem

**Epico**: EP-06
**Como** audiencia, **quero** que cards sem imagem exibam um placeholder elegante, **para** que o painel nunca tenha espacos quebrados.

**Criterios de aceite:**
- [ ] Given o card nao possui imagem no payload, when renderizado, then exibe placeholder com nome da equipe em destaque + cor da equipe.
- [ ] Given a imagem falha ao carregar (URL invalida, timeout), when detectado, then o placeholder e exibido sem layout shift.

**Prioridade**: Must
**Estimativa**: S
**Fase**: 1

---

### US-028: Persistencia de Estado via LocalStorage

**Epico**: EP-06
**Como** sistema, **quero** salvar o ultimo estado conhecido em localStorage, **para** que se o navegador recarregar antes do WebSocket reconectar, haja algo para exibir imediatamente.

**Criterios de aceite:**
- [ ] Given o estado muda via evento WebSocket, when atualizado, then o estado e salvo em localStorage.
- [ ] Given o navegador e recarregado, when antes do `sync` chegar, then o estado do localStorage e carregado como fallback.
- [ ] Given o `sync` chega apos reload, when processado, then o estado do localStorage e substituido pelo estado do servidor.

**Prioridade**: Should
**Estimativa**: S
**Fase**: 2

---

### US-029: 60fps e Performance

**Epico**: EP-06
**Como** audiencia, **quero** que todas as animacoes rodem a 60fps sem travamentos, **para** que a experiencia visual seja fluida e profissional.

**Criterios de aceite:**
- [ ] Given celebracao HERO (a mais pesada), when executada com 15 equipes no painel, then mantem 60fps.
- [ ] Given o painel roda por 54 horas, when monitorado, then nao ha degradacao de performance.
- [ ] Given as animacoes utilizam GPU acceleration, when executadas, then o CPU usage permanece abaixo de 50%.

**Prioridade**: Must
**Estimativa**: L
**Fase**: 3

---

## Resumo de Estimativas

| Epico | Stories | Must Have | Should Have | Could Have | Total Estimado |
|-------|---------|-----------|-------------|------------|---------------|
| EP-01: Conexao e Dados | 9 | US-001(M), US-002(M), US-003(M), US-004(M), US-009(S) | US-005(S), US-006(M), US-007(L), US-008(M) | - | ~6 dias |
| EP-02: Trilha e Layout | 4 | US-010(L), US-011(S), US-012(M), US-013(S) | - | - | ~3 dias |
| EP-03: Cards das Equipes | 3 | US-014(M), US-015(M), US-016(L) | - | - | ~3.5 dias |
| EP-04: Celebracoes | 5 | US-017(M) | US-018(L), US-019(XL), US-020(M), US-021(M) | - | ~5.5 dias |
| EP-05: Admin | 4 | - | US-022(M), US-023(M), US-024(S) | US-025(M) | ~3 dias |
| EP-06: Resiliencia | 4 | US-026(M), US-027(S) | US-028(S) | - | ~2.5 dias |
| **Total** | **29** | **15** | **11** | **3** (incl. US-029 Must Fase 3) | **~23.5 dias** |

## Prioridade de Implementacao por Fase

### Fase 1 -- MVP (~10 dias)
1. US-001: Conexao WebSocket
2. US-002: Reconexao automatica
3. US-003: Evento sync + estado inicial
4. US-009: Estado em memoria
5. US-010: Layout board game
6. US-011: Proporcao 1:2
7. US-012: Suporte 8-15 equipes
8. US-013: Legibilidade
9. US-014: Card de equipe
10. US-015: Posicionar card na etapa
11. US-004: Evento stage_update
12. US-017: Celebracao leve (basica)
13. US-016: Estados visuais (ativa + celebrando)
14. US-026: Reconexao graceful
15. US-027: Fallback cards

### Fase 2 -- Visual Completo (~10 dias)
1. US-005: Evento waiting
2. US-006: Evento pivot
3. US-007: Evento hero
4. US-008: Evento panel_control
5. US-016: Estados visuais (aguardando, pivotada, HERO)
6. US-018: Celebracao media-alta
7. US-019: Celebracao HERO
8. US-020: Celebracao pivot
9. US-021: Fila sequencial
10. US-022: Admin estado
11. US-023: Admin override
12. US-024: Admin pause/resume
13. US-028: Persistencia localStorage

### Fase 3 -- Polish (~3.5 dias)
1. US-029: 60fps e performance
2. US-025: Log de eventos
3. Som opcional
4. Otimizacao LED real
5. Testes de resiliencia 54h
