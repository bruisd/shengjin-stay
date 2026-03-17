"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const t = useTranslations("contact");

  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? t("error"));
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setErrorMsg(t("error"));
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b border-slate-300 focus:outline-none focus:border-primary text-xl px-0 py-3 placeholder:text-slate-300 transition-colors";

  const contactItems = [
    {
      label: t("location"),
      value: "Shëngjin 4503, Albania",
      href: undefined as string | undefined,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      label: t("emailUs"),
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: t("callWhatsapp"),
      value: CONTACT_PHONE,
      href: `tel:${CONTACT_PHONE}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center py-20 px-6 lg:px-12 w-full max-w-[1440px] mx-auto pt-28">
      <div className="w-full">
        <h1 className="font-display text-[48px] md:text-[72px] font-bold leading-none tracking-tighter uppercase max-w-4xl text-slate-900">
          {t("title")}
        </h1>

        <div className="flex flex-col lg:flex-row gap-20 w-full mt-16">
          {/* Left: Form */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {t("name")}
                </label>
                <input
                  id="name" type="text" required aria-required="true" autoComplete="name"
                  placeholder={t("namePlaceholder")} value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {t("email")}
                </label>
                <input
                  id="email" type="email" required aria-required="true" autoComplete="email"
                  placeholder={t("emailPlaceholder")} value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {t("message")}
                </label>
                <textarea
                  id="message" required aria-required="true" rows={4}
                  placeholder={t("messagePlaceholder")} value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === "success" && (
                <p role="status" className="text-primary font-medium">{t("success")}</p>
              )}
              {status === "error" && (
                <p role="alert" className="text-red-500 font-medium">{errorMsg || t("error")}</p>
              )}

              <div>
                <button
                  type="submit" disabled={status === "loading"} aria-busy={status === "loading"}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-base font-bold h-14 px-10 uppercase tracking-widest rounded-none inline-flex items-center gap-3 transition-colors"
                >
                  {status === "loading" ? t("sending") : t("send")}
                  {status !== "loading" && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Contact info */}
          <div className="flex-1 lg:pl-10 lg:border-l border-slate-100 flex flex-col gap-10">
            {contactItems.map((item) => (
              <div key={item.label} className="flex gap-6 items-start">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900 mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-slate-500 hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-slate-500">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
