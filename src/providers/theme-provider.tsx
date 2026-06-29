"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = "theme"
const THEMES: Theme[] = ["dark", "light", "system"]

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return
  const resolved = theme === "system" ? getSystemTheme() : theme
  document.documentElement.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")

  React.useEffect(() => {
    let saved: Theme = "system"
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && THEMES.includes(stored as Theme)) saved = stored as Theme
    } catch {}
    setThemeState(saved)
    applyTheme(saved)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      setThemeState((t) => {
        if (t === "system") applyTheme("system")
        return t
      })
    }
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    try { localStorage.setItem(STORAGE_KEY, newTheme) } catch {}
    applyTheme(newTheme)
  }, [])

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  const value = React.useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const DEFAULT_THEME_VALUE: ThemeContextValue = {
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  return context ?? DEFAULT_THEME_VALUE
}
