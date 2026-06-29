"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Grid3x3, BookOpen, Printer, Upload, Download, Settings, AlertCircle,
  ChevronLeft, CheckCircle2, Maximize
} from "lucide-react"
import { PRINT_TOOLS, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Grid3x3, Printer, Maximize,
}

export default function PrintToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = PRINT_TOOLS.find((t) => t.slug === slug)
  const isSmartPrint = slug === "smart-print"

  const [files, setFiles] = React.useState<File[]>([])
  const [rows, setRows] = React.useState("2")
  const [cols, setCols] = React.useState("2")
  const [pageRange, setPageRange] = React.useState("")
  const [orientation, setOrientation] = React.useState("auto")
  const [scale, setScale] = React.useState("100")
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [resultBlob, setResultBlob] = React.useState<{ name: string; blob: Blob } | null>(null)

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Tool not found</h2>
          <p className="mt-2 text-muted-foreground">&quot;{slug}&quot; does not exist.</p>
          <Button asChild className="mt-4"><Link href="/tools">Browse Tools</Link></Button>
        </Card>
      </div>
    )
  }

  const Icon = iconMap[tool.icon]
  const R = parseInt(rows) || 2
  const C = parseInt(cols) || 2
  const K = R * C

  const handleProcess = async () => {
    if (!files.length) { setError("Please select a file first."); return }
    setError(null); setResultBlob(null); setProcessing(true); setProgress(10)

    try {
      const formData = new FormData()
      formData.append("tool", slug)
      formData.append("file", files[0])

      if (isSmartPrint) {
        if (pageRange.trim()) formData.append("pageRange", pageRange)
        formData.append("orientation", orientation)
        formData.append("scale", scale)
      } else {
        formData.append("rows", rows)
        formData.append("cols", cols)
      }

      setProgress(30)
      const res = await fetch("/api/print", { method: "POST", body: formData })
      setProgress(80)

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Server error ${res.status}`)
      }

      const blob = await res.blob()
      const filename = res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ?? `${slug}-result.pdf`
      setResultBlob({ name: filename, blob })
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob) return
    const url = URL.createObjectURL(resultBlob.blob)
    const a = document.createElement("a")
    a.href = url; a.download = resultBlob.name; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/tools"><ChevronLeft className="h-4 w-4" /> All Tools</Link>
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
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} showPreview multiple={false} onFilesChange={(newFiles) => setFiles(newFiles)} />

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Configuration</h4>

            {isSmartPrint ? (
              <>
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Select value={orientation} onValueChange={setOrientation}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Page range (optional)</Label>
                  <Input placeholder="e.g. 1-10" value={pageRange} onChange={(e) => setPageRange(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <Label>Scale: {scale}%</Label>
                  <Slider value={[Number(scale)]} onValueChange={([v]) => setScale(String(v))} min={50} max={200} step={5} />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rows">Rows (R)</Label>
                    <Input id="rows" type="number" min={1} max={10} value={rows} onChange={(e) => setRows(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cols">Columns (C)</Label>
                    <Input id="cols" type="number" min={1} max={10} value={cols} onChange={(e) => setCols(e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Grid: {R} &times; {C} = {K} pages per side, {2 * K} pages per duplex sheet
                </p>
              </>
            )}
          </div>

          <Separator />

          <Button size="lg" className="w-full gap-2" disabled={processing || !files.length} onClick={handleProcess}>
            {processing ? (
              <><Settings className="h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><Printer className="h-4 w-4" /> {isSmartPrint ? "Optimize Layout" : "Optimize Booklet"}</>
            )}
          </Button>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Generating print layout...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {resultBlob && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Print layout generated!</span>
              </div>
              <Button className="w-full gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download {resultBlob.name}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
