# WebSocket Architecture - SW Painel

## Visao Geral

O SW Painel e um cliente WebSocket que conecta ao endpoint `/ws/journey` do sistema Gerencial. Comunicacao unidirecional: server envia, client recebe. Reconexao automatica com exponential backoff.

## Classe WebSocketClient

```typescript
// src/lib/ws-client.ts

interface WebSocketClientConfig {
  url: string;
  onMessage: (event: WebSocketMessage) => void;
  onStatusChange: (status: ConnectionStatus) => void;
  initialRetryMs?: number;    // default: 2000
  maxRetryMs?: number;         // default: 30000
  backoffMultiplier?: number;  // default: 2
  inactivityTimeoutMs?: number; // default: 60000
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private retryCount = 0;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;
  private inactivityTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  constructor(private config: WebSocketClientConfig) {}

  connect(): void;
  disconnect(): void;
  destroy(): void;

  private handleOpen(): void;
  private handleMessage(event: MessageEvent): void;
  private handleClose(): void;
  private handleError(): void;
  private scheduleReconnect(): void;
  private getRetryDelay(): number;
  private resetInactivityTimer(): void;
}
```

## Hook useWebSocket

```typescript
// src/hooks/use-websocket.ts

export function useWebSocket() {
  const store = usePanelStore();
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error('NEXT_PUBLIC_WS_URL not defined');
      return;
    }

    const client = new WebSocketClient({
      url: wsUrl,
      onMessage: (message) => dispatchToStore(message, store),
      onStatusChange: (status) => store.setConnectionStatus(status),
    });

    client.connect();
    clientRef.current = client;

    return () => {
      client.destroy();
    };
  }, []);

  return clientRef;
}
```

## Dispatch de Eventos para o Store

```typescript
// src/lib/event-parser.ts

function parseWebSocketMessage(data: string): WebSocketMessage | null {
  try {
    const parsed = JSON.parse(data);

    // Validar que tem campo 'type'
    if (!parsed || typeof parsed.type !== 'string') {
      console.warn('WS message without type:', parsed);
      return null;
    }

    // Validar tipo conhecido
    const validTypes = [
      'stage_update', 'waiting', 'celebration',
      'pivot', 'hero', 'sync', 'panel_control'
    ];

    if (!validTypes.includes(parsed.type)) {
      console.warn('Unknown WS message type:', parsed.type);
      return null;
    }

    return parsed as WebSocketMessage;
  } catch (e) {
    console.error('Failed to parse WS message:', e);
    return null;
  }
}

// Dispatch para o store baseado no tipo
function dispatchToStore(message: WebSocketMessage, store: PanelStore): void {
  // Log do evento (para admin)
  store.logEvent(message);

  switch (message.type) {
    case 'sync':
      store.handleSync(message.teams);
      break;
    case 'stage_update':
      store.handleStageUpdate(message);
      break;
    case 'waiting':
      store.handleWaiting(message);
      break;
    case 'pivot':
      store.handlePivot(message);
      break;
    case 'hero':
      store.handleHero(message);
      break;
    case 'celebration':
      store.handleCelebration(message);
      break;
    case 'panel_control':
      store.handlePanelControl(message);
      break;
  }
}
```

## Reconexao com Exponential Backoff

```
Tentativa  Delay   Total acumulado
    1       2s         2s
    2       4s         6s
    3       8s        14s
    4      16s        30s
    5      30s        60s  (max atingido)
    6      30s        90s
    ...    30s        ...
```

### Implementacao

```typescript
private getRetryDelay(): number {
  const delay = Math.min(
    this.config.initialRetryMs * Math.pow(this.config.backoffMultiplier, this.retryCount),
    this.config.maxRetryMs
  );
  // Jitter: +/- 20% para evitar thundering herd
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

private scheduleReconnect(): void {
  if (this.isDestroyed) return;

  this.config.onStatusChange('reconnecting');
  const delay = this.getRetryDelay();
  this.retryCount++;

  console.log(`WS reconnecting in ${delay}ms (attempt ${this.retryCount})`);

  this.retryTimeout = setTimeout(() => {
    this.connect();
  }, delay);
}
```

## Heartbeat / Inactivity Detection

O protocolo WebSocket gerencia ping/pong automaticamente. Porem, para detectar conexoes "mortas" (onde o TCP nao fecha graciosamente), implementamos um timeout de inatividade:

```typescript
private resetInactivityTimer(): void {
  if (this.inactivityTimeout) {
    clearTimeout(this.inactivityTimeout);
  }

  this.inactivityTimeout = setTimeout(() => {
    console.warn('WS inactivity timeout - forcing reconnect');
    this.ws?.close();
    // handleClose() sera chamado, que chama scheduleReconnect()
  }, this.config.inactivityTimeoutMs); // 60s default
}
```

O timer e resetado a cada mensagem recebida. Se nenhuma mensagem chega em 60 segundos, assumimos conexao morta e forcamos reconexao.

**Nota:** 60 segundos e conservador. Em um SW, pode haver periodos longos sem eventos (equipes trabalhando). Se isso causar reconexoes falsas, aumentar para 5 minutos.

## Indicador Visual de Status

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                     TRILHA DO PAINEL                        │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│ (o) Connected                                               │
└─────────────────────────────────────────────────────────────┘

(o) = dot pequeno no canto inferior esquerdo

Cores:
- Verde: Connected
- Amarelo pulsante: Connecting / Reconnecting
- Vermelho: Disconnected (> 30s)
```

O indicador e propositalmente minimo. A audiencia a 10-15m nao deve nota-lo. Staff proximo ao LED consegue ver.

## Diagrama de Estados da Conexao

```
                    ┌──────────────┐
        start ──>   │  connecting  │
                    └──────┬───────┘
                           |
                    onopen |
                           v
                    ┌──────────────┐
             ┌───── │  connected   │ <─────┐
             │      └──────┬───────┘       │
             │             |               │
             │  onclose/   |               │ onopen
             │  onerror    |               │ (+ sync recebido)
             │             v               │
             │      ┌──────────────┐       │
             │      │ reconnecting │ ──────┘
             │      └──────┬───────┘
             │             |
             │    max      | backoff timeout
             │   retries   |
             │             v
             │      ┌──────────────┐
             └───>  │ disconnected │ (apos muitas falhas)
                    └──────────────┘
```

**Nota:** Na pratica, nunca paramos de tentar reconectar. O estado `disconnected` e visual (indica que esta offline ha muito tempo), mas as tentativas continuam com 30s de intervalo indefinidamente.

## Seguranca

- **Sem autenticacao no WebSocket**: O painel e display-only em rede local. Nao envia dados sensiveis.
- **Validacao de mensagens**: Toda mensagem e parseada e validada antes de despachar. Mensagens invalidas sao ignoradas com log.
- **Sem dados sensiveis**: O estado contem apenas nomes de equipes, cores, e URLs de imagens. Nao ha PII.

## Consideracoes de Performance

1. **Volume baixo**: Maximo ~15 equipes, poucas transicoes por hora. O WebSocket nao e gargalo.
2. **Parsing**: JSON.parse e negligivel para payloads pequenos (< 1KB por mensagem).
3. **Store updates**: Zustand atualiza synchronously. A latencia evento -> render e dominada pela animacao, nao pelo estado.
4. **Target**: Latencia evento -> inicio da animacao < 100ms. Latencia total (com animacao) < 500ms.
