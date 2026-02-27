# VPC: SW Painel

## Customer Profile

### Jobs

#### Functional

1. Exibir o progresso de todas as equipes em tempo real no painel LED - Importance: High
2. Celebrar publicamente cada avanço com animacoes visuais impactantes - Importance: High
3. Receber eventos automaticamente via WebSocket sem intervencao manual - Importance: High
4. Manter o painel funcionando por 54 horas sem interrupcao - Importance: High
5. Controlar o painel (pause/resume/override) durante momentos especificos - Importance: Medium

#### Social

1. Criar competicao saudavel entre equipes ("eu quero ser o proximo")
2. Demonstrar profissionalismo e inovacao na organizacao do evento
3. Elevar a percepcao de qualidade do Startup Weekend para patrocinadores e mentores

#### Emotional

1. Sentir a emocao coletiva quando o painel "explode" com celebracao
2. Sentir confianca de que o sistema nao vai falhar durante o evento
3. Sentir orgulho ao ver a jornada "From Zero to Hero" ganhar vida visual

### Pains

1. Post-its em backdrop fisico sao estaticos e desperdicam potencial emocional - Severity: 5
2. Momentos de avanço (aprovacao de mentor) passam despercebidos - Severity: 5
3. Nao ha gamificacao nem tensao competitiva entre equipes - Severity: 4
4. Audiencia nao consegue acompanhar o progresso de todas as equipes - Severity: 4
5. Organizadores gastam tempo comunicando status em vez de apoiando equipes - Severity: 3
6. Risco de queda de sistema durante evento presencial - Severity: 5
7. Celebracoes sobrepostas quando varias equipes avancam ao mesmo tempo - Severity: 3

### Gains

1. Cada avanço se transforma em momento visual memoravel para o auditorio - Relevance: 5
2. Tensao e competicao saudavel entre equipes ("quero ser o proximo") - Relevance: 5
3. Zero intervencao manual no painel durante o evento - Relevance: 4
4. Celebracoes graduais (4 niveis) que escalam com a importancia do marco - Relevance: 5
5. Funcionamento confiavel por 54 horas continuas - Relevance: 5
6. Painel legivel a 10-15 metros no LED de 2x4m - Relevance: 4
7. Momento HERO espetacular que marca o auditorio inteiro - Relevance: 5

## Value Map

### Products & Services

- Painel fullscreen proporcao 1:2 para LED 2x4m
- Trilha board game com 8 etapas "From Zero to Hero"
- Cards visuais de equipes com imagens geradas pelo n8n
- 4 niveis de celebracao visual (leve, media-alta, maxima, pivot)
- Fila sequencial de celebracoes (zero celebracoes perdidas)
- 5 estados visuais dos cards (ativa, aguardando, celebrando, pivotada, HERO)
- Conexao WebSocket em tempo real com /ws/journey
- Painel admin para staff (pause/resume, override, log)

### Pain Relievers

| Pain | How We Address It |
|------|-------------------|
| Post-its estaticos | Painel digital ao vivo com animacoes e estados visuais dinamicos |
| Momentos de avanço desperdicados | 4 niveis de celebracao automaticos, incluindo takeover do painel para HERO |
| Sem gamificacao | Trilha board game visivel para todos cria tensao e competicao natural |
| Audiencia nao acompanha | LED de 2x4m com legibilidade a 10-15m, 8-15 equipes simultaneas |
| Organizadores perdem tempo | WebSocket automatico, zero intervencao no painel publico |
| Risco de queda | Reconexao automatica < 5s, estado em memoria com fallback |
| Celebracoes sobrepostas | Fila sequencial garante que cada celebracao recebe atencao individual |

### Gain Creators

| Gain | How We Deliver It |
|------|-------------------|
| Momento visual memoravel | Celebracoes com particulas, flash, bounce, fogos dourados (HERO) |
| Tensao competitiva | Trilha board game onde todos veem quem esta avancando |
| Zero intervencao | Fluxo automatico: Sofia -> n8n -> WebSocket -> SW Painel |
| Celebracoes graduais | 4 niveis calibrados: leve (2s), media-alta (5s), maxima (8s), pivot (3s) |
| Funcionamento 54h | Estado in-memory, reconexao automatica, sync de estado completo |
| Legibilidade LED | Montserrat Black + Inter, contraste alto, proporcao 1:2 otimizada |
| Momento HERO | Takeover do painel inteiro por 8s com fogos dourados e nome gigante |

## Fit Analysis

O SW Painel resolve o problema central: transformar avanços invisiveis em momentos visuais memoraveis. O fit e forte porque:

1. **Dor clara e nao resolvida**: Post-its em backdrop fisico sao o unico "concorrente" e sao dramaticamente inferiores.
2. **Norte emocional poderoso**: O briefing define com precisao a experiencia desejada -- o painel "explode" e todo mundo olha.
3. **Integracao natural**: O fluxo Sofia -> n8n -> WebSocket elimina intervencao humana no painel.
4. **Gamificacao emergente**: A mera visualizacao da trilha com todas as equipes cria competicao saudavel automaticamente.

| Customer Need | Your Solution | Fit Score |
|---------------|---------------|-----------|
| Celebrar avanços publicamente | 4 niveis de celebracao visual | Verde |
| Competicao entre equipes | Trilha board game visivel para todos | Verde |
| Zero intervencao no painel | WebSocket automatico | Verde |
| Legibilidade a distancia | LED 2x4m + tipografia otimizada | Verde |
| Funcionamento 54h | In-memory + reconexao + sync | Verde |
| Momento HERO inesquecivel | Takeover do painel com fogos dourados | Verde |
| Controle pelo staff | Admin com pause/resume/override | Verde |
