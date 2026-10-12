"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

type LandingTheme = "light" | "dark";

const THEME_KEY = "savemymoney-landing-theme";
const THEME_CHANGE_EVENT = "savemymoney-landing-theme-change";
let volatileTheme: LandingTheme | null = null;
const LandingThemeContext = createContext<{
  theme: LandingTheme;
  toggleTheme: () => void;
} | null>(null);

function readTheme(): LandingTheme {
  try {
    const savedTheme = window.localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  } catch {
    return volatileTheme ?? "light";
  }

  return volatileTheme ?? "light";
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getServerTheme(): LandingTheme {
  return "light";
}

export function useLandingTheme() {
  const context = useContext(LandingThemeContext);

  if (!context) {
    throw new Error("useLandingTheme must be used inside LandingThemeProvider");
  }

  return context;
}

export default function LandingThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, getServerTheme);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    volatileTheme = nextTheme;

    try {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Keep theme switching available when the browser blocks storage.
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, [theme]);

  return (
    <LandingThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="landing-shell" data-theme={theme}>
        {children}
      </div>
    </LandingThemeContext.Provider>
  );
}
