import { getTranslations } from "next-intl/server";
import { CONTACT_EMAIL } from "@/lib/constants";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-background-dark text-white py-32 px-6 lg:px-20 border-t border-slate-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-5xl lg:text-7xl font-black tracking-tight mb-6">
          {t("cta")}
        </h2>
        <p className="text-slate-400 text-lg mb-12">{t("ctaSub")}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-block text-primary hover:text-white text-2xl lg:text-3xl font-bold border-b-2 border-primary pb-2 hover:border-white transition-colors">
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-32 pt-8 border-t border-slate-800 text-slate-500 text-sm gap-4">
        <span className="font-display font-bold text-white tracking-widest uppercase">
          Shëngjin Stay
        </span>

        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/shengjin_stay?igsh=NGczajN5a3p5MW1z"
            className="hover:text-white transition-colors"
            aria-label="Instagram">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>
        </div>

        <span>© 2026 Shëngjin Stay. {t("rights")}</span>
      </div>
    </footer>
  );
}
