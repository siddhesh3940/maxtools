"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const jobs = [
  { id: "JOB-001", type: "Merge PDF", user: "Alice Johnson", status: "COMPLETED" as const, progress: 100, created: "2025-06-10 14:32", duration: "12s" },
  { id: "JOB-002", type: "Compress PDF", user: "Bob Smith", status: "PROCESSING" as const, progress: 65, created: "2025-06-10 14:28", duration: "8s" },
  { id: "JOB-003", type: "PDF to Word", user: "Carol Davis", status: "PENDING" as const, progress: 0, created: "2025-06-10 14:25", duration: "-" },
  { id: "JOB-004", type: "Watermark PDF", user: "David Wilson", status: "FAILED" as const, progress: 42, created: "2025-06-10 14:20", duration: "5s" },
  { id: "JOB-005", type: "Split PDF", user: "Eve Martinez", status: "COMPLETED" as const, progress: 100, created: "2025-06-10 14:15", duration: "3s" },
  { id: "JOB-006", type: "Cut & Stack", user: "Frank Lee", status: "PROCESSING" as const, progress: 30, created: "2025-06-10 14:10", duration: "15s" },
  { id: "JOB-007", type: "Rotate PDF", user: "Grace Kim", status: "COMPLETED" as const, progress: 100, created: "2025-06-10 14:05", duration: "2s" },
  { id: "JOB-008", type: "Booklet Maker", user: "Henry Brown", status: "CANCELLED" as const, progress: 0, created: "2025-06-10 13:58", duration: "-" },
  { id: "JOB-009", type: "OCR PDF", user: "Iris Chen", status: "COMPLETED" as const, progress: 100, created: "2025-06-10 13:52", duration: "45s" },
  { id: "JOB-010", type: "Image Upscaler", user: "Jack Taylor", status: "PENDING" as const, progress: 0, created: "2025-06-10 13:48", duration: "-" },
  { id: "JOB-011", type: "N-Up Printing", user: "Alice Johnson", status: "COMPLETED" as const, progress: 100, created: "2025-06-10 13:42", duration: "6s" },
  { id: "JOB-012", type: "AI Summary", user: "Carol Davis", status: "FAILED" as const, progress: 18, created: "2025-06-10 13:35", duration: "22s" },
]

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  COMPLETED: "bg-emerald-500/10 text-emerald-500",
  FAILED: "bg-red-500/10 text-red-500",
  CANCELLED: "bg-amber-500/10 text-amber-500",
}

const statusFilters = ["ALL", "PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]

export default function AdminJobs() {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")

  const filtered = jobs.filter((j) => {
    const matchSearch = j.id.toLowerCase().includes(search.toLowerCase()) || j.type.toLowerCase().includes(search.toLowerCase()) || j.user.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground">Monitor and manage processing jobs.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
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
                <TableHead>Job ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-xs font-medium">{job.id}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell className="text-muted-foreground">{job.user}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[job.status]}>{job.status}</Badge>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Progress value={job.progress} className="h-2 w-16" />
                      <span className="text-xs text-muted-foreground">{job.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job.duration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{job.created}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No jobs found matching your filters.
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
