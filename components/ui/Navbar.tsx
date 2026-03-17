"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants";
import Image from "next/image";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: t("apartments"), href: "/apartments" },
    { label: t("about"), href: "/#about" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between whitespace-nowrap px-6 lg:px-12 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
            : "bg-transparent border-b border-slate-200/20"
        }`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/shengjinLogo.png"
            alt="Shëngjin Stay"
            width={200}
            height={100}
            className="h-12 w-auto"
          />
          <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
            Shëngjin Stay
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-widest uppercase text-slate-900 hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-6">
          <LanguageSwitcher />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-[100px] cursor-pointer items-center justify-center h-11 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold uppercase tracking-widest transition-colors rounded-none">
            {t("bookNow")}
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden p-2 text-slate-900"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 no-underline"
              onClick={() => setMobileOpen(false)}>
              <Image
                src="/shengjinLogo.png"
                alt="Shëngjin Stay"
                width={200}
                height={100}
                className="h-12 w-auto"
              />
              <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                Shëngjin Stay
              </span>
            </Link>
            <button
              className="p-2 text-slate-900"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-8 text-center mt-16 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-3xl font-bold uppercase tracking-wider text-slate-900 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="h-px w-16 bg-slate-200 mx-auto my-2" />
            <LanguageSwitcher />
          </div>

          {/* Book Now */}
          <div className="mt-auto px-6 pb-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full cursor-pointer items-center justify-center h-14 bg-primary hover:bg-primary/90 text-white text-sm font-bold uppercase tracking-widest transition-colors rounded-none"
              onClick={() => setMobileOpen(false)}>
              {t("bookNow")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
