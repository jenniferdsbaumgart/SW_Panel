# Personas - SW Painel

## Persona 1: Audiencia do Evento (Participante)

### Perfil

| Campo | Valor |
|-------|-------|
| Nome | Rafael, 25 anos |
| Papel | Participante de uma equipe no Startup Weekend |
| Background | Desenvolvedor junior, primeira vez no SW |
| Experiencia tecnica | Irrelevante (nao interage com o sistema) |
| Distancia do painel | 5-15 metros (auditorio) |

### Objetivos

1. Ver o progresso da sua equipe reconhecido publicamente no LED de 2x4m
2. Sentir a emocao da celebracao quando sua equipe avanca
3. Saber em que etapa as outras equipes estao (competicao saudavel)
4. Viver o momento "HERO" quando sua equipe completa a jornada

### Frustracoes

1. Avanços da equipe passam despercebidos (ninguem viu, ninguem celebrou)
2. Nao saber como sua equipe se compara as demais
3. Falta de momentos visuais marcantes durante o evento
4. Post-its em backdrop nao criam emocao nenhuma

### Comportamento

- Olha para o painel frequentemente ao longo das 54 horas
- Comenta com colegas quando uma equipe avanca ("olha la, eles avancaram!")
- Se anima quando ve celebracoes -- quer ser o proximo
- Tira fotos/video do painel quando sua equipe celebra

### Citacao

> "Quando o painel EXPLODIU com nossa celebracao, todo mundo no auditorio olhou. Nossa equipe comecou a gritar. As outras equipes ficaram motivadas. Esse e o tipo de momento que faz o SW valer a pena."

### Interacao com SW Painel

**100% passiva.** Observa o LED de 2x4m a 5-15 metros de distancia. Zero interacao direta com a aplicacao.

---

## Persona 2: Staff do Startup Weekend

### Perfil

| Campo | Valor |
|-------|-------|
| Nome | Luciana, 32 anos |
| Papel | Organizadora e facilitadora do Startup Weekend |
| Background | Empreendedora, comunidade de startups |
| Experiencia tecnica | Basica (usa ferramentas web, nao programa) |
| Distancia do painel | Proximo (opera admin) e distante (observa LED) |

### Objetivos

1. Garantir que o painel funcione sem problemas durante as 54 horas
2. Pausar o painel durante intervalos ou pitch no palco
3. Disparar celebracoes manualmente se o WebSocket falhar
4. Monitorar que eventos estao chegando corretamente

### Frustracoes

1. Sistemas que travam durante o evento e ninguem sabe consertar
2. Nao ter controle sobre o que aparece no display
3. Perder tempo com problemas tecnicos em vez de facilitar o evento
4. Celebracao errada ou no momento errado sem como corrigir

### Comportamento

- Acessa o painel admin (`/admin`) no notebook ou celular
- Monitora status da conexao WebSocket
- Pausa o painel durante momentos especificos (intervalo, palestra)
- Usa override apenas em emergencias
- Consulta log de eventos se algo parece errado

### Citacao

> "Preciso de um painel que funcione sozinho 99% do tempo. O admin e so para os 1% de emergencia -- pausar durante o intervalo, disparar celebracao se o WebSocket engasgar."

### Interacao com SW Painel

**Ativa no admin**, **passiva no display.** Usa `/admin` para monitorar e controlar. Observa o LED para confirmar que tudo funciona.

---

## Persona 3: Mentor/Jurado

### Perfil

| Campo | Valor |
|-------|-------|
| Nome | Patricia, 45 anos |
| Papel | Mentora convidada e jurada no Startup Weekend |
| Background | Executiva de inovacao, investidora anjo |
| Experiencia tecnica | Media (usa tecnologia, nao programa) |
| Distancia do painel | 5-15 metros (auditorio e area de mentoria) |

### Objetivos

1. Ter visao geral rapida de quantas equipes existem e em que etapa estao
2. Ver o impacto visual quando aprova uma equipe na Sofia (e o painel celebra)
3. Identificar quais equipes ainda precisam de apoio (etapas iniciais)
4. Acompanhar o resultado final com impacto emocional

### Frustracoes

1. Aprovar uma equipe na Sofia e nao ver resultado visual nenhum
2. Nao saber onde cada equipe esta na jornada ao chegar para mentorar
3. Premiacao sem impacto visual
4. Nao diferenciar visualmente equipes que pivotaram (indica maturidade)

### Comportamento

- Observa o painel ao chegar para ter panorama geral
- Sente satisfacao quando sua aprovacao na Sofia dispara celebracao no LED
- Prioriza mentorias baseado na posicao das equipes na trilha
- Assiste celebracao HERO durante a premiacao

### Citacao

> "Aprovei a equipe na plataforma e dois segundos depois o painel de 2x4m explodiu com animacao. A equipe comecou a comemorar. Isso fez meu papel de mentora ter um impacto visivel e imediato."

### Interacao com SW Painel

**100% passiva.** Observa o LED. Interage apenas com a plataforma Sofia (projeto separado).

---

## Resumo de Personas e Interacao

| Persona | Interacao com SW Painel | Necessidade Principal |
|---------|------------------------|----------------------|
| Rafael (Participante) | Passiva -- observa LED a 5-15m | Celebracao publica e competicao saudavel |
| Luciana (Staff SW) | Ativa no admin + passiva no LED | Confiabilidade e controle em emergencias |
| Patricia (Mentora) | Passiva -- observa LED a 5-15m | Visao geral e impacto visual das aprovacoes |

**Nota:** Nenhuma persona interage diretamente com o display publico. O painel LED e display-only. A unica interacao ativa e do Staff via painel admin (`/admin`).
