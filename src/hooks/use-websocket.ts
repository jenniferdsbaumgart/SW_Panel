"use client";

import { useEffect, useRef } from "react";
import { WebSocketClient } from "@/lib/ws-client";
import { dispatchToStore } from "@/lib/event-parser";
import { usePanelStore } from "@/stores/panel-store";

/**
 * Hook que instancia o WebSocketClient, conecta ao store, e faz cleanup no unmount.
 * Usa getState() para evitar problemas de SSR com getServerSnapshot.
 */
export function useWebSocket() {
  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      usePanelStore.getState().setConnectionStatus("disconnected");
      return;
    }

    const client = new WebSocketClient({
      url: wsUrl,
      onMessage: (message) => {
        dispatchToStore(message);
      },
      onStatusChange: (status) => {
        const store = usePanelStore.getState();
        store.setConnectionStatus(status);
        if (status === "connected") {
          store.resetReconnectAttempts();
        } else if (status === "reconnecting") {
          store.incrementReconnectAttempts();
        }
      },
    });

    client.connect();
    clientRef.current = client;

    return () => {
      client.destroy();
      clientRef.current = null;
    };
  }, []);

  return clientRef;
}
