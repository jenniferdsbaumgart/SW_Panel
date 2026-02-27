"use client";

import { useState, type FormEvent } from "react";
import { useAdminStore } from "@/stores/admin-store";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const login = useAdminStore((s) => s.login);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(false);

    const success = login(password);
    if (!success) {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-violet-dark bg-night-light p-8"
      >
        <h2 className="mb-6 text-center font-[family-name:var(--font-display)] text-[length:var(--text-admin-h1)] font-bold text-white">
          SW PAINEL ADMIN
        </h2>

        <div className="mb-4">
          <label
            htmlFor="admin-password"
            className="mb-1 block font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-lilac"
          >
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            autoFocus
            className={`w-full rounded-lg border bg-night px-4 py-2.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] text-white placeholder-lilac/50 outline-none transition-colors focus:border-violet-light ${
              error ? "border-red-500" : "border-violet-dark"
            }`}
            placeholder="Digite a senha de acesso"
          />
          {error && (
            <p className="mt-1.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-small)] text-red-500">
              Senha incorreta
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!password}
          className="w-full rounded-lg bg-violet py-2.5 font-[family-name:var(--font-body)] text-[length:var(--text-admin-body)] font-semibold text-white transition-colors hover:bg-violet-light disabled:opacity-50"
        >
          ENTRAR
        </button>
      </form>
    </div>
  );
}
