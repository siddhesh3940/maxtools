"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={{ "data-cfasync": "false" }}
    >
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
