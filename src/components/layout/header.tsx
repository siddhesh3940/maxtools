"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Box, ChevronDown, Menu, X, Sun, Moon, Combine, FileType, Image, Wand2, Printer, Workflow, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const tools = [
  { href: "/dashboard/pdf", label: "PDF Tools", icon: Combine },
  { href: "/dashboard/convert", label: "File Conversion", icon: FileType },
  { href: "/dashboard/image", label: "Image Tools", icon: Image },
  { href: "/dashboard/ai", label: "AI Tools", icon: Wand2 },
  { href: "/dashboard/print", label: "Print Production", icon: Printer },
  { href: "/dashboard/workflow", label: "Workflow Builder", icon: Workflow },
]

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [toolsOpen, setToolsOpen] = React.useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const toolsRef = React.useRef<HTMLDivElement>(null)
  const toolsTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Box className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">MaxTools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <div
            ref={toolsRef}
            className="relative"
            onMouseEnter={() => {
              clearTimeout(toolsTimeoutRef.current)
              setToolsOpen(true)
            }}
            onMouseLeave={() => {
              toolsTimeoutRef.current = setTimeout(() => setToolsOpen(false), 150)
            }}
          >
            <Button
              variant="ghost"
              className="gap-1 text-sm font-medium"
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              Tools
              <ChevronDown className={cn("h-4 w-4 transition-transform", toolsOpen && "rotate-180")} />
            </Button>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-xl"
                >
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <tool.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {tool.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm font-medium",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="text-sm font-medium">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-background border-l shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-lg">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 space-y-1">
                <div className="mb-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Tools
                  </p>
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                    >
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                      {tool.label}
                    </Link>
                  ))}
                </div>
                <SeparatorBlock />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t mt-auto">
                <div className="sm:hidden flex flex-col gap-2">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full text-sm font-medium">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full text-sm font-medium">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-center">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function SeparatorBlock() {
  return <div className="my-2 h-px bg-border" />
}
