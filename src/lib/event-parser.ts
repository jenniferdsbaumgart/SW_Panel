import type { WebSocketMessage, WebSocketMessageType } from "@/types/events";
import { VALID_WS_MESSAGE_TYPES } from "@/lib/constants";
import { usePanelStore } from "@/stores/panel-store";

/**
 * Parseia uma mensagem WebSocket crua (string JSON) e retorna tipada.
 * Retorna null se a mensagem for invalida.
 */
export function parseWebSocketMessage(
  data: string
): WebSocketMessage | null {
  try {
    const parsed: unknown = JSON.parse(data);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const obj = parsed as Record<string, unknown>;

    if (typeof obj.type !== "string") {
      return null;
    }

    const validTypes: readonly string[] = VALID_WS_MESSAGE_TYPES;
    if (!validTypes.includes(obj.type)) {
      return null;
    }

    return parsed as WebSocketMessage;
  } catch {
    return null;
  }
}

/**
 * Tipo guard: verifica se um tipo e valido.
 */
export function isValidMessageType(
  type: string
): type is WebSocketMessageType {
  const validTypes: readonly string[] = VALID_WS_MESSAGE_TYPES;
  return validTypes.includes(type);
}

/**
 * Despacha uma mensagem WebSocket para a action correta do store.
 */
export function dispatchToStore(message: WebSocketMessage): void {
  const store = usePanelStore.getState();

  // Log do evento
  store.logEvent({
    type: message.type,
    ...(message as unknown as Record<string, unknown>),
  });

  switch (message.type) {
    case "sync":
      store.handleSync(message.teams);
      break;
    case "stage_update":
      store.handleStageUpdate(message);
      break;
    case "waiting":
      store.handleWaiting(message);
      break;
    case "pivot":
      store.handlePivot(message);
      break;
    case "hero":
      store.handleHero(message);
      break;
    case "celebration":
      store.handleCelebration(message);
      break;
    case "panel_control":
      store.handlePanelControl(message);
      break;
  }
}
