"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/providers/theme-provider"
import { UserButton } from "@clerk/nextjs"
import {
  LayoutDashboard, FileText, Wand2, Printer, Image,
  Sun, Moon, Menu, X, ChevronDown, ChevronRight, Box,
  Zap, FileDown, Combine, RefreshCw, PenLine, Lock, Layers
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PDF_TOOLS, CONVERSION_TOOLS } from "@/lib/constants"
import * as React from "react"

interface SidebarCategory {
  label: string
  icon: React.ComponentType<{ className?: string }>
  tools: readonly { name: string; slug: string; description: string }[]
  getPath: (slug: string) => string
}

const categories: SidebarCategory[] = [
  {
    label: "Power Tools", icon: Zap,
    tools: [
      { name: "Booklet Optimizer", slug: "booklet-optimizer", description: "Optimize booklets for printing" },
      { name: "Smart Print Mode", slug: "smart-print", description: "Intelligent print layout optimization" },
      { name: "Workflow Builder", slug: "workflow-builder", description: "Build automated workflows" },
      { name: "Batch Processing", slug: "batch-processing", description: "Process multiple files at once" },
    ],
    getPath: (slug) => slug === "workflow-builder" ? "/workflow" : slug === "batch-processing" ? "/batch" : `/print/${slug}`,
  },
  {
    label: "Compress", icon: FileDown,
    tools: PDF_TOOLS.filter(t => t.category === 'COMPRESS'),
    getPath: (slug) => `/pdf/${slug}`,
  },
  {
    label: "Merge & Split", icon: Combine,
    tools: PDF_TOOLS.filter(t => t.category === 'MERGE_SPLIT'),
    getPath: (slug) => `/pdf/${slug}`,
  },
  {
    label: "Convert", icon: RefreshCw,
    tools: CONVERSION_TOOLS,
    getPath: (slug) => `/convert/${slug}`,
  },
  {
    label: "Edit & Sign", icon: PenLine,
    tools: PDF_TOOLS.filter(t => t.category === 'EDIT_SIGN'),
    getPath: (slug) => `/pdf/${slug}`,
  },
  {
    label: "Security", icon: Lock,
    tools: PDF_TOOLS.filter(t => t.category === 'SECURITY'),
    getPath: (slug) => `/pdf/${slug}`,
  },
  {
    label: "Organize", icon: Layers,
    tools: PDF_TOOLS.filter(t => t.category === 'ORGANIZE'),
    getPath: (slug) => `/pdf/${slug}`,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const toggleCategory = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  // Auto-expand active category
  React.useEffect(() => {
    for (const cat of categories) {
      for (const tool of cat.tools) {
        if (pathname === cat.getPath(tool.slug)) {
          setExpanded((prev) => ({ ...prev, [cat.label]: true }))
        }
      }
    }
  }, [pathname])

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transform transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            <span className="font-bold">MaxTools</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="px-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              Dashboard
            </Link>

            {categories.map((cat) => {
              return (
                <div key={cat.label}>
                  <button
                    onClick={() => toggleCategory(cat.label)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <cat.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{cat.label}</span>
                    {expanded[cat.label] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </button>
                  {expanded[cat.label] && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l pl-2">
                      {cat.tools.map((tool) => {
                        const toolPath = cat.getPath(tool.slug)
                        const isToolActive = pathname === toolPath
                        return (
                          <Link
                            key={tool.slug}
                            href={toolPath}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors",
                              isToolActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <span className="h-1 w-1 rounded-full bg-current shrink-0" />
                            {tool.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
