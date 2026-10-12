"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLandingTheme } from "../LandingThemeProvider";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#howItWorks", label: "Product" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonial", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme } = useLandingTheme();
  const ThemeIcon = theme === "light" ? Moon : Sun;
  const themeAction = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  useEffect(() => {
    if (!mobileNavOpen) return;

    const body = document.body;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileNavOpen(false);
      menuButtonRef.current?.focus();
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileNavOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileNavOpen]);

  return (
    <header className="landing-nav sticky top-0 z-50 border-b landing-border">
      <nav
        aria-label="Main navigation"
        className="landing-container relative z-20 mx-auto flex h-[76px] items-center justify-between gap-4 backdrop-blur-xl"
      >
        <Link
          href="/"
          aria-label="SaveMyMoney home"
          className="landing-brand flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileNavOpen(false)}
        >
          <span className="landing-logo-mark flex size-10 items-center justify-center rounded-[14px]">
            <Bot className="size-6" strokeWidth={2.25} />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.04em] sm:text-lg">
            SaveMy<span className="landing-accent-text">Money</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="landing-nav-link text-[13px] font-medium">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeAction}
            title={themeAction}
            className="landing-theme-toggle flex size-10 items-center justify-center rounded-full border landing-border"
          >
            <ThemeIcon className="size-[17px]" />
          </button>
          <Link href="/sign-in" className="landing-nav-login hidden text-[13px] font-semibold md:inline-flex">
            Sign in
          </Link>
          <Link href="/sign-up" className="hidden md:block">
            <Button className="landing-button h-10 rounded-full px-5 text-[13px] font-semibold">
              Get started <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
            ref={menuButtonRef}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-primary-navigation"
            className="landing-theme-toggle flex size-10 items-center justify-center rounded-full border landing-border md:hidden"
          >
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileNavOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="landing-mobile-backdrop fixed inset-0 z-10 md:hidden"
            style={{
              backgroundColor: theme === "light" ? "rgba(9, 39, 22, 0.15)" : "rgba(0, 8, 5, 0.48)",
              backdropFilter: "blur(9px) saturate(0.85)",
              WebkitBackdropFilter: "blur(9px) saturate(0.85)",
            }}
          />
          <div
            id="mobile-primary-navigation"
            className="landing-mobile-menu absolute inset-x-0 top-full z-20 max-h-[calc(100dvh-76px)] overflow-y-auto border-t landing-border px-5 py-4 shadow-2xl md:hidden"
          >
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="landing-nav-link rounded-xl px-3 py-3 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3 border-t landing-border pt-4">
              <Link href="/sign-in" onClick={() => setMobileNavOpen(false)}>
                <Button variant="outline" className="landing-outline-button h-11 w-full rounded-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setMobileNavOpen(false)}>
                <Button className="landing-button h-11 w-full rounded-full">Get started</Button>
              </Link>
            </div>
          </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
