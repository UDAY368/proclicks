"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/lib/api";
import { setAdminToken } from "@/admin/auth";

type LoginResponse = {
  token: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("user@111");
  const [password, setPassword] = useState("Admin@111");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const data = await apiJson<LoginResponse>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setAdminToken(data.token);
      router.push("/admin/dashboard/analytics");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050506] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-black/55 p-7 shadow-[0_40px_140px_rgba(0,0,0,0.75)] backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-white/45">
          Internal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-white">
          Admin Login
        </h1>
        <p className="mt-3 text-sm text-white/55">
          Sign in to access analytics and leads.
        </p>

        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
              Username
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
              Password
            </span>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-[#ff4d7a]/35 bg-[#1a0b10] px-3 py-2 text-sm text-[#ffd6e1]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
