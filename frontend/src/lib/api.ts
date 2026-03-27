function normalizeApiBase(raw: string): string {
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

/**
 * When unset, use same-origin `/api` so the Next.js dev server can proxy to the Express
 * backend (see `next.config.ts` rewrites). Avoids ERR_CONNECTION_REFUSED when the browser
 * targets `localhost:4000` while only Next is running.
 * Set `NEXT_PUBLIC_API_URL` to a full URL in production if the API is on another host.
 */
const envApi = process.env.NEXT_PUBLIC_API_URL;
const API_BASE =
  envApi != null && envApi.trim() !== "" ? normalizeApiBase(envApi) : "/api";

export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${clean}`;
}

export async function apiJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(data.error ?? data.message ?? "Request failed");
  }

  return (await response.json()) as T;
}
