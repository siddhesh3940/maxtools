"use client"

import * as React from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { Plus, GripVertical, Trash2, Save, Play, Settings, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { WorkflowStep } from "@/types"

interface WorkflowBuilderProps {
  onSave?: (workflow: { name: string; steps: WorkflowStep[] }) => void
  onRun?: (workflow: { name: string; steps: WorkflowStep[] }) => void
}

const availableTools = [
  { id: "compress-pdf", name: "Compress PDF", category: "PDF" },
  { id: "merge-pdf", name: "Merge PDF", category: "PDF" },
  { id: "split-pdf", name: "Split PDF", category: "PDF" },
  { id: "watermark-pdf", name: "Watermark PDF", category: "PDF" },
  { id: "protect-pdf", name: "Protect PDF", category: "PDF" },
  { id: "pdf-to-word", name: "PDF to Word", category: "Conversion" },
  { id: "word-to-pdf", name: "Word to PDF", category: "Conversion" },
  { id: "resize-image", name: "Resize Image", category: "Image" },
  { id: "compress-image", name: "Compress Image", category: "Image" },
  { id: "ocr-pdf", name: "OCR PDF", category: "AI" },
]

export function WorkflowBuilder({ onSave, onRun }: WorkflowBuilderProps) {
  const [name, setName] = React.useState("")
  const [steps, setSteps] = React.useState<WorkflowStep[]>([])

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      tool: availableTools[0].id,
      config: {},
      position: steps.length,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id).map((s, i) => ({ ...s, position: i })))
  }

  const updateStepTool = (id: string, tool: string) => {
    setSteps(steps.map((s) => (s.id === id ? { ...s, tool } : s)))
  }

  const handleSave = () => {
    if (!name.trim() || steps.length === 0) return
    onSave?.({ name, steps })
  }

  const handleRun = () => {
    if (steps.length === 0) return
    onRun?.({ name, steps })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Workflow className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Workflow Builder</CardTitle>
            <CardDescription>Create automated workflows by chaining tools together</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wf-name">Workflow Name</Label>
          <Input id="wf-name" placeholder="e.g. Optimize for Web" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Steps ({steps.length})</Label>
            <Button variant="outline" size="sm" onClick={addStep} disabled={steps.length >= 10}>
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </div>

          {steps.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
              <Settings className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No steps yet. Click "Add Step" to begin.</p>
            </div>
          )}

          <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-2">
            <AnimatePresence initial={false}>
              {steps.map((step, index) => (
                <Reorder.Item key={step.id} value={step}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 rounded-lg border bg-background p-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                    <Select value={step.tool} onValueChange={(v) => updateStepTool(step.id, v)}>
                      <SelectTrigger className="w-52">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTools.map((tool) => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="ml-auto">
                      {availableTools.find((t) => t.id === step.tool)?.category}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={() => removeStep(step.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>

        {steps.length > 0 && (
          <div className="flex gap-2">
            <Button variant="default" className="flex-1 gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save Workflow
            </Button>
            <Button variant="secondary" className="flex-1 gap-2" onClick={handleRun}>
              <Play className="h-4 w-4" /> Run Workflow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
