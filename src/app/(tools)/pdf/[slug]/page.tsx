"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Combine, Split, FileDown, RotateCw, ArrowUpDown, Trash2,
  FileOutput, Droplets, Lock, Unlock, PenLine, FlipHorizontal,
  FileSearch, Wrench, Download, Settings, AlertCircle, ChevronLeft,
  CheckCircle2, GripVertical
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PDF_TOOLS, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Combine, Split, FileDown, RotateCw, ArrowUpDown, Trash2,
  FileOutput, Droplets, Lock, Unlock, PenLine, FlipHorizontal,
  FileSearch, Wrench,
}

interface ToolConfigProps {
  slug: string
  files: File[]
  onFilesChange: (files: File[]) => void
  config: Record<string, string>
  onConfigChange: (key: string, value: string) => void
}

function ToolConfig({ slug, files, onFilesChange, config, onConfigChange }: ToolConfigProps) {
  switch (slug) {
    case "merge-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple />
          {files.length > 1 && (
            <div className="space-y-2">
              <Label>Files to merge ({files.length})</Label>
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div key={f.name + i} className="flex items-center gap-2 rounded-lg border bg-background p-2 text-sm">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">{i + 1}</span>
                    <span className="truncate flex-1">{f.name}</span>
                    <Badge variant="outline" className="shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    case "split-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label htmlFor="range">Page range (e.g. 1-5, 7, 9-12)</Label>
            <Input id="range" placeholder="Leave empty to split every page" value={config.range ?? ""} onChange={(e) => onConfigChange("range", e.target.value)} />
          </div>
        </div>
      )
    case "compress-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Compression Quality: {config.quality ?? "70"}%</Label>
            </div>
            <Slider value={[Number(config.quality ?? 70)]} onValueChange={([v]) => onConfigChange("quality", String(v))} min={10} max={100} step={5} />
          </div>
        </div>
      )
    case "rotate-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Rotation Angle</Label>
            <Select value={config.degrees ?? "90"} onValueChange={(v) => onConfigChange("degrees", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° Clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">90° Counter-clockwise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "watermark-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Watermark Text</Label>
            <Input placeholder="e.g. CONFIDENTIAL" value={config.watermarkText ?? ""} onChange={(e) => onConfigChange("watermarkText", e.target.value)} />
          </div>
          <div className="space-y-3">
            <Label>Opacity: {config.opacity ?? "20"}%</Label>
            <Slider value={[Number(config.opacity ?? 20)]} onValueChange={([v]) => onConfigChange("opacity", String(v))} min={5} max={100} step={5} />
          </div>
        </div>
      )
    case "unlock-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Document Password</Label>
            <Input type="password" placeholder="Enter PDF password" value={config.password ?? ""} onChange={(e) => onConfigChange("password", e.target.value)} />
          </div>
        </div>
      )
    case "sign-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Signature Text</Label>
            <Input placeholder="Your name or signature" value={config.signatureText ?? ""} onChange={(e) => onConfigChange("signatureText", e.target.value)} />
          </div>
        </div>
      )
    case "protect-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Document Password</Label>
            <Input type="password" placeholder="Set a password to protect" value={config.password ?? ""} onChange={(e) => onConfigChange("password", e.target.value)} />
          </div>
        </div>
      )
    case "organize-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
          <div className="space-y-2">
            <Label>Page order (comma-separated, e.g. 3,1,2,4)</Label>
            <Input placeholder="Leave empty to keep current order" value={config.order ?? ""} onChange={(e) => onConfigChange("order", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Pages to delete (comma-separated)</Label>
            <Input placeholder="e.g. 2,5" value={config.deletePages ?? ""} onChange={(e) => onConfigChange("deletePages", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Pages to extract (comma-separated)</Label>
            <Input placeholder="e.g. 1,3" value={config.extractPages ?? ""} onChange={(e) => onConfigChange("extractPages", e.target.value)} />
          </div>
        </div>
      )
    case "repair-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
        </div>
      )
    default:
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={onFilesChange} multiple={false} />
        </div>
      )
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function PDFToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = PDF_TOOLS.find((t) => t.slug === slug)

  const [files, setFiles] = React.useState<File[]>([])
  const [config, setConfig] = React.useState<Record<string, string>>({})
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [resultBlobs, setResultBlobs] = React.useState<{ name: string; blob: Blob }[]>([])

  const handleConfigChange = (key: string, value: string) => setConfig((prev) => ({ ...prev, [key]: value }))

  const handleProcess = async () => {
    if (!files.length) { setError("Please select a file first."); return }
    setError(null); setResultBlobs([]); setProcessing(true); setProgress(10)

    try {
      const formData = new FormData()
      formData.append("tool", slug)
      files.forEach((f) => formData.append("file", f))
      Object.entries(config).forEach(([k, v]) => formData.append(k, v))

      setProgress(30)
      const res = await fetch("/api/process", { method: "POST", body: formData })
      setProgress(80)

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Server error ${res.status}`)
      }

      const contentType = res.headers.get("content-type") ?? ""
      if (contentType.includes("application/pdf")) {
        const blob = await res.blob()
        const filename = res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ?? `${slug}-result.pdf`
        setResultBlobs([{ name: filename, blob }])
      } else {
        const json = await res.json()
        const blobs = (json.files as { name: string; data: string }[]).map(({ name, data }) => ({
          name,
          blob: new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], { type: "application/pdf" }),
        }))
        setResultBlobs(blobs)
      }

      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
    } finally {
      setProcessing(false)
    }
  }

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Tool not found</h2>
          <p className="mt-2 text-muted-foreground">The tool &quot;{slug}&quot; does not exist.</p>
          <Button asChild className="mt-4"><Link href="/tools">Browse Tools</Link></Button>
        </Card>
      </div>
    )
  }

  const Icon = iconMap[tool.icon]
  const completed = resultBlobs.length > 0

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
          <ToolConfig slug={slug} files={files} onFilesChange={setFiles} config={config} onConfigChange={handleConfigChange} />

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Separator />

          <Button size="lg" className="w-full gap-2" disabled={processing || !files.length} onClick={handleProcess}>
            {processing ? <><Settings className="h-4 w-4 animate-spin" /> Processing...</> : <><Settings className="h-4 w-4" /> Process File</>}
          </Button>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">{resultBlobs.length === 1 ? "File processed successfully!" : `${resultBlobs.length} files ready to download`}</span>
              </div>
              {resultBlobs.map(({ name, blob }) => (
                <Button key={name} className="w-full gap-2" onClick={() => downloadBlob(blob, name)}>
                  <Download className="h-4 w-4" /> Download {name}
                </Button>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
