# ADR-001: WebSocket vs SSE para Comunicacao em Tempo Real

## Status

Accepted

## Contexto

O SW Painel recebe eventos em tempo real do sistema Gerencial via endpoint `/ws/journey`. O contrato ja define WebSocket como protocolo. A questao e se SSE (Server-Sent Events) seria mais adequado, dado que a comunicacao e predominantemente unidirecional (server -> client).

## Opcoes Consideradas

### Opcao A: WebSocket (RFC 6455)

- Bidirecional por natureza
- Protocolo ja definido no contrato do Gerencial
- Suporte a ping/pong nativo para heartbeat
- Reconexao precisa ser implementada manualmente

### Opcao B: SSE (Server-Sent Events)

- Unidirecional por design (server -> client)
- Reconexao automatica nativa no browser
- Mais simples para o caso de uso
- Requer que o Gerencial exponha endpoint SSE (nao expoe)

### Opcao C: WebSocket com canal bidirecional

- Permite que o admin envie comandos de volta ao Gerencial
- Mais complexo, mas abre possibilidades futuras

## Decisao

**WebSocket (Opcao A)** -- unidirecional, client-only.

## Justificativa

1. **O Gerencial ja expoe `/ws/journey` como WebSocket.** Nao ha endpoint SSE disponivel. Mudar o protocolo exigiria alteracoes no sistema Gerencial, que esta fora do nosso escopo.

2. **Bidirecionalidade nao e necessaria agora.** O painel e display-only. O admin local pode controlar o painel via estado local (Zustand) sem enviar mensagens de volta ao Gerencial. O evento `panel_control` vem DO Gerencial, nao do painel.

3. **Volume e baixissimo.** Maximo 15 equipes, poucas transicoes por hora. WebSocket nao traz overhead significativo para este volume.

4. **Reconexao manual e aceitavel.** Com exponential backoff e evento `sync`, a reconexao e simples de implementar e ja esta especificada no contrato.

## Consequencias

### Positivas

- Zero alteracao no sistema Gerencial
- Contrato ja definido e documentado
- Heartbeat via ping/pong nativo do WebSocket

### Negativas

- Reconexao precisa ser implementada manualmente (SSE teria auto-reconnect)
- WebSocket e ligeiramente mais complexo que SSE para uso unidirecional

### Riscos

- Se a rede local do evento for instavel, reconexoes frequentes podem causar micro-interrupcoes. Mitigacao: manter ultimo estado renderizado durante reconexao.
