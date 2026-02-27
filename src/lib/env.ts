/**
 * Retorna o valor de uma variavel de ambiente obrigatoria.
 * Lanca erro se a variavel nao estiver definida.
 *
 * NUNCA use fallback string para secrets.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}
