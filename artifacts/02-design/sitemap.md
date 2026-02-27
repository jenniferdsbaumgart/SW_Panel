# Sitemap -- SW Painel

## Arquitetura de Informação

```
SW Painel
│
├── / (Display Público)
│   │
│   ├── Estado: Loading
│   │   └── Tela de "Conectando..." (pré-sync)
│   │
│   ├── Estado: Empty
│   │   └── Trilha visível, sem equipes, "Aguardando equipes..."
│   │
│   ├── Estado: Active (Happy Path)
│   │   ├── Header (nome do evento + indicador WS)
│   │   ├── Trilha Serpentina
│   │   │   ├── Fileira Superior: ZERO → IDEIA → PROBLEMA → VALIDAÇÃO
│   │   │   ├── Curva Central
│   │   │   └── Fileira Inferior: HERO ← PITCH ← SOL.VALIDADA ← MVP
│   │   ├── Cards das Equipes (por etapa)
│   │   ├── Background (blobs orgânicos)
│   │   └── Overlay de Celebrações
│   │
│   ├── Estado: Paused
│   │   └── Idêntico ao Active + indicador discreto "⏸"
│   │
│   └── Estado: Disconnected
│       └── Último estado visível + indicador discreto de reconexão
│
├── /admin (Painel Administrativo)
│   │
│   ├── /admin/login
│   │   └── Formulário de senha simples
│   │
│   └── /admin (autenticado)
│       ├── Header (logo + status WS + logout)
│       ├── Controles
│       │   ├── Botão Pausar/Retomar
│       │   ├── Botão Reset
│       │   └── Indicador de fila de celebrações
│       ├── Tabela de Equipes
│       │   ├── Nome, etapa atual, estado visual
│       │   ├── Ação: Disparar celebração (modal)
│       │   └── Ação: Override de etapa (modal)
│       └── Log de Eventos
│           └── Lista cronológica de eventos WebSocket
│
└── (WebSocket /ws/journey)
    └── Conexão com o Gerencial (não é rota, é conexão)
```

## Rotas Next.js (App Router)

| Rota | Tipo | Layout | Descrição |
|------|------|--------|-----------|
| `/` | Display | `/(display)/layout.tsx` | Painel público fullscreen para LED |
| `/admin` | Admin | `/(admin)/layout.tsx` | Dashboard administrativo |
| `/admin/login` | Admin | `/(admin)/layout.tsx` | Login com senha |

**Route Groups sugeridos:**
- `/(display)/page.tsx` -- painel público
- `/(admin)/page.tsx` -- redirect para login ou dashboard
- `/(admin)/login/page.tsx` -- tela de login
- `/(admin)/dashboard/page.tsx` -- dashboard admin (pós-login)
