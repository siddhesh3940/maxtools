"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Users as UsersIcon, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", plan: "PRO" as const, files: 42, joined: "2025-01-15", status: "active" as const, storage: "2.4 GB" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", plan: "FREE" as const, files: 8, joined: "2025-03-22", status: "active" as const, storage: "156 MB" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", plan: "BUSINESS" as const, files: 156, joined: "2024-11-08", status: "active" as const, storage: "15.2 GB" },
  { id: "4", name: "David Wilson", email: "david@example.com", plan: "FREE" as const, files: 3, joined: "2025-06-01", status: "inactive" as const, storage: "45 MB" },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", plan: "PRO" as const, files: 27, joined: "2025-02-14", status: "active" as const, storage: "1.8 GB" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", plan: "ENTERPRISE" as const, files: 892, joined: "2024-07-30", status: "active" as const, storage: "89 GB" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", plan: "FREE" as const, files: 12, joined: "2025-04-18", status: "active" as const, storage: "234 MB" },
  { id: "8", name: "Henry Brown", email: "henry@example.com", plan: "PRO" as const, files: 67, joined: "2025-01-05", status: "inactive" as const, storage: "3.1 GB" },
  { id: "9", name: "Iris Chen", email: "iris@example.com", plan: "BUSINESS" as const, files: 201, joined: "2024-09-12", status: "active" as const, storage: "22.5 GB" },
  { id: "10", name: "Jack Taylor", email: "jack@example.com", plan: "FREE" as const, files: 5, joined: "2025-05-29", status: "active" as const, storage: "89 MB" },
]

const planBadge: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  FREE: "outline",
  PRO: "default",
  BUSINESS: "secondary",
  ENTERPRISE: "destructive",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  inactive: "bg-muted text-muted-foreground",
}

const plans = ["ALL", "FREE", "PRO", "BUSINESS", "ENTERPRISE"]
const statuses = ["ALL", "ACTIVE", "INACTIVE"]

export default function AdminUsers() {
  const [search, setSearch] = React.useState("")
  const [planFilter, setPlanFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === "ALL" || u.plan === planFilter
    const matchStatus = statusFilter === "ALL" || u.status.toUpperCase() === statusFilter
    return matchSearch && matchPlan && matchStatus
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage registered users and their accounts.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {plans.map((p) => (
            <Button
              key={p}
              variant={planFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter(p)}
            >
              {p === "ALL" ? "All Plans" : p}
            </Button>
          ))}
          <div className="w-px h-6 bg-border mx-1 self-center" />
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "ALL" ? "All Status" : s.charAt(0) + s.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Files</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={planBadge[user.plan]}>{user.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{user.files}</TableCell>
                  <TableCell className="text-muted-foreground">{user.storage}</TableCell>
                  <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>{user.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
