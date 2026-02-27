# Wireframe: Painel Admin (/admin)

## Contexto

O admin é uma interface funcional para o Staff do SW. Não precisa da identidade visual do painel público (sem blobs, sem animações elaboradas). Usa a paleta violeta mas com foco em legibilidade e usabilidade em tela de notebook/tablet.

Rota: `/admin`
Autenticação: Senha simples (variável de ambiente)

---

## Tela de Login

### Estado: Success

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│              ┌────────────────────────┐              │
│              │                        │              │
│              │    SW PAINEL ADMIN     │              │
│              │                        │              │
│              │  ┌──────────────────┐  │              │
│              │  │ Senha            │  │              │
│              │  │ **************** │  │              │
│              │  └──────────────────┘  │              │
│              │                        │              │
│              │  ┌──────────────────┐  │              │
│              │  │     ENTRAR       │  │              │
│              │  └──────────────────┘  │              │
│              │                        │              │
│              └────────────────────────┘              │
│                                                      │
└──────────────────────────────────────────────────────┘

- Fundo: #0F0A1A
- Card central: #1A1128, border 1px #5B21B6, radius 16px
- Título: Montserrat Bold 24px, branco
- Input: fundo #0F0A1A, borda #5B21B6, texto branco
- Botão: fundo #7C3AED, texto branco, hover #8B5CF6
```

### Estado: Error (Senha Incorreta)

```
┌────────────────────────┐
│    SW PAINEL ADMIN     │
│                        │
│  ┌──────────────────┐  │
│  │ Senha            │  │  ← Borda vermelha #EF4444
│  │ **************** │  │
│  └──────────────────┘  │
│  ✕ Senha incorreta     │  ← Texto #EF4444, Inter 14px
│                        │
│  ┌──────────────────┐  │
│  │     ENTRAR       │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

## Dashboard Admin

### Estado: Success (Happy Path)

```
┌──────────────────────────────────────────────────────────────────┐
│  SW PAINEL ADMIN              [ws: ● Conectado]   [Sair]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Controles ────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  [⏸ Pausar Painel]    [↻ Reset]    Fila: 2 celebrações   │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Equipes (12) ────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ Equipe          │ Etapa         │ Estado   │ Ações   │ │ │
│  │  ├──────────────────────────────────────────────────────┤ │ │
│  │  │ ● Team Alpha    │ MVP (4)       │ Ativa    │ [▶][↺] │ │ │
│  │  │ ● Team Beta     │ VALIDAÇÃO (3) │ Aguard.  │ [▶][↺] │ │ │
│  │  │ ● Team Gamma    │ PROBLEMA (2)  │ Ativa    │ [▶][↺] │ │ │
│  │  │ ★ Team Omega    │ HERO (7)      │ HERO     │ [▶]    │ │ │
│  │  │ ● Team Delta    │ IDEIA (1)     │ Pivotada │ [▶][↺] │ │ │
│  │  │ ● Team Epsilon  │ MVP (4)       │ Ativa    │ [▶][↺] │ │ │
│  │  │ ● Team Zeta     │ SOL.VALID.(5) │ Celebr.  │ [▶][↺] │ │ │
│  │  │ ● Team Eta      │ ZERO (0)      │ Ativa    │ [▶][↺] │ │ │
│  │  │ ● Team Theta    │ PITCH (6)     │ Aguard.  │ [▶][↺] │ │ │
│  │  │ ● Team Iota     │ PROBLEMA (2)  │ Ativa    │ [▶][↺] │ │ │
│  │  │ ● Team Kappa    │ VALIDAÇÃO (3) │ Ativa    │ [▶][↺] │ │ │
│  │  │ ● Team Lambda   │ IDEIA (1)     │ Ativa    │ [▶][↺] │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Log de Eventos (últimos 20) ──────────────────────────────┐ │
│  │                                                            │ │
│  │  14:32:15 ● stage_update  Team Zeta      MVP→SOL.VALID.  │ │
│  │  14:31:02 ● waiting       Team Theta     PITCH           │ │
│  │  14:28:44 ● stage_update  Team Alpha     VALID.→MVP      │ │
│  │  14:25:11 ● pivot         Team Delta     PROB.→IDEIA     │ │
│  │  14:22:30 ● hero          Team Omega     PITCH→HERO      │ │
│  │  14:20:15 ● sync          12 equipes carregadas          │ │
│  │  ...                                                      │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Anatomia dos Elementos

**Header:**
- Logo "SW PAINEL ADMIN" -- Montserrat Bold 20px, branco
- Status WebSocket: indicador ● verde + "Conectado" / ○ vermelho + "Desconectado"
- Botão "Sair" -- texto, sem fundo

**Controles:**
- Card com fundo #1A1128, borda #5B21B6
- Botão "Pausar Painel": fundo #7C3AED, texto branco. Quando pausado, muda para "▶ Retomar" com fundo #BFFF00 e texto #0F0A1A
- Botão "Reset": fundo transparente, borda #EF4444, texto #EF4444 (ação destrutiva)
- Contagem da fila: badge numérico em #BFFF00

**Tabela de Equipes:**
- Fundo: #1A1128
- Header: #2D1F4E, Inter Semibold 14px
- Rows: alternando #1A1128 / #0F0A1A
- ● (dot): cor da equipe (team_color)
- ★: dourado para HERO
- Coluna "Estado": badge colorido
  - Ativa: badge violeta #7C3AED
  - Aguardando: badge verde-limão #BFFF00, texto escuro
  - Celebrando: badge branco, texto escuro
  - Pivotada: badge indigo #818CF8
  - HERO: badge dourado #FFD700, texto escuro
- Coluna "Ações":
  - [▶] Disparar celebração (abre modal de seleção de tipo)
  - [↺] Override de etapa (abre modal para selecionar etapa)

**Log de Eventos:**
- Fundo: #0F0A1A (mais escuro, estilo terminal)
- Font: JetBrains Mono 13px
- Timestamp: #C4B5FD (lilás)
- Tipo de evento: cores por tipo
  - stage_update: #22C55E (verde)
  - waiting: #BFFF00 (limão)
  - pivot: #818CF8 (indigo)
  - hero: #FFD700 (dourado)
  - sync: #C4B5FD (lilás)
  - panel_control: #FFFFFF (branco)
  - error: #EF4444 (vermelho)
- Auto-scroll para o mais recente
- Máximo 100 entradas visíveis

---

### Modal: Disparar Celebração

```
┌────────────────────────────────┐
│  Disparar Celebração           │
│  Equipe: Team Alpha            │
│                                │
│  Tipo:                         │
│  ○ Leve (~2s)                  │
│  ○ Média (~3s)                 │
│  ● Média-Alta (~5s)            │
│  ○ HERO/Máxima (~8s)           │
│  ○ Pivot (~3s)                 │
│                                │
│  [Cancelar]     [Disparar]     │
└────────────────────────────────┘

- Modal: fundo #1A1128, borda #5B21B6, radius 16px
- Overlay: #0F0A1A com 60% opacidade
- Radio buttons com cor #7C3AED
- Botão "Disparar": #7C3AED, texto branco
- Botão "Cancelar": transparente, texto #C4B5FD
```

### Modal: Override de Etapa

```
┌────────────────────────────────┐
│  Override de Etapa             │
│  Equipe: Team Alpha            │
│  Etapa atual: VALIDAÇÃO (3)    │
│                                │
│  Nova etapa:                   │
│  ┌──────────────────────────┐  │
│  │ MVP (4)              ▼  │  │
│  └──────────────────────────┘  │
│                                │
│  ⚠ Isso moverá a equipe       │
│  diretamente para a nova etapa │
│  sem disparar celebração.      │
│                                │
│  [Cancelar]    [Confirmar]     │
└────────────────────────────────┘

- Select com todas as 8 etapas
- Aviso em texto #BFFF00 (atenção)
- Botão "Confirmar": #7C3AED
```

---

### Estado: Loading

```
┌──────────────────────────────────────────────────────────────────┐
│  SW PAINEL ADMIN              [ws: ◌ Conectando...]   [Sair]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Controles ────────────────────────────────────────────────┐ │
│  │  ░░░░░░░░░░░░░░░░   ░░░░░░░░   Fila: --                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Equipes (--) ────────────────────────────────────────────┐ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │ │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │ │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Log de Eventos ───────────────────────────────────────────┐ │
│  │  Aguardando conexão WebSocket...                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

- Skeleton shimmer em cinza #2D1F4E
- Indicador de conexão pulsando
- Contadores mostram "--"
```

### Estado: Empty (Conectado, 0 equipes)

```
┌─ Equipes (0) ────────────────────────────────────────────────┐
│                                                                │
│              Nenhuma equipe registrada.                        │
│              Aguardando evento sync do Gerencial.             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Estado: Error (Desconectado)

```
┌──────────────────────────────────────────────────────────────────┐
│  SW PAINEL ADMIN              [ws: ✕ Desconectado]   [Sair]     │
│                                                                  │
│  ┌─ ⚠ Conexão Perdida ───────────────────────────────────────┐ │
│  │                                                            │ │
│  │  WebSocket desconectado. Tentando reconectar...           │ │
│  │  Tentativa 4 de ∞ -- próxima em 8s                       │ │
│  │                                                            │ │
│  │  [Reconectar Agora]                                       │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  (tabela e log mostram último estado conhecido)                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

- Banner de aviso: fundo #2D1F1A (tom alaranjado escuro), borda #EF4444
- Botão "Reconectar Agora": borda #EF4444, texto #EF4444
- Dados existentes permanecem visíveis (não limpar)
```

### Estado: Paused

```
┌─ Controles ────────────────────────────────────────────────────┐
│                                                                  │
│  [▶ Retomar Painel]    [↻ Reset]    ⏸ PAUSADO    Fila: 5      │
│                                                                  │
│  ⚠ Painel pausado. 5 eventos acumulados na fila.               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

- Botão muda de "⏸ Pausar" para "▶ Retomar" (fundo #BFFF00, texto #0F0A1A)
- Badge "PAUSADO" em vermelho #EF4444
- Aviso amarelo sobre eventos acumulados
- Fila mostra contagem real
```
