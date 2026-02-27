# JTBD Analysis: SW Painel

## Primary Jobs

### Job 1: Celebrar Avanços Publicamente em Tempo Real

**Statement:**
When uma equipe conquista um marco (aprovacao de mentor, MVP pronto, pitch realizado),
I want to que o painel LED de 2x4m exploda com uma celebracao visual proporcional ao marco,
So I can criar momentos memoraveis que engajam o auditorio e motivam todas as equipes.

**Context:**
- Trigger: Mentor aprova equipe na plataforma Sofia -> n8n processa -> WebSocket dispara
- Frequency: 50-150 eventos durante 54 horas
- Importance: Critical

**Current Solutions:**
- Post-its movidos manualmente em backdrop fisico
- Comunicacao verbal pelos organizadores
- Nenhuma celebracao visual

**Pain Points:**
- Momentos de avanço passam completamente despercebidos
- Nao ha impacto emocional quando uma equipe conquista algo
- Post-its sao estaticos e nao criam tensao

**Success Criteria:**
- Celebracao aparece no painel em < 500ms apos evento
- 4 niveis de intensidade (leve, media-alta, maxima, pivot)
- HERO (jornada completa) faz takeover do painel por 8 segundos
- Zero celebracoes perdidas

---

### Job 2: Criar Competicao Saudavel entre Equipes

**Statement:**
When o Startup Weekend esta acontecendo e equipes trabalham em paralelo,
I want to que todas as equipes vejam o progresso umas das outras na trilha "From Zero to Hero",
So I can criar tensao narrativa e gamificacao natural ("eu quero ser o proximo").

**Context:**
- Trigger: Painel LED visivel para todo o auditorio durante 54 horas
- Frequency: Continuamente
- Importance: High

**Current Solutions:**
- Quadro com post-its (pouco visivel, sem dinamismo)
- Nenhuma gamificacao visual

**Pain Points:**
- Equipes trabalham isoladas sem nocao do progresso das outras
- Nao ha senso de competicao nem urgencia
- Avanços de outras equipes nao sao percebidos

**Success Criteria:**
- 8-15 equipes visiveis simultaneamente na trilha
- Posicao de cada equipe clara e legivel a 10-15 metros
- Quando uma equipe avanca, as outras notam e reagem

---

### Job 3: Exibir a Jornada Completa sem Intervencao

**Statement:**
When os organizadores estao focados em facilitar o evento,
I want to que o painel funcione de forma 100% automatica (recebendo eventos via WebSocket),
So I can nao precisar mexer no painel durante as 54 horas do evento.

**Context:**
- Trigger: Inicio do evento ate o encerramento
- Frequency: Continuous (54 horas)
- Importance: Critical

**Current Solutions:**
- Organizadores atualizam quadros manualmente
- Alguem de plantao para "dar refresh" se travar

**Pain Points:**
- Qualquer intervencao manual tira tempo da organizacao
- Sistemas web travam sem aviso
- Sem reconexao automatica, queda passa despercebida

**Success Criteria:**
- Zero intervencao manual no painel publico
- Reconexao automatica WebSocket < 5 segundos
- Estado reconstruido via evento `sync` apos reconexao
- Uptime 99.9% durante 54 horas

---

### Job 4: Controlar o Painel em Momentos Especificos

**Statement:**
When ha um intervalo, pitch no palco, ou necessidade de corrigir algo,
I want to pausar, retomar ou disparar celebracoes manualmente via painel admin,
So I can manter controle sobre o que aparece no LED durante o evento.

**Context:**
- Trigger: Decisao do staff durante o evento
- Frequency: 5-10 vezes durante o evento
- Importance: Medium

**Current Solutions:**
- Desligar o projetor/monitor
- Pedir para alguem "recarregar a pagina"

**Pain Points:**
- Nenhum controle sobre o display durante o evento
- Se algo errado aparece, nao ha como corrigir rapidamente

**Success Criteria:**
- Pausar/retomar com um clique no admin
- Override de celebracao para qualquer equipe
- Log de eventos para diagnostico em tempo real

---

## Job Hierarchy

```
Transformar avanços de equipes em momentos visuais memoraveis
├── Receber eventos em tempo real via WebSocket
│   ├── Conectar em /ws/journey do Gerencial
│   ├── Processar eventos: stage_update, waiting, pivot, hero, sync, panel_control
│   └── Reconectar automaticamente em caso de queda
├── Renderizar trilha "From Zero to Hero"
│   ├── Exibir 8 etapas em layout board game
│   ├── Posicionar cards de 8-15 equipes nas etapas corretas
│   └── Garantir legibilidade a 10-15m no LED 2x4m
├── Disparar celebracoes visuais por nivel
│   ├── Celebracao leve (~2s) para etapas iniciais
│   ├── Celebracao media-alta (~5s) para marcos de mentor
│   ├── Celebracao MAXIMA (~8s) para HERO
│   ├── Celebracao pivot (~3s) com tom positivo
│   └── Gerenciar fila sequencial de celebracoes
├── Exibir 5 estados visuais dos cards
│   ├── Ativa (solido)
│   ├── Aguardando (pulsante)
│   ├── Celebrando (animacao ativa)
│   ├── Pivotada (tracejado)
│   └── HERO (dourado permanente)
└── Controlar painel via admin
    ├── Pausar/retomar exibicao
    ├── Override manual de celebracoes
    └── Log de eventos em tempo real
```

## Related Jobs

| When | Related Job |
|------|-------------|
| Before | Configurar plataforma de mentores Sofia |
| Before | Configurar workflows n8n para gerar cards e emitir eventos |
| Before | Configurar hardware LED 2x4m e rede local |
| During | Mentores aprovam equipes na plataforma Sofia |
| During | n8n processa aprovacoes e gera cards |
| During | Staff monitora painel admin |
| After | Registrar fotos/video do painel para divulgacao |
| After | Coletar feedback dos participantes sobre a experiencia |

## Feature Mapping

| Job | Feature | Priority |
|-----|---------|----------|
| Receber eventos em tempo real | WebSocket client + processamento de 7 tipos de evento | Must Have |
| Reconexao automatica | Backoff exponencial + sync de estado | Must Have |
| Renderizar trilha board game | Layout 1:2 com 8 etapas para LED 2x4m | Must Have |
| Posicionar cards | Card de equipe na etapa correta com transicao animada | Must Have |
| Celebracao leve | Animacao sutil para avanços iniciais | Must Have |
| Celebracao media-alta | Flash + particulas + bounce para marcos de mentor | Should Have |
| Celebracao HERO | Takeover do painel com fogos dourados | Should Have |
| Celebracao pivot | Animacao "recalcular rota" com tom positivo | Should Have |
| Fila de celebracoes | Sequenciamento para celebracoes simultaneas | Should Have |
| Estado "aguardando" | Card pulsante para submissao a mentor | Should Have |
| Estado "HERO" | Visual dourado permanente | Should Have |
| Painel admin | Pause/resume, override, log | Should Have |
| Performance 60fps | Otimizacao para LED e longa duracao | Must Have (Fase 3) |
