"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Users, FileText, Briefcase, DollarSign, Activity, CheckCircle,
  AlertCircle, Clock, ArrowUp, ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", trend: "up", icon: Users, color: "text-blue-500" },
  { label: "Total Files", value: "89,342", change: "+8%", trend: "up", icon: FileText, color: "text-emerald-500" },
  { label: "Active Jobs", value: "143", change: "-3%", trend: "down", icon: Briefcase, color: "text-amber-500" },
  { label: "Revenue", value: "$24,890", change: "+18%", trend: "up", icon: DollarSign, color: "text-purple-500" },
]

const recentUsers = [
  { name: "Alice Johnson", email: "alice@example.com", plan: "PRO", files: 42, joined: "2 hours ago", status: "active" as const },
  { name: "Bob Smith", email: "bob@example.com", plan: "FREE", files: 8, joined: "5 hours ago", status: "active" as const },
  { name: "Carol Davis", email: "carol@example.com", plan: "BUSINESS", files: 156, joined: "1 day ago", status: "active" as const },
  { name: "David Wilson", email: "david@example.com", plan: "FREE", files: 3, joined: "2 days ago", status: "inactive" as const },
  { name: "Eve Martinez", email: "eve@example.com", plan: "PRO", files: 27, joined: "3 days ago", status: "active" as const },
]

const systemHealth = [
  { name: "API Server", status: "healthy" as const, uptime: "99.9%", latency: "45ms" },
  { name: "Database", status: "healthy" as const, uptime: "99.8%", latency: "12ms" },
  { name: "Redis Cache", status: "healthy" as const, uptime: "100%", latency: "2ms" },
  { name: "Queue Workers", status: "degraded" as const, uptime: "98.5%", latency: "120ms" },
  { name: "File Storage", status: "healthy" as const, uptime: "99.9%", latency: "30ms" },
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
  healthy: "bg-emerald-500/10 text-emerald-500",
  degraded: "bg-amber-500/10 text-amber-500",
  down: "bg-red-500/10 text-red-500",
}

export default function AdminDashboard() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of system statistics and health.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={cn("rounded-lg p-3", stat.color.replace("text-", "bg-") + "/10")}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium mt-1",
                  stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                )}>
                  {stat.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" /> Recent Users
              </CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={planBadge[user.plan as keyof typeof planBadge] || "outline"}>
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status]}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{user.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" /> System Health
              </CardTitle>
              <CardDescription>Current system status and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      service.status === "healthy" ? "bg-emerald-500" :
                      service.status === "degraded" ? "bg-amber-500" : "bg-red-500"
                    )} />
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uptime: {service.uptime} · Latency: {service.latency}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusColors[service.status]}>{service.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" /> Today&apos;s Activity
            </CardTitle>
            <CardDescription>Real-time processing metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jobs Processed</span>
                  <span className="font-medium">847 / 1,200</span>
                </div>
                <Progress value={70.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Queue Depth</span>
                  <span className="font-medium">143</span>
                </div>
                <Progress value={11.9} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium">342 GB / 1 TB</span>
                </div>
                <Progress value={33.4} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
