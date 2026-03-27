"use client";

import { motion } from "framer-motion";
import { ContactArcCarousel } from "./ContactArcCarousel";
import { useMemo, useState } from "react";
import { apiJson } from "@/lib/api";

export function ContactSection({ id = "contact" }: { id?: string }) {
  const services = useMemo(
    () => [
      "Fashion Photography",
      "Product Photography",
      "Social Media Content Creation",
      "Creative Brand Campaigns",
      "Other",
    ],
    [],
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Fashion Photography",
    otherService: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showOther = form.service === "Other";

  const effectiveService =
    form.service === "Other" ? form.otherService.trim() || "Other" : form.service;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiJson<{ message: string }>("/leads", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          company: form.company,
          service: effectiveService,
          message: form.message,
        }),
      });

      const tick = String(Date.now());
      localStorage.setItem("analytics_refresh_tick", tick);
      window.dispatchEvent(new Event("analytics:data-updated"));

      setToast({ message: "Thank you we will get back to you", type: "success" });
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "Fashion Photography",
        otherService: "",
        message: "",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setToast({
        message:
          message === "Request Already Submitted"
            ? "Request Already Submitted"
            : "Unable to submit right now",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      window.setTimeout(() => setToast(null), 2600);
    }
  }

  return (
    <section
      id={id}
      className="relative overflow-x-hidden bg-[#000000] pt-0 pb-32 text-white"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10">
        <header className="mb-6 max-w-2xl sm:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
            Contact
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            Let’s build your next visual story
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            A cinematic arc reel — smooth, premium, and endlessly looping.
          </p>
        </header>
      </div>

      <div className="relative w-full overflow-hidden">
        <ContactArcCarousel heightPx={560} stepDurationSec={2.9} />
      </div>

      {/* Benefits + Form */}
      <div className="mx-auto mt-4 max-w-[1600px] px-5 sm:mt-6 sm:px-8 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left: benefits + contact info */}
          <motion.aside
            className="w-full rounded-[28px] border border-white/10 bg-black/40 p-6 shadow-[0_45px_150px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-white/50 sm:text-[13px]">
              Benefits of working with us
            </p>

            <div className="mt-6 space-y-4">
              {[
                { title: "High quality content", icon: "sparkle" },
                { title: "Increased engagement", icon: "trend" },
                { title: "Post-production services", icon: "wand" },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/35 p-4"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10"
                  >
                    {b.icon === "sparkle" ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2.5l1.3 4.2 4.2 1.3-4.2 1.3L12 13.8l-1.3-4.2L6.5 8l4.2-1.3L12 2.5Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 12.5l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7.7-2.2Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : b.icon === "trend" ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 16l6-6 4 4 6-8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 6v6h-6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 19.5 14.8 9.2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.9 7.3 16.7 11.1"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.8 6.2l.6-1.7.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-white/92 sm:text-[17px]">
                      {b.title}:
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-white/60 sm:text-base">
                      {b.icon === "sparkle"
                        ? "Polished visuals that feel intentional, not generic."
                        : b.icon === "trend"
                          ? "Content designed for reach, retention, and results."
                          : "Editing, color, retouching, and final delivery—done right."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/15 bg-black/35 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent"
              />
              <p className="relative text-[12px] font-semibold uppercase tracking-[0.42em] text-white/55">
                Contact Us
              </p>
              <div className="relative mt-5 space-y-4 text-[16px] font-medium text-white/80">
                <div className="flex items-center justify-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-semibold tracking-wide text-white/85 sm:text-lg">
                    Sai Kumar
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 16.9Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-semibold tracking-wide text-white/85 sm:text-lg">
                    9014612214
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m4 7 7.89 5.26a2 2 0 0 0 2.22 0L20 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="break-all text-base font-semibold tracking-wide text-white/85 sm:text-lg">
                    saikumar.maidam@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Right: form */}
          <motion.div
            className="w-full max-w-[720px] rounded-[28px] border border-white/10 bg-black/55 p-5 shadow-[0_45px_150px_rgba(0,0,0,0.88)] backdrop-blur-xl sm:p-7"
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.34em] text-white/50 sm:text-[13px]">
                Talk With Us
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-normal tracking-tight text-white sm:text-3xl">
                Start our journey
              </h3>
            </div>
            <div
              aria-hidden
              className="hidden h-12 w-12 rounded-full bg-white/5 ring-1 ring-white/10 sm:block"
            />
          </div>

          <form
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={handleSubmit}
          >
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Name <span className="text-red-400">*</span>
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  placeholder="Your full name"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Email <span className="text-red-400">*</span>
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  placeholder="name@company.com"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Phone Number <span className="text-red-400">*</span>
                </span>
                <input
                  required
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  placeholder="+91 XXXXX XXXXX"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Company / Organization
                </span>
                <input
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  placeholder="Brand / Studio"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Select Service <span className="text-red-400">*</span>
                </span>
                <select
                  required
                  value={form.service}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, service: e.target.value }))
                  }
                  className="mt-2 w-full appearance-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10 [&>option]:bg-white [&>option]:text-black"
                >
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-white text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              {showOther ? (
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                    Other (Describe)
                  </span>
                  <input
                    required
                    value={form.otherService}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, otherService: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                    placeholder="Tell us what you need"
                  />
                </label>
              ) : null}

              <label className="block sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                  Message
                </span>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90 placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  placeholder="Share your timeline, deliverables, and vibe…"
                />
              </label>

              <div className="sm:col-span-2 mt-2 flex items-center justify-between gap-4">
                <p className="text-xs text-white/40">
                  We’ll reply within 24 hours.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold tracking-wide text-black shadow-[0_18px_60px_rgba(0,0,0,0.75)] transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {isSubmitting ? "Submitting..." : "Start Our Journey"}
                </button>
              </div>
          </form>
          </motion.div>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[999] -translate-x-1/2">
          <div
            className={`rounded-2xl border px-5 py-3 text-sm font-medium shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl ${
              toast.type === "success"
                ? "border-white/20 bg-black/80 text-white"
                : "border-[#ff4d7a]/40 bg-black/85 text-[#ffd6e1]"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

    </section>
  );
}

