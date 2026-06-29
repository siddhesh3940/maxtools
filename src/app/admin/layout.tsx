"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, FileText, Briefcase, BarChart3,
  DollarSign, CreditCard, ScrollText, ChevronLeft, ChevronRight,
  Settings, Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Files", href: "/admin/files", icon: FileText },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "System Logs", href: "/admin/logs", icon: ScrollText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex h-14 items-center border-b px-4", collapsed && "justify-center")}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
              <Shield className="h-5 w-5 text-primary" />
              <span>Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin">
              <Shield className="h-5 w-5 text-primary" />
            </Link>
          )}
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  )
}
