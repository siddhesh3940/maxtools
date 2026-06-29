"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Grid3x3, BookOpen, Scissors, BookCopy, Bookmark, Book,
  Crop, Target, Printer, Upload, Download, Settings, AlertCircle,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PRINT_TOOLS, ALLOWED_PDF_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Grid3x3, BookOpen, Scissors, BookCopy, Bookmark, Book,
  Crop, Target, Printer,
}

function GenericPrintConfig() {
  const [pagesPerSheet, setPagesPerSheet] = React.useState("2")
  const [pageRange, setPageRange] = React.useState("")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pages-per-sheet">Pages per sheet</Label>
        <Select value={pagesPerSheet} onValueChange={setPagesPerSheet}>
          <SelectTrigger id="pages-per-sheet">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="16">16</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="page-range">Page range (optional)</Label>
        <Input id="page-range" placeholder="e.g. 1-10" value={pageRange} onChange={(e) => setPageRange(e.target.value)} />
      </div>
    </div>
  )
}

export default function PrintToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = PRINT_TOOLS.find((t) => t.slug === slug)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)

  if (!tool) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Print tool not found</h2>
          <p className="mt-2 text-muted-foreground">The tool &quot;{slug}&quot; does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const Icon = iconMap[tool.icon]

  const handleProcess = async () => {
    setProcessing(true)
    setProgress(0)
    setCompleted(false)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 8
      })
    }, 200)
    await new Promise((r) => setTimeout(r, 2500))
    clearInterval(interval)
    setProgress(100)
    setTimeout(() => { setProcessing(false); setCompleted(true) }, 500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/"><ChevronLeft className="h-4 w-4" /> Dashboard</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {Icon && <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary" /></div>}
            <div>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            maxSize={MAX_FILE_SIZE}
            showPreview
            multiple={false}
          />

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Configuration</h4>
            <GenericPrintConfig />
          </div>

          <Separator />

          <Button size="lg" className="w-full gap-2" disabled={processing} onClick={handleProcess}>
            {processing ? (
              <><Settings className="h-4 w-4 animate-spin" /> Processing...</>
            ) : completed ? (
              <><Download className="h-4 w-4" /> Download</>
            ) : (
              <><Printer className="h-4 w-4" /> Process {tool.name}</>
            )}
          </Button>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing print layout...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Your print layout has been generated!
                  </p>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8">
                    <div className="text-center">
                      <Printer className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Preview available in the download</p>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" /> Download Print-Ready PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
