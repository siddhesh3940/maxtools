"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Combine, Split, FileDown, RotateCw, ArrowUpDown, Trash2,
  FileOutput, Droplets, Lock, Unlock, PenLine, FlipHorizontal,
  FileSearch, Wrench, Upload, Download, Settings, AlertCircle,
  GripVertical, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PDF_TOOLS, ALLOWED_PDF_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
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

function ToolConfig({ slug }: { slug: string }) {
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [range, setRange] = React.useState("")
  const [quality, setQuality] = React.useState([70])
  const [rotation, setRotation] = React.useState("90")
  const [watermarkText, setWatermarkText] = React.useState("")
  const [watermarkOpacity, setWatermarkOpacity] = React.useState([50])
  const [files, setFiles] = React.useState<Array<{ name: string; size: number }>>([])

  const handleFilesChange = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles.map((f) => ({ name: f.name, size: f.size })))
  }

  switch (slug) {
    case "merge-pdf":
      return (
        <div className="space-y-4">
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            maxSize={MAX_FILE_SIZE}
            onFilesChange={handleFilesChange}
            multiple
          />
          {files.length > 1 && (
            <div className="space-y-2">
              <Label>File order (drag to reorder)</Label>
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div key={f.name} className="flex items-center gap-2 rounded-lg border bg-background p-2 text-sm">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary shrink-0">
                      {i + 1}
                    </span>
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
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-2">
            <Label htmlFor="range">Page range (e.g. 1-5, 7, 9-12)</Label>
            <Input id="range" placeholder="Leave empty to split all pages" value={range} onChange={(e) => setRange(e.target.value)} />
            <p className="text-xs text-muted-foreground">Each page or range becomes a separate PDF</p>
          </div>
        </div>
      )
    case "compress-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Compression Quality: {quality[0]}%</Label>
            </div>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller size</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      )
    case "rotate-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-2">
            <Label>Rotation Angle</Label>
            <Select value={rotation} onValueChange={setRotation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90° Clockwise</SelectItem>
                <SelectItem value="180">180°</SelectItem>
                <SelectItem value="270">90° Counter-clockwise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "protect-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
      )
    case "unlock-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-2">
            <Label htmlFor="pdf-password">Document Password</Label>
            <Input id="pdf-password" type="password" placeholder="Enter the PDF password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
      )
    case "watermark-pdf":
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <div className="space-y-2">
            <Label htmlFor="watermark-text">Watermark Text</Label>
            <Input id="watermark-text" placeholder="e.g. CONFIDENTIAL" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Opacity: {watermarkOpacity[0]}%</Label>
            </div>
            <Slider value={watermarkOpacity} onValueChange={setWatermarkOpacity} min={10} max={100} step={5} />
          </div>
        </div>
      )
    default:
      return (
        <div className="space-y-4">
          <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} onFilesChange={handleFilesChange} />
          <p className="text-sm text-muted-foreground">Configure your settings and process the file.</p>
        </div>
      )
  }
}

export default function PDFToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = PDF_TOOLS.find((t) => t.slug === slug)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)

  if (!tool) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Tool not found</h2>
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
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 5
      })
    }, 200)
    await new Promise((r) => setTimeout(r, 4000))
    clearInterval(interval)
    setProgress(100)
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 500)
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
          <ToolConfig slug={slug} />

          <Separator />

          <Button size="lg" className="w-full gap-2" disabled={processing} onClick={handleProcess}>
            {processing ? (
              <><Settings className="h-4 w-4 animate-spin" /> Processing...</>
            ) : completed ? (
              <><Download className="h-4 w-4" /> Download Result</>
            ) : (
              <><Upload className="h-4 w-4" /> Process File</>
            )}
          </Button>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Your file has been processed successfully!</span>
              </div>
              <Button className="mt-3 w-full gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
