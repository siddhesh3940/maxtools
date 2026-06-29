"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { UserButton } from "@clerk/nextjs"
import {
  Box, LayoutDashboard, Combine, FileType, Image, Wand2, Printer,
  Workflow, Layers, Menu, X, Sun, Moon, Search, Bell, ChevronDown,
  ChevronLeft, ChevronRight, Split, FileUp, FileDown, FileImage,
  Folders, Shuffle, Scan, Merge
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: "PDF Tools",
    icon: Combine,
    items: [
      { href: "/dashboard/pdf/merge", label: "Merge PDF", icon: Merge },
      { href: "/dashboard/pdf/split", label: "Split PDF", icon: Split },
      { href: "/dashboard/pdf/compress", label: "Compress PDF", icon: FileDown },
      { href: "/dashboard/pdf/convert", label: "PDF to Word", icon: FileUp },
      { href: "/dashboard/pdf/scan", label: "OCR & Scan", icon: Scan },
    ],
  },
  {
    title: "Conversion",
    icon: Shuffle,
    items: [
      { href: "/dashboard/convert/pdf", label: "To PDF", icon: FileType },
      { href: "/dashboard/convert/image", label: "To Image", icon: FileImage },
      { href: "/dashboard/convert/doc", label: "To Document", icon: Folders },
    ],
  },
  {
    title: "Image Tools",
    icon: Image,
    items: [
      { href: "/dashboard/image/resize", label: "Resize", icon: Scan },
      { href: "/dashboard/image/compress", label: "Compress", icon: FileDown },
      { href: "/dashboard/image/convert", label: "Convert Format", icon: FileImage },
    ],
  },
  {
    title: "AI Tools",
    icon: Wand2,
    items: [
      { href: "/dashboard/ai/summarize", label: "Summarize", icon: Split },
      { href: "/dashboard/ai/extract", label: "Extract Data", icon: Scan },
      { href: "/dashboard/ai/translate", label: "Translate", icon: Shuffle },
    ],
  },
  {
    title: "Print Production",
    icon: Printer,
    items: [
      { href: "/dashboard/print/prepress", label: "Prepress Check", icon: Scan },
      { href: "/dashboard/print/color", label: "Color Management", icon: FileImage },
      { href: "/dashboard/print/impose", label: "Imposition", icon: Layers },
    ],
  },
]

const singleLinks: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/workflow", label: "Workflow Builder", icon: Workflow },
  { href: "/dashboard/batch", label: "Batch Processing", icon: Layers },
]

function Sidebar({
  collapsed,
  onToggle,
  onMobileClose,
}: {
  collapsed: boolean
  onToggle: () => void
  onMobileClose?: () => void
}) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    "PDF Tools": true,
  })

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive(href)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Box className="h-6 w-6 text-primary shrink-0" />
            <span className="font-bold">MaxTools</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <Box className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("hidden lg:flex", collapsed && "mx-auto")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-1">
          {singleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onMobileClose}
              className={cn(linkClass(link.href), collapsed && "justify-center px-0")}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}

          {!collapsed && <Separator className="my-2" />}

          {navGroups.map((group) => (
            <div key={group.title}>
              <button
                onClick={() => !collapsed && toggleGroup(group.title)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? group.title : undefined}
              >
                <group.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedGroups[group.title] && "rotate-180"
                      )}
                    />
                  </>
                )}
              </button>
              {!collapsed && (
                <AnimatePresence initial={false}>
                  {expandedGroups[group.title] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 pl-3 border-l space-y-1 py-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 lg:hidden"
            >
              <Sidebar
                collapsed={false}
                onToggle={() => {}}
                onMobileClose={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
