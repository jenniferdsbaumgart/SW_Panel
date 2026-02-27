# User Flows -- SW Painel

## Flow 1: Audiência Observa o Painel (Passivo)

**Persona:** Rafael (Participante) / Patrícia (Mentora)
**Trigger:** Painel LED ligado no auditório

```
[Painel liga]
     │
     ▼
[Tela Loading: "Conectando..."]
     │
     ▼
[WebSocket conecta] ──── falha ──→ [Retry com backoff] ──→ [Conecta]
     │
     ▼
[Recebe evento sync]
     │
     ▼
[Trilha renderiza com equipes nas posições]
     │
     ├────────── equipe avança ───────────→ [Celebração dispara (2-8s)]
     │                                              │
     │                                              ▼
     │                                     [Card move para nova etapa]
     │                                              │
     │                                              ▼
     │                                     [Celebração termina, trilha normal]
     │
     ├────────── equipe aguarda mentor ───→ [Card pulsa em verde-limão]
     │                                              │
     │                                              ▼
     │                                     [Mentor aprova] → [Celebração]
     │
     ├────────── equipe pivota ───────────→ [Animação "recalcular rota" (3s)]
     │                                              │
     │                                              ▼
     │                                     [Card move para etapa anterior]
     │                                     [Badge de pivot permanece]
     │
     └────────── equipe vira HERO ────────→ [TAKEOVER DO PAINEL (8s)]
                                                    │
                                                    ▼
                                           ["HERO!" + fogos dourados]
                                                    │
                                                    ▼
                                           [Card dourado permanente na trilha]
```

---

## Flow 2: Staff Opera o Admin

**Persona:** Luciana (Staff SW)
**Trigger:** Precisa monitorar ou intervir no painel

```
[Abre /admin no notebook]
     │
     ▼
[Tela de Login]
     │
     ▼
[Digita senha] ──── errada ──→ [Mensagem erro, tenta novamente]
     │
     ▼ correta
[Dashboard Admin]
     │
     ├─── Monitorar ──→ [Vê tabela de equipes + status WS + fila]
     │                        │
     │                        └──→ [Eventos aparecem no log em tempo real]
     │
     ├─── Pausar ──→ [Clica "Pausar Painel"]
     │                    │
     │                    ▼
     │              [Painel congela, eventos acumulam na fila]
     │                    │
     │                    ▼
     │              [Clica "Retomar"] → [Eventos processados sequencialmente]
     │
     ├─── Override Celebração ──→ [Clica ▶ na linha da equipe]
     │                                  │
     │                                  ▼
     │                           [Modal: seleciona tipo de celebração]
     │                                  │
     │                                  ▼
     │                           [Clica "Disparar"] → [Celebração no painel]
     │
     ├─── Override Etapa ──→ [Clica ↺ na linha da equipe]
     │                             │
     │                             ▼
     │                       [Modal: seleciona nova etapa]
     │                             │
     │                             ▼
     │                       [Clica "Confirmar"] → [Card move sem celebração]
     │
     └─── Reset ──→ [Clica "Reset"]
                          │
                          ▼
                    [Confirmação? Sim/Não]
                          │ Sim
                          ▼
                    [Painel limpa + solicita novo sync]
```

---

## Flow 3: Reconexão Automática (Sistema)

**Persona:** Sistema (SW Painel)
**Trigger:** Conexão WebSocket cai

```
[WebSocket desconecta]
     │
     ▼
[Status: DISCONNECTED]
     │
     ├──→ [Último estado permanece visível no LED] (NUNCA limpar tela)
     │
     ▼
[Tentativa 1: retry em 2s]
     │
     ├── sucesso ──→ [Status: CONNECTED] → [Solicita sync] → [Atualiza estado]
     │
     └── falha ──→ [Tentativa 2: retry em 4s]
                        │
                        ├── sucesso ──→ [sync + atualiza]
                        │
                        └── falha ──→ [Tentativa 3: retry em 8s]
                                          │
                                          └── ... (backoff até max 30s)

Após 30s desconectado:
     │
     ▼
[Indicador discreto aparece no canto inferior esquerdo]
[Visível apenas a < 3m (staff próximo)]
[Audiência a 10-15m não percebe]

Quando reconecta:
     │
     ▼
[Recebe sync]
     │
     ▼
[Transição suave do estado antigo para o novo]
[Sem flash, sem reload, sem limpar tela]
[Indicador de reconexão desaparece]
```

---

## Flow 4: Fila de Celebrações (Sistema)

**Trigger:** Múltiplas equipes avançam em sequência rápida

```
[Evento 1: Team Alpha avança (medium_high)]
     │
     ▼
[Celebração Alpha inicia (5s)]
     │
     ├── [Evento 2 chega: Team Beta avança (light)]
     │        │
     │        ▼
     │   [Beta enfileirado: posição 1 na fila]
     │
     ├── [Evento 3 chega: Team Omega → HERO (max)]
     │        │
     │        ▼
     │   [Omega HERO tem PRIORIDADE: pula para frente]
     │   [Fila: [Omega HERO, Beta light]]
     │
     ▼
[Celebração Alpha termina]
     │
     ▼
[Pausa 500ms entre celebrações]
     │
     ▼
[Celebração Omega HERO inicia (8s)] ← prioridade máxima
     │
     ▼
[Celebração Omega termina]
     │
     ▼
[Pausa 500ms]
     │
     ▼
[Celebração Beta inicia (2s)]
     │
     ▼
[Fila vazia. Trilha no estado normal.]

NOTA: O estado em memória é SEMPRE atualizado imediatamente.
Apenas a animação visual é enfileirada.
Alpha, Beta e Omega já estão nas posições corretas em memória
desde o momento do evento. A animação é "cosmética".
```

---

## Flow 5: Carga Inicial com localStorage (Fallback)

**Trigger:** Navegador do LED é recarregado (F5)

```
[Página carrega]
     │
     ├── [Tem localStorage?]
     │        │
     │        ├── Sim ──→ [Carrega estado do localStorage]
     │        │                │
     │        │                ▼
     │        │           [Renderiza trilha com dados antigos]
     │        │           [Mostra "Reconectando..." discreto]
     │        │
     │        └── Não ──→ [Tela Loading: "Conectando..."]
     │
     ▼
[WebSocket conecta]
     │
     ▼
[Recebe sync]
     │
     ▼
[Substitui estado (localStorage ou vazio) pelo sync]
     │
     ▼
[Transição suave para estado atualizado]
[Salva novo estado em localStorage]
```
