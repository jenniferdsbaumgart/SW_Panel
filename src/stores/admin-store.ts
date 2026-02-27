import { create } from "zustand";

interface AdminStore {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const SESSION_KEY = "sw-admin-auth";

function getInitialAuth(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export const useAdminStore = create<AdminStore>()((set) => ({
  isAuthenticated: getInitialAuth(),

  login: (password: string) => {
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!expected) return false;

    if (password === expected) {
      sessionStorage.setItem(SESSION_KEY, "true");
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false });
  },
}));
