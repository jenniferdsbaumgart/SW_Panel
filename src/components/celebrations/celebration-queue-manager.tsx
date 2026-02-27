"use client";

import { useEffect } from "react";
import { usePanelStore } from "@/stores/panel-store";

/**
 * Headless component (renders null).
 * Watches celebrationQueue and currentCelebration.
 * When currentCelebration is null and queue has items,
 * calls startNextCelebration().
 */
export function CelebrationQueueManager() {
  const queueLength = usePanelStore((s) => s.celebrationQueue.length);
  const hasCurrentCelebration = usePanelStore((s) => s.currentCelebration !== null);

  useEffect(() => {
    if (!hasCurrentCelebration && queueLength > 0) {
      usePanelStore.getState().startNextCelebration();
    }
  }, [hasCurrentCelebration, queueLength]);

  return null;
}
