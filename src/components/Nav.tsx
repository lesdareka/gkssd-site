"use client";

import { NAV_CTA_LABEL, NAV_LINKS } from "@/lib/scene";

type NavProps = {
  solid: boolean;
};

/**
 * Fixed, minimal nav. Logo left, links + one primary CTA right.
 * Transparent (white ink) over the opening scene; crossfades to a solid
 * white bar with dark ink once the visitor scrolls past the brand-intro
 * beat. The logo is rendered as two stacked images (default black /
 * inverted-to-white) cross-faded by opacity, since an externally
 * referenced <img src="*.svg"> does not inherit page CSS color the way
 * an inlined SVG would — this keeps the recolor smooth without shipping
 * the full 300+ path logo markup inline.
 */
export default function Nav({ solid }: NavProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-nav flex items-center justify-between px-6 py-5 transition-colors duration-500 ease-out-quart md:px-10 ${
        solid
          ? "border-b border-line bg-bg/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#top" className="relative block h-6 w-auto shrink-0 md:h-7" aria-label="ГКССД — на главную">
        <img
          src="/logo-nav.svg"
          alt="ГКССД"
          className={`h-6 w-auto transition-opacity duration-500 ease-out-quart md:h-7 ${
            solid ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src="/logo-nav.svg"
          alt=""
          aria-hidden
          className={`absolute inset-0 h-6 w-auto brightness-0 invert transition-opacity duration-500 ease-out-quart md:h-7 ${
            solid ? "opacity-0" : "opacity-100"
          }`}
        />
      </a>

      <nav
        className={`hidden items-center gap-9 font-body text-[0.9375rem] tracking-[0.01em] transition-colors duration-500 ease-out-quart md:flex ${
          solid ? "text-ink" : "text-white"
        }`}
        aria-label="Основная навигация"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="opacity-90 transition-opacity duration-300 hover:opacity-100"
          >
            {link.label}
          </a>
        ))}
        <a
          href="mailto:info@gkssd.ru"
          className="rounded-full bg-brand px-5 py-2.5 text-white transition-colors duration-300 ease-out-quart hover:bg-brand-dark"
        >
          {NAV_CTA_LABEL}
        </a>
      </nav>

      <a
        href="mailto:info@gkssd.ru"
        className="rounded-full bg-brand px-4 py-2 font-body text-sm text-white transition-colors duration-300 ease-out-quart hover:bg-brand-dark md:hidden"
      >
        {NAV_CTA_LABEL}
      </a>
    </header>
  );
}
