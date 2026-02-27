# ADR-005: Reconexao e Resiliencia

## Status

Accepted

## Contexto

O SW Painel opera por 54 horas continuas em rede local de evento. Desconexoes WebSocket sao provaveis (rede instavel, Gerencial reiniciando, etc.). O painel NUNCA deve mostrar tela em branco. A reconexao deve ser transparente para a audiencia.

## Decisao

Implementar reconexao com exponential backoff, preservacao de estado visual durante desconexao, e reconstrucao via evento `sync` apos reconexao.

## Estrategia

### 1. Exponential Backoff

```
Tentativa 1: 2 segundos
Tentativa 2: 4 segundos
Tentativa 3: 8 segundos
Tentativa 4: 16 segundos
Tentativa 5+: 30 segundos (max)
```

Apos reconexao bem-sucedida, o contador reseta para 0.

### 2. Preservacao Visual

Durante desconexao:
- O ultimo estado renderizado PERMANECE visivel (nunca limpar tela)
- Indicador discreto de "Reconectando..." aparece (visivel apenas para staff proximo ao LED)
- Animacoes em progresso completam normalmente
- Nenhuma celebracao nova e disparada (nao ha dados)

### 3. Reconstrucao de Estado

Apos reconexao:
1. Conexao WebSocket estabelecida
2. Gerencial envia evento `sync` automaticamente
3. SW Painel substitui estado em memoria pelo `sync`
4. Transicao visual suave (sem flash, sem reload)
5. Se houve mudancas durante desconexao, os cards movem suavemente para posicoes atualizadas (via Framer Motion layout animation)

### 4. Indicador de Status de Conexao

| Status | Visual |
|--------|--------|
| `connected` | Nenhum indicador (estado normal) |
| `connecting` | Dot pulsante no canto inferior esquerdo (amarelo) |
| `reconnecting` | Dot pulsante no canto inferior esquerdo (vermelho) |
| `disconnected` (> 30s) | Badge discreto "Offline" no canto inferior esquerdo |

O indicador e propositalmente discreto -- visivel para staff proximo ao LED, invisivel para audiencia a 10-15m.

### 5. Heartbeat

O protocolo WebSocket gerencia ping/pong nativamente. O cliente detecta desconexao quando:
- `onclose` e disparado
- `onerror` e disparado
- Timeout de inatividade (sem mensagens por 60 segundos) -> forcar reconexao

### 6. Eventos Perdidos

Eventos que chegam durante desconexao sao PERDIDOS pelo cliente. Isso e aceitavel porque:
- O evento `sync` apos reconexao traz o estado completo atualizado
- Celebracoes perdidas nao sao reconstruidas (decisao consciente -- melhor do que disparar celebracoes atrasadas fora de contexto)

## Fluxo

```
Estado Normal                     Desconexao
     |                                 |
     v                                 v
[connected]                    [disconnected]
     |                                 |
     v                                 v
Recebe eventos                 Preserva ultimo estado
Processa normalmente           Indicador discreto
     |                                 |
     v                                 v
                              Exponential backoff
                                 2s, 4s, 8s...
                                       |
                                       v
                              [reconnecting]
                                       |
                                       v
                              Conexao estabelecida
                                       |
                                       v
                              Recebe `sync`
                                       |
                                       v
                              Atualiza estado
                              Transicao suave
                                       |
                                       v
                              [connected]
```

## Consequencias

### Positivas

- Painel nunca fica em branco
- Reconexao automatica e transparente
- Estado sempre consistente apos reconexao

### Negativas

- Celebracoes durante desconexao sao perdidas
- Indicador de status pode nao ser visivel o suficiente para staff

### Riscos

- Desconexao prolongada (> 5 min): audiencia vera estado stale. Mitigacao: admin pode forcar reset.
- `sync` com dados inconsistentes do Gerencial: nao ha como validar no cliente. Confiamos no Gerencial.
