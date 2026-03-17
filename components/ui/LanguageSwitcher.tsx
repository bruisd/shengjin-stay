"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next as "en" | "sq" });
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm font-semibold tracking-widest uppercase">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={
          locale === "en"
            ? "font-bold text-slate-900"
            : "text-slate-500 hover:text-primary transition-colors"
        }
      >
        EN
      </button>
      <span className="text-slate-300">/</span>
      <button
        onClick={() => switchLocale("sq")}
        disabled={isPending}
        className={
          locale === "sq"
            ? "font-bold text-slate-900"
            : "text-slate-500 hover:text-primary transition-colors"
        }
      >
        SQ
      </button>
    </div>
  );
}
