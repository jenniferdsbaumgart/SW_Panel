import type { ConnectionStatus } from "@/types/state";
import type { WebSocketMessage } from "@/types/events";
import {
  WS_INITIAL_RETRY_MS,
  WS_MAX_RETRY_MS,
  WS_BACKOFF_MULTIPLIER,
  WS_JITTER_FACTOR,
  WS_INACTIVITY_TIMEOUT_MS,
} from "@/lib/constants";

export interface WebSocketClientConfig {
  url: string;
  onMessage: (event: WebSocketMessage) => void;
  onStatusChange: (status: ConnectionStatus) => void;
  initialRetryMs?: number;
  maxRetryMs?: number;
  backoffMultiplier?: number;
  inactivityTimeoutMs?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private retryCount = 0;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;
  private inactivityTimeout: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  private readonly initialRetryMs: number;
  private readonly maxRetryMs: number;
  private readonly backoffMultiplier: number;
  private readonly inactivityTimeoutMs: number;

  constructor(private config: WebSocketClientConfig) {
    this.initialRetryMs = config.initialRetryMs ?? WS_INITIAL_RETRY_MS;
    this.maxRetryMs = config.maxRetryMs ?? WS_MAX_RETRY_MS;
    this.backoffMultiplier = config.backoffMultiplier ?? WS_BACKOFF_MULTIPLIER;
    this.inactivityTimeoutMs =
      config.inactivityTimeoutMs ?? WS_INACTIVITY_TIMEOUT_MS;
  }

  connect(): void {
    if (this.isDestroyed) return;

    this.config.onStatusChange("connecting");

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event: MessageEvent) =>
        this.handleMessage(event);
      this.ws.onclose = () => this.handleClose();
      this.ws.onerror = () => this.handleError();
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.clearTimers();
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
  }

  destroy(): void {
    this.isDestroyed = true;
    this.disconnect();
    this.config.onStatusChange("disconnected");
  }

  // ----------------------------------------------------------
  // Private handlers
  // ----------------------------------------------------------

  private handleOpen(): void {
    this.retryCount = 0;
    this.config.onStatusChange("connected");
    this.resetInactivityTimer();
  }

  private handleMessage(event: MessageEvent): void {
    this.resetInactivityTimer();

    try {
      const data: unknown = JSON.parse(String(event.data));

      if (
        data &&
        typeof data === "object" &&
        "type" in data &&
        typeof (data as Record<string, unknown>).type === "string"
      ) {
        this.config.onMessage(data as WebSocketMessage);
      }
    } catch {
      // Ignore malformed messages silently
    }
  }

  private handleClose(): void {
    this.ws = null;
    this.clearInactivityTimer();
    if (!this.isDestroyed) {
      this.scheduleReconnect();
    }
  }

  private handleError(): void {
    // onclose will fire after onerror, which handles reconnect
  }

  // ----------------------------------------------------------
  // Reconnection
  // ----------------------------------------------------------

  private scheduleReconnect(): void {
    if (this.isDestroyed) return;

    this.config.onStatusChange("reconnecting");
    const delay = this.getRetryDelay();
    this.retryCount++;

    this.retryTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private getRetryDelay(): number {
    const delay = Math.min(
      this.initialRetryMs *
        Math.pow(this.backoffMultiplier, this.retryCount),
      this.maxRetryMs
    );
    // Jitter: +/- 20% para evitar thundering herd
    const jitter = delay * WS_JITTER_FACTOR * (Math.random() * 2 - 1);
    return Math.round(delay + jitter);
  }

  // ----------------------------------------------------------
  // Inactivity detection
  // ----------------------------------------------------------

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();

    this.inactivityTimeout = setTimeout(() => {
      // Forcar reconexao se nenhuma mensagem chegou
      this.ws?.close();
    }, this.inactivityTimeoutMs);
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  private clearTimers(): void {
    this.clearInactivityTimer();
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }
}
