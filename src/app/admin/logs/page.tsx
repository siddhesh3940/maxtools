"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ScrollText, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type LogLevel = "info" | "warn" | "error"
type LogEntry = {
  id: string
  timestamp: string
  level: LogLevel
  source: string
  message: string
  details?: string
}

const logEntries: LogEntry[] = [
  { id: "1", timestamp: "2025-06-10 14:32:18", level: "info", source: "api-server", message: "Request processed: POST /api/process", details: "Duration: 234ms, Status: 200" },
  { id: "2", timestamp: "2025-06-10 14:31:45", level: "warn", source: "queue-worker", message: "High queue depth detected: 143 pending jobs", details: "pdf-processing queue" },
  { id: "3", timestamp: "2025-06-10 14:30:22", level: "error", source: "pdf-worker", message: "Job JOB-004 failed: PDF encryption not supported", details: "Worker: pdf-processing, Retry: 2" },
  { id: "4", timestamp: "2025-06-10 14:29:55", level: "info", source: "auth", message: "User login: alice@example.com", details: "IP: 192.168.1.42, Device: Chrome/120" },
  { id: "5", timestamp: "2025-06-10 14:28:30", level: "info", source: "file-storage", message: "File uploaded: Q4_Report.pdf (2.4 MB)", details: "User: alice@example.com, Storage: s3-bucket-01" },
  { id: "6", timestamp: "2025-06-10 14:27:12", level: "warn", source: "database", message: "Slow query detected: 2.3s", details: "Query: SELECT * FROM files WHERE user_id = ? ORDER BY created_at DESC" },
  { id: "7", timestamp: "2025-06-10 14:25:48", level: "info", source: "api-server", message: "Health check: OK", details: "Uptime: 14d 7h 32m, Memory: 42%" },
  { id: "8", timestamp: "2025-06-10 14:24:15", level: "error", source: "print-worker", message: "Print job JOB-008 cancelled by user", details: "Worker: print-production" },
  { id: "9", timestamp: "2025-06-10 14:22:50", level: "info", source: "queue-worker", message: "Job completed: JOB-001 (Merge PDF)", details: "Duration: 12s, Pages: 24" },
  { id: "10", timestamp: "2025-06-10 14:21:33", level: "info", source: "api-server", message: "Request processed: GET /api/files", details: "Duration: 45ms, Status: 200" },
  { id: "11", timestamp: "2025-06-10 14:20:00", level: "warn", source: "rate-limiter", message: "Rate limit exceeded for IP 203.0.113.42", details: "Endpoint: /api/process, Burst: 15/10" },
  { id: "12", timestamp: "2025-06-10 14:18:22", level: "info", source: "auth", message: "New user registration: jack@example.com", details: "Plan: FREE, Referral: direct" },
  { id: "13", timestamp: "2025-06-10 14:15:45", level: "error", source: "database", message: "Connection pool exhausted", details: "Pool: 20/20 connections in use" },
  { id: "14", timestamp: "2025-06-10 14:14:10", level: "info", source: "file-storage", message: "Temporary file cleanup: 47 files removed", details: "Storage reclaimed: 1.2 GB" },
  { id: "15", timestamp: "2025-06-10 14:12:38", level: "info", source: "api-server", message: "Deployment completed: v2.4.1", details: "Commit: a1b2c3d4, Branch: main" },
  { id: "16", timestamp: "2025-06-10 14:10:55", level: "warn", source: "queue-worker", message: "Worker restart detected", details: "Reason: OOM, Memory: 512MB limit" },
  { id: "17", timestamp: "2025-06-10 14:08:20", level: "info", source: "auth", message: "Password reset requested: bob@example.com", details: "IP: 198.51.100.7" },
  { id: "18", timestamp: "2025-06-10 14:05:42", level: "info", source: "cache", message: "Cache hit ratio: 87.3%", details: "Redis: 15,423 hits / 17,670 total" },
  { id: "19", timestamp: "2025-06-10 14:03:15", level: "error", source: "pdf-worker", message: "Job JOB-012 failed: OCR engine timeout", details: "Worker: pdf-processing, File: scanned_doc.pdf" },
  { id: "20", timestamp: "2025-06-10 14:00:00", level: "info", source: "scheduler", message: "Daily report generated", details: "Users: 12,847, Files: 89,342, Revenue: $24,890" },
]

const levelColors: Record<LogLevel, string> = {
  info: "bg-blue-500/10 text-blue-500",
  warn: "bg-amber-500/10 text-amber-500",
  error: "bg-red-500/10 text-red-500",
}

const levelDot: Record<LogLevel, string> = {
  info: "bg-blue-500",
  warn: "bg-amber-500",
  error: "bg-red-500",
}

const sources = Array.from(new Set(logEntries.map((l) => l.source)))
const levels: LogLevel[] = ["info", "warn", "error"]

export default function AdminLogs() {
  const [search, setSearch] = React.useState("")
  const [levelFilter, setLevelFilter] = React.useState<LogLevel | "ALL">("ALL")
  const [sourceFilter, setSourceFilter] = React.useState("ALL")

  const filtered = logEntries.filter((entry) => {
    const matchSearch = entry.message.toLowerCase().includes(search.toLowerCase()) || entry.source.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === "ALL" || entry.level === levelFilter
    const matchSource = sourceFilter === "ALL" || entry.source === sourceFilter
    return matchSearch && matchLevel && matchSource
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">Real-time system event log viewer.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((l) => (
              <Button
                key={l}
                variant={levelFilter === l ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(levelFilter === l ? "ALL" : l)}
                className="capitalize"
              >
                {l}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sourceFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSourceFilter("ALL")}
          >
            All Sources
          </Button>
          {sources.map((s) => (
            <Button
              key={s}
              variant={sourceFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setSourceFilter(sourceFilter === s ? "ALL" : s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScrollText className="h-5 w-5" /> Log Stream
          </CardTitle>
          <CardDescription>{filtered.length} log entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-6 py-3 text-sm hover:bg-muted/50 transition-colors"
                >
                  <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", levelDot[entry.level])} />
                  <div className="min-w-[140px] text-xs text-muted-foreground font-mono">{entry.timestamp}</div>
                  <div className="min-w-[100px]">
                    <Badge className={levelColors[entry.level]} variant="outline">
                      {entry.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="min-w-[120px] text-xs font-medium text-muted-foreground">{entry.source}</div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{entry.message}</p>
                    {entry.details && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{entry.details}</p>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-muted-foreground">
                  No log entries match your filters.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
