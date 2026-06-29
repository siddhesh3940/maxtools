"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Image, FileImage, FileSpreadsheet, Presentation,
  Code, Upload, Download, Settings, AlertCircle, ChevronLeft, CheckCircle2,
  GripVertical
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CONVERSION_TOOLS, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, FileImage, FileSpreadsheet, Presentation, Code,
}

function getAcceptForTool(slug: string): Record<string, string[]> {
  if (slug === "images-to-pdf") return { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".tiff"] }
  const pdfAccept: Record<string, string[]> = { "application/pdf": [".pdf"] }
  if (slug.startsWith("pdf-to") || slug.startsWith("html-to")) return pdfAccept
  if (slug.startsWith("word-to")) return { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }
  if (slug.startsWith("excel-to")) return { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }
  if (slug.startsWith("ppt-to")) return { "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] }
  if (slug.startsWith("jpg-to") || slug.startsWith("png-to")) return { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }
  if (slug === "html-to-pdf") return { "text/html": [".html", ".htm"] }
  if (slug === "pdf-to-html") return pdfAccept
  return pdfAccept
}

function getOutputFormat(slug: string): string {
  if (slug === "images-to-pdf") return "PDF"
  if (slug.includes("word")) return "DOCX"
  if (slug.includes("jpg")) return "JPG"
  if (slug.includes("png")) return "PNG"
  if (slug.includes("excel")) return "XLSX"
  if (slug.includes("ppt")) return "PPTX"
  if (slug.includes("html")) return "HTML"
  return "PDF"
}

export default function ConvertToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = CONVERSION_TOOLS.find((t) => t.slug === slug)
  const isImagesToPdf = slug === "images-to-pdf"

  const [files, setFiles] = React.useState<File[]>([])
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
  const outputFormat = getOutputFormat(slug)

  const handleProcess = async () => {
    if (!files.length) { setError("Please select a file first."); return }
    setError(null); setResultBlob(null); setProcessing(true); setProgress(10)

    try {
      const formData = new FormData()
      formData.append("tool", slug)
      if (isImagesToPdf) {
        files.forEach((f) => formData.append("file", f))
      } else {
        formData.append("file", files[0])
      }
      setProgress(30)
      const endpoint = isImagesToPdf ? "/api/process" : "/api/convert"
      const res = await fetch(endpoint, { method: "POST", body: formData })
      setProgress(80)

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Server error ${res.status}`)
      }

      const contentType = res.headers.get("content-type") ?? ""
      if (contentType.includes("application/pdf") || contentType.includes("image/")) {
        const blob = await res.blob()
        const filename = res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ?? `converted.${outputFormat.toLowerCase()}`
        setResultBlob({ name: filename, blob })
      } else {
        const json = await res.json()
        const data = json.files?.[0]?.data
        if (data) {
          const blob = new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], { type: "application/pdf" })
          setResultBlob({ name: json.files[0].name ?? "result.pdf", blob })
        } else {
          throw new Error(json.message ?? "Conversion returned no output")
        }
      }
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
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
          <FileUpload accept={getAcceptForTool(slug)} maxSize={MAX_FILE_SIZE} showPreview multiple={isImagesToPdf} onFilesChange={(newFiles) => setFiles(newFiles)} />

          {isImagesToPdf && files.length > 0 && (
            <div className="space-y-2">
              <Label>Images ({files.length})</Label>
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

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Output format:</span>
              <span className="font-medium">{outputFormat}</span>
            </div>
            <Button size="lg" className="gap-2" disabled={processing || !files.length} onClick={handleProcess}>
              {processing ? <><Settings className="h-4 w-4 animate-spin" /> Processing...</> : <><Upload className="h-4 w-4" /> {isImagesToPdf ? "Create PDF" : "Convert"}</>}
            </Button>
          </div>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Converting...</span>
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
                <span className="text-sm font-medium">Conversion completed!</span>
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
