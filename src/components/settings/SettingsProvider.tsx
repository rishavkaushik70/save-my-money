"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppearanceMode = "light" | "dark" | "system";

export type PersonalSettings = {
  appearance: AppearanceMode;
  monthlyExpenseAlerts: boolean;
  goalReminders: boolean;
  monthlyExpenseLimit: number;
};

type SettingsContextValue = {
  settings: PersonalSettings;
  updateSettings: (patch: Partial<PersonalSettings>) => void;
  avatarImage: string | null;
  avatarCustomized: boolean;
  setAvatarImage: (image: string | null) => boolean;
};

const DEFAULT_SETTINGS: PersonalSettings = {
  appearance: "system",
  monthlyExpenseAlerts: true,
  goalReminders: true,
  monthlyExpenseLimit: 100_000,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);
const REMOVED_AVATAR = "__savemymoney_avatar_removed__";

function parseSettings(raw: string | null): PersonalSettings {
  if (!raw) return DEFAULT_SETTINGS;

  try {
    const value = JSON.parse(raw) as Partial<PersonalSettings>;
    const appearance = ["light", "dark", "system"].includes(
      value.appearance ?? "",
    )
      ? (value.appearance as AppearanceMode)
      : DEFAULT_SETTINGS.appearance;
    const monthlyExpenseLimit = Number(value.monthlyExpenseLimit);

    return {
      appearance,
      monthlyExpenseAlerts:
        typeof value.monthlyExpenseAlerts === "boolean"
          ? value.monthlyExpenseAlerts
          : DEFAULT_SETTINGS.monthlyExpenseAlerts,
      goalReminders:
        typeof value.goalReminders === "boolean"
          ? value.goalReminders
          : DEFAULT_SETTINGS.goalReminders,
      monthlyExpenseLimit:
        Number.isFinite(monthlyExpenseLimit) && monthlyExpenseLimit >= 5_000
          ? Math.min(monthlyExpenseLimit, 100_000_000)
          : DEFAULT_SETTINGS.monthlyExpenseLimit,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applyAppearance(appearance: AppearanceMode) {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDark =
    appearance === "dark" || (appearance === "system" && systemPrefersDark);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
  document.documentElement.dataset.dashboardTheme = isDark ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function SettingsProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const storageKey = `savemymoney-settings:${userId}`;
  const avatarKey = `savemymoney-avatar:${userId}`;
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [avatarState, setAvatarState] = useState<{
    customized: boolean;
    image: string | null;
  }>({ customized: false, image: null });
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        setSettings(parseSettings(window.localStorage.getItem(storageKey)));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
      try {
        const storedAvatar = window.localStorage.getItem(avatarKey);
        setAvatarState(
          storedAvatar === null
            ? { customized: false, image: null }
            : {
                customized: true,
                image: storedAvatar === REMOVED_AVATAR ? null : storedAvatar,
              },
        );
      } catch {
        setAvatarState({ customized: false, image: null });
      }
      setHydratedKey(storageKey);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [avatarKey, storageKey]);

  useEffect(() => {
    if (hydratedKey !== storageKey) return;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      // Keep the preference active in this session if storage is unavailable.
    }

    applyAppearance(settings.appearance);

    if (settings.appearance !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => applyAppearance("system");
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [hydratedKey, settings, storageKey]);

  const updateSettings = useCallback((patch: Partial<PersonalSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const setAvatarImage = useCallback(
    (image: string | null) => {
      try {
        window.localStorage.setItem(avatarKey, image ?? REMOVED_AVATAR);
      } catch {
        return false;
      }
      setAvatarState({ customized: true, image });
      return true;
    },
    [avatarKey],
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      avatarImage: avatarState.image,
      avatarCustomized: avatarState.customized,
      setAvatarImage,
    }),
    [settings, updateSettings, avatarState, setAvatarImage],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function usePersonalSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "usePersonalSettings must be used inside a SettingsProvider.",
    );
  }
  return context;
}
