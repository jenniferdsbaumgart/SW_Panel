# Decisoes em Aberto - SW Painel

## Resumo

Este documento lista as decisoes tecnicas e de produto que precisam ser tomadas antes ou durante o desenvolvimento. Cada decisao inclui contexto, opcoes e recomendacao do Product Strategist quando aplicavel.

---

### DEC-01: Biblioteca de Animacao -- Framer Motion vs GSAP

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Alto (core do produto) |
| Responsavel | Architect / Frontend Developer |
| Deadline | Antes do inicio da Fase 1 |

**Contexto:** O SW Painel depende pesadamente de animacoes. A escolha da biblioteca afeta performance, complexidade e capacidade de criar os 4 niveis de celebracao.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Framer Motion | Integracao nativa com React/Next.js; API declarativa; AnimatePresence; layout animations | Pode ser limitado para celebracoes complexas (particulas, fogos); performance em animacoes pesadas |
| GSAP | Performance superior para animacoes complexas; controle granular de timeline; plugins para particulas | Nao e React-native; requer refs e imperative API; licenca comercial pode ser necessaria |
| Hibrido (Framer Motion + Canvas/WebGL para celebracoes) | Melhor dos dois mundos | Mais complexidade; duas APIs de animacao |

**Recomendacao:** Framer Motion como base (transicoes de cards, estados visuais) + Canvas/WebGL isolado apenas para celebracoes pesadas (HERO). Avaliar se Framer Motion sozinho atende na Fase 1 antes de adicionar complexidade.

---

### DEC-02: Layout da Trilha -- Linear Horizontal vs Serpentina vs Board Game

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Alto (UX e identidade visual) |
| Responsavel | UX/UI Designer |
| Deadline | Antes do inicio da Fase 1 |

**Contexto:** A trilha "From Zero to Hero" precisa exibir 8 etapas com 8-15 equipes. A proporcao 1:2 (2m altura x 4m largura) favorece layouts horizontais.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Linear horizontal | Simples; intuitivo; facil de implementar | Pode nao ser visualmente engajante; desperdiça area vertical |
| Serpentina (zig-zag) | Uso melhor do espaco vertical; visual de board game | Mais complexo; direcao de leitura pode confundir |
| Board game (caminho curvo) | Visual mais rico; feeling de jogo | Implementacao mais complexa; posicionamento de cards mais dificil |

**Recomendacao:** Decisao para o UX/UI Designer. A proporcao 1:2 sugere que um layout que use a altura (serpentina ou caminho) seria mais aproveitado. Para MVP, linear horizontal e seguro.

---

### DEC-03: Gerenciamento de Estado -- React Context vs Zustand vs Jotai

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Medio (arquitetura interna) |
| Responsavel | Architect |
| Deadline | Antes do inicio da Fase 1 |

**Contexto:** O estado in-memory (teams, celebration queue, connection status) precisa ser acessivel por varios componentes e atualizado em tempo real via WebSocket.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| React Context + useReducer | Nativo; sem dependencia | Re-renders excessivos com state grande; nao otimizado para updates frequentes |
| Zustand | Leve; API simples; bom para updates frequentes; selectors | Dependencia externa (minima) |
| Jotai | Atomic; bom para updates granulares; React-idiomatic | Curva de aprendizado; menos adequado para state tree grande |

**Recomendacao:** Zustand. E leve, performatico para updates frequentes via WebSocket, e permite selectors para evitar re-renders desnecessarios.

---

### DEC-04: Estrategia de Celebracoes Pesadas (Particulas, Fogos)

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Alto (celebracao HERO e key feature) |
| Responsavel | Frontend Developer |
| Deadline | Antes do inicio da Fase 2 |

**Contexto:** A celebracao HERO (takeover do painel, fogos dourados, ~8s) e o momento mais importante do produto. Precisa ser visualmente espetacular e rodar a 60fps.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| CSS Animations puro | Simples; sem dependencia | Limitado para particulas/fogos |
| Canvas 2D overlay | Bom para particulas; performance OK | Precisa implementar sistema de particulas |
| WebGL (Three.js / PixiJS) | Performance maxima; efeitos ricos | Complexidade alta; dependencia pesada |
| Biblioteca de particulas (tsParticles) | Pronto para uso; configuravel | Dependencia; pode nao ter exatamente o efeito desejado |
| Lottie animations | Visual profissional; pre-renderizado | Precisa de designer para criar as animacoes |

**Recomendacao:** tsParticles ou Canvas 2D para Fase 2. Avaliar Lottie se houver designer disponivel. WebGL somente se os outros nao atingirem 60fps com o efeito desejado.

---

### DEC-05: Som nas Celebracoes

| Campo | Valor |
|-------|-------|
| Status | Em aberto (Fase 3) |
| Impacto | Medio (experiencia emocional) |
| Responsavel | Product Strategist + Frontend Developer |
| Deadline | Fase 3 |

**Contexto:** Sons podem amplificar o impacto emocional das celebracoes. Porem, o painel e exibido em auditorio com atividade constante.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Sem som | Simples; sem conflito com audio do evento | Perde oportunidade emocional |
| Sons opcionais (toggle no admin) | Flexivel; controlavel pelo staff | Requer biblioteca de audio; latencia |
| Sons integrados ao sistema de som do evento | Maximo impacto | Complexidade de integracao; depende do hardware |

**Recomendacao:** Sons opcionais (toggle no admin) na Fase 3. Usar Web Audio API para baixa latencia.

---

### DEC-06: Como Exibir Multiplas Equipes na Mesma Etapa

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Alto (layout core) |
| Responsavel | UX/UI Designer |
| Deadline | Antes do inicio da Fase 1 |

**Contexto:** Nas etapas iniciais (ZERO, IDEIA), muitas equipes estarao concentradas. E preciso decidir como organiza-las visualmente.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Empilhamento vertical | Simples; usa espaco vertical da proporcao 1:2 | Pode ficar apertado com 10+ equipes na mesma etapa |
| Grid dentro da etapa | Melhor distribuicao | Mais complexo; tamanho do card varia |
| Cards sobrepostos (stack) | Economiza espaco; visual interessante | Dificulta leitura individual |
| Redimensionamento adaptativo | Todos visiveis; tamanho ajusta automaticamente | Cards ficam pequenos se muitos na mesma etapa |

**Recomendacao:** Redimensionamento adaptativo com tamanho minimo garantido para legibilidade a 10m. Se exceder capacidade, usar scroll suave ou paginacao temporal.

---

### DEC-07: Estrutura de Rotas -- Painel e Admin

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Baixo (organizacao interna) |
| Responsavel | Architect |
| Deadline | Antes do inicio da Fase 1 |

**Contexto:** O SW Painel tem duas interfaces: o display publico (LED) e o admin (staff). Precisam coexistir na mesma aplicacao Next.js.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| `/` (painel) + `/admin` (admin) | Simples; mesma aplicacao | Risco de alguem acessar admin no LED |
| Aplicacoes separadas | Isolamento total | Mais complexidade de deploy; duplicacao de codigo |
| Route groups: `/(display)` + `/(admin)` | Next.js idiomatic; layouts separados | Mais diretórios |

**Recomendacao:** Route groups do Next.js App Router: `/(display)` para o painel LED e `/(admin)` para o staff. Mesma aplicacao, layouts independentes.

---

### DEC-08: Autenticacao do Admin

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Baixo (seguranca basica) |
| Responsavel | Architect |
| Deadline | Antes do inicio da Fase 2 |

**Contexto:** O admin permite override de celebracoes, pause/resume. Precisa de alguma protecao, mas e usado em rede local durante evento.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Sem autenticacao | Mais simples | Qualquer pessoa na rede pode acessar |
| Senha simples (env var) | Minimo de protecao; facil de configurar | Nao e seguranca real |
| Token JWT basico | Mais robusto | Overkill para o cenario |

**Recomendacao:** Senha simples via variavel de ambiente (`ADMIN_PASSWORD`). Tela de login basica no `/admin`. Suficiente para rede local de evento.

---

### DEC-09: Tipografia -- Como Carregar Montserrat Black + Inter

| Campo | Valor |
|-------|-------|
| Status | Em aberto |
| Impacto | Baixo (performance de carregamento) |
| Responsavel | Frontend Developer |
| Deadline | Fase 1 |

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Google Fonts (CDN) | Facil; sem config | Depende de internet (problema em rede local) |
| next/font (local) | Otimizado; sem internet | Precisa baixar os arquivos |
| Self-hosted em /public | Controle total | Config manual de @font-face |

**Recomendacao:** `next/font` com fontes locais. Garante funcionamento sem internet e otimizacao automatica do Next.js.

---

### DEC-10: Testes de Resiliencia (54h)

| Campo | Valor |
|-------|-------|
| Status | Em aberto (Fase 3) |
| Impacto | Alto (confiabilidade) |
| Responsavel | QA Tester |
| Deadline | Antes do deploy final |

**Contexto:** O painel precisa rodar 54h sem degradacao. Testes de longa duracao sao necessarios mas demorados.

**Opcoes:**

| Opcao | Pros | Contras |
|-------|------|---------|
| Teste manual de 54h | Realista | Impraticavel |
| Teste automatizado com eventos simulados (acelerado) | Viavel; cobre memory leaks e performance | Nao captura todos os cenarios reais |
| Teste de 4-8h em ambiente real | Bom equilibrio | Nao e 54h completas |

**Recomendacao:** Teste automatizado acelerado (simular 54h de eventos em 2-4h) + teste manual de 4-8h em ambiente similar ao evento.
