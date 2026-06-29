"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import {
  Upload, Workflow, Layers, FileText, Clock,
  CheckCircle, AlertCircle, BarChart3, HardDrive
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const quickActions = [
  { label: "Upload File", icon: Upload, href: "/pdf/merge-pdf", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "New Workflow", icon: Workflow, href: "/workflow", color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Batch Process", icon: Layers, href: "/batch", color: "text-emerald-500", bg: "bg-emerald-500/10" },
]

const recentFiles = [
  { name: "Q4_Report.pdf", size: "2.4 MB", date: "2 hours ago", type: "PDF" },
  { name: "Invoice_Template.docx", size: "1.1 MB", date: "5 hours ago", type: "DOCX" },
  { name: "Presentation_v2.pptx", size: "8.7 MB", date: "Yesterday", type: "PPTX" },
  { name: "Banner_Image.png", size: "3.2 MB", date: "Yesterday", type: "PNG" },
  { name: "User_Guide.pdf", size: "5.8 MB", date: "2 days ago", type: "PDF" },
  { name: "Contract_Draft.pdf", size: "1.5 MB", date: "3 days ago", type: "PDF" },
]

const recentJobs = [
  { id: "JOB-001", tool: "Merge PDF", status: "completed" as const, date: "1 hour ago" },
  { id: "JOB-002", tool: "Compress PDF", status: "completed" as const, date: "3 hours ago" },
  { id: "JOB-003", tool: "PDF to Word", status: "processing" as const, date: "30 min ago" },
  { id: "JOB-004", tool: "Watermark PDF", status: "failed" as const, date: "2 hours ago" },
]

const stats = [
  { label: "Files Today", value: "24", icon: Upload, color: "text-blue-500" },
  { label: "Active Jobs", value: "3", icon: Clock, color: "text-amber-500" },
  { label: "Completed", value: "1,247", icon: CheckCircle, color: "text-emerald-500" },
  { label: "Storage Used", value: "2.4 GB", icon: HardDrive, color: "text-purple-500" },
]

const statusColor = {
  completed: "bg-emerald-500/10 text-emerald-500",
  processing: "bg-blue-500/10 text-blue-500",
  failed: "bg-red-500/10 text-red-500",
  pending: "bg-muted text-muted-foreground",
}

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your documents today.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="group cursor-pointer transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("rounded-lg p-3", action.bg)}>
                  <action.icon className={cn("h-5 w-5", action.color)} />
                </div>
                <span className="font-medium group-hover:text-primary transition-colors">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <stat.icon className={cn("h-8 w-8", stat.color)} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
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
                <FileText className="h-5 w-5" /> Recent Files
              </CardTitle>
              <CardDescription>Your recently processed files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div key={file.name} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} · {file.date}</p>
                    </div>
                    <Badge variant="outline">{file.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" /> Recent Jobs
              </CardTitle>
              <CardDescription>Your recent processing jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{job.tool}</p>
                      <p className="text-xs text-muted-foreground">{job.id} · {job.date}</p>
                    </div>
                    <Badge className={statusColor[job.status]}>
                      {job.status === "processing" && <Clock className="h-3 w-3 mr-1" />}
                      {job.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {job.status === "failed" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" /> Storage Usage
            </CardTitle>
            <CardDescription>Your storage allocation across plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">2.4 GB of 10 GB used</span>
                <span className="text-muted-foreground">24%</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-medium text-muted-foreground">PDF Files</p>
                <p className="text-lg font-bold">1.8 GB</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Images</p>
                <p className="text-lg font-bold">450 MB</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Other</p>
                <p className="text-lg font-bold">150 MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
