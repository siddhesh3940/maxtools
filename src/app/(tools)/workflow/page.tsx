"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Workflow, Plus, Play, Clock, Layers, Trash2,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WorkflowBuilder } from "@/components/workflow/workflow-builder"

interface SavedWorkflow {
  id: string
  name: string
  stepCount: number
  lastRun: string
  status: "success" | "failed" | "never"
}

const savedWorkflows: SavedWorkflow[] = [
  { id: "wf-1", name: "Optimize for Web", stepCount: 3, lastRun: "2 hours ago", status: "success" },
  { id: "wf-2", name: "Convert & Protect", stepCount: 2, lastRun: "Yesterday", status: "success" },
  { id: "wf-3", name: "Batch Process Images", stepCount: 4, lastRun: "3 days ago", status: "failed" },
  { id: "wf-4", name: "Print Ready Setup", stepCount: 5, lastRun: "Never", status: "never" },
]

export default function WorkflowPage() {
  const [showBuilder, setShowBuilder] = React.useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Workflow className="h-6 w-6 text-primary" />
            </div>
            Workflow Builder
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage automated workflows</p>
        </div>
        <Button onClick={() => setShowBuilder(!showBuilder)} className="gap-2">
          {showBuilder ? (
            "View Saved"
          ) : (
            <><Plus className="h-4 w-4" /> Create Workflow</>
          )}
        </Button>
      </div>

      {showBuilder ? (
        <WorkflowBuilder
          onSave={(wf) => {
            console.log("Saved workflow:", wf)
            setShowBuilder(false)
          }}
          onRun={(wf) => {
            console.log("Running workflow:", wf)
          }}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer border-dashed transition-all hover:border-primary hover:shadow-md" onClick={() => setShowBuilder(true)}>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Create New Workflow</p>
                <p className="text-xs text-muted-foreground mt-1">Automate repetitive tasks</p>
              </CardContent>
            </Card>

            {savedWorkflows.map((wf, index) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Workflow className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">{wf.name}</CardTitle>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardDescription>
                      {wf.stepCount} step{wf.stepCount !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {wf.lastRun}
                      </div>
                      <Badge
                        className={cn(
                          wf.status === "success" && "bg-emerald-500/10 text-emerald-500",
                          wf.status === "failed" && "bg-red-500/10 text-red-500",
                          wf.status === "never" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {wf.status === "never" ? "Not run" : wf.status}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Play className="h-3 w-3" /> Run
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Layers className="h-3 w-3" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Optimize for Web", time: "2 hours ago", status: "Completed" },
                  { name: "Convert & Protect", time: "Yesterday", status: "Completed" },
                  { name: "Batch Process Images", time: "3 days ago", status: "Failed at step 3" },
                ].map((activity) => (
                  <div key={activity.name} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                      <Workflow className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.status}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  )
}
