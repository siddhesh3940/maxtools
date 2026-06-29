"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Image, FileImage, FileSpreadsheet, Presentation,
  Code, Upload, Download, Settings, AlertCircle, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CONVERSION_TOOLS, ALLOWED_PDF_TYPES, ALLOWED_IMAGE_TYPES, ALLOWED_DOC_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Image, FileImage, FileSpreadsheet, Presentation, Code,
}

function getAcceptForTool(slug: string): Record<string, string[]> {
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

function getOutputFormat(slug: string) {
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
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)

  if (!tool) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Conversion tool not found</h2>
          <p className="mt-2 text-muted-foreground">The tool &quot;{slug}&quot; does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const Icon = iconMap[tool.icon]
  const outputFormat = getOutputFormat(slug)

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
        return p + 8
      })
    }, 250)
    await new Promise((r) => setTimeout(r, 3000))
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <FileUpload
              accept={getAcceptForTool(slug)}
              maxSize={MAX_FILE_SIZE}
              showPreview
              multiple={false}
            />
          </motion.div>

          <Separator />

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Output format:</span>
              <span className="font-medium">{outputFormat}</span>
            </div>
            {!processing && !completed && (
              <Button size="lg" className="gap-2" onClick={handleProcess}>
                <Upload className="h-4 w-4" /> Convert
              </Button>
            )}
            {processing && (
              <Button size="lg" disabled>
                <Settings className="h-4 w-4 animate-spin mr-2" /> Converting...
              </Button>
            )}
            {completed && (
              <Button size="lg" className="gap-2">
                <Download className="h-4 w-4" /> Download {outputFormat}
              </Button>
            )}
          </div>

          <AnimatePresence>
            {processing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </motion.div>
            )}
          </AnimatePresence>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Conversion completed successfully!
              </p>
              <Button className="mt-3 w-full gap-2">
                <Download className="h-4 w-4" /> Download {outputFormat}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
