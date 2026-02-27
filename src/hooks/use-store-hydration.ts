"use client";

import { useEffect } from "react";
import { usePanelStore } from "@/stores/panel-store";

/**
 * Triggers Zustand persist rehydration on the client after initial render.
 * This prevents hydration mismatches caused by localStorage state differing
 * from the server-rendered initial state.
 *
 * Call this once in the root client component (e.g. JourneyBoard, AdminDashboard).
 */
export function useStoreHydration() {
  useEffect(() => {
    usePanelStore.persist.rehydrate();
  }, []);
}
