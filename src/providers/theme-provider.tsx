"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  return {
    theme: (theme ?? "system") as "dark" | "light" | "system",
    setTheme: setTheme as (theme: "dark" | "light" | "system") => void,
    resolvedTheme: (resolvedTheme ?? "light") as "dark" | "light",
  }
}
