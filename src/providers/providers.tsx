"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
