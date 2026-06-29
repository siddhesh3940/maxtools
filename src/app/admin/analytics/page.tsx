"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, DollarSign, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const toolUsageData = [
  { tool: "Merge PDF", count: 1245, percentage: 18 },
  { tool: "Compress PDF", count: 987, percentage: 14 },
  { tool: "PDF to Word", count: 876, percentage: 13 },
  { tool: "Split PDF", count: 654, percentage: 9 },
  { tool: "Rotate PDF", count: 543, percentage: 8 },
  { tool: "Watermark PDF", count: 432, percentage: 6 },
  { tool: "Booklet Maker", count: 321, percentage: 5 },
  { tool: "OCR PDF", count: 298, percentage: 4 },
  { tool: "Cut & Stack", count: 245, percentage: 4 },
  { tool: "N-Up Printing", count: 198, percentage: 3 },
]

const monthlyStats = [
  { month: "Jan", users: 1200, revenue: 4200, files: 5400 },
  { month: "Feb", users: 1350, revenue: 4800, files: 6100 },
  { month: "Mar", users: 1500, revenue: 5100, files: 6800 },
  { month: "Apr", users: 1650, revenue: 5600, files: 7200 },
  { month: "May", users: 1800, revenue: 6200, files: 8100 },
  { month: "Jun", users: 2100, revenue: 7100, files: 9200 },
]

const barColors = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-violet-500", "bg-lime-500",
  "bg-pink-500", "bg-teal-500",
]

function BarChart({ data, dataKey, labelKey, color, height = 180 }: {
  data: Record<string, number | string>[]
  dataKey: string
  labelKey: string
  color: string
  height?: number
}) {
  const max = Math.max(...data.map((d) => Number(d[dataKey])))
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const value = Number(d[dataKey])
        const barHeight = (value / max) * 100
        return (
          <div key={String(d[labelKey])} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <span className="text-[10px] text-muted-foreground">{value}</span>
            <div
              className={cn("w-full rounded-t", color)}
              style={{ height: `${barHeight}%`, minHeight: 4 }}
            />
            <span className="text-[10px] text-muted-foreground truncate w-full text-center">{String(d[labelKey])}</span>
          </div>
        )
      })}
    </div>
  )
}

function HorizontalBarChart({ data, labelKey, valueKey, percentageKey }: {
  data: Record<string, string | number>[]
  labelKey: string
  valueKey: string
  percentageKey: string
}) {
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={String(d[labelKey])} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full", barColors[i % barColors.length])} />
              <span>{String(d[labelKey])}</span>
            </div>
            <span className="font-medium">{String(d[valueKey])}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", barColors[i % barColors.length])}
              style={{ width: `${d[percentageKey]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Usage statistics and growth metrics.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg p-3 bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">9,600</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg p-3 bg-emerald-500/10">
              <FileText className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">42.8K</p>
              <p className="text-xs text-muted-foreground">Files Processed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg p-3 bg-purple-500/10">
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">$33,000</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg p-3 bg-amber-500/10">
              <TrendingUp className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">+32%</p>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" /> Tool Usage
              </CardTitle>
              <CardDescription>Most used tools this month</CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart
                data={toolUsageData}
                labelKey="tool"
                valueKey="count"
                percentageKey="percentage"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" /> User Growth
              </CardTitle>
              <CardDescription>New user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlyStats} dataKey="users" labelKey="month" color="bg-blue-500" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" /> Revenue
              </CardTitle>
              <CardDescription>Monthly recurring revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlyStats} dataKey="revenue" labelKey="month" color="bg-emerald-500" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" /> Files Processed
              </CardTitle>
              <CardDescription>Monthly file processing volume</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={monthlyStats} dataKey="files" labelKey="month" color="bg-purple-500" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
