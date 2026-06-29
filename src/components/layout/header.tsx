"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "@/providers/theme-provider"
import { Sun, Moon, ChevronDown, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
]

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-white" />
            </div>
            MaxTools
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm transition-colors ${
                    active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {link.label === "Tools" && <ChevronDown className="inline h-3 w-3 ml-0.5" />}
                  {active && <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-4 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950 transition-colors"
          >
            <Coffee className="h-3.5 w-3.5" />
            Buy me a coffee
          </a>
          <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
          </Button>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="text-sm">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
