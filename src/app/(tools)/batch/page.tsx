"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Layers, Upload, Download, Settings, AlertCircle, CheckCircle,
  Clock, FileText, X, Archive, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/ui/file-upload"

type FileStatus = "pending" | "processing" | "completed" | "failed"

interface BatchFile {
  name: string
  size: number
  status: FileStatus
  resultBlob?: Blob
}

const toolApiMap: Record<string, string> = {
  "compress-pdf": "compress-pdf",
  "watermark-pdf": "watermark-pdf",
  "images-to-pdf": "images-to-pdf",
  "merge-pdf": "merge-pdf",
  "split-pdf": "split-pdf",
  "organize-pdf": "organize-pdf",
}

const batchOperations = [
  { value: "compress-pdf", label: "Compress PDF" },
  { value: "watermark-pdf", label: "Add Watermark" },
  { value: "images-to-pdf", label: "Images to PDF" },
  { value: "merge-pdf", label: "Merge PDF" },
  { value: "split-pdf", label: "Split PDF" },
  { value: "organize-pdf", label: "Organize Pages" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function BatchPage() {
  const [operation, setOperation] = React.useState("compress-pdf")
  const [batchFiles, setBatchFiles] = React.useState<BatchFile[]>([])
  const [processing, setProcessing] = React.useState(false)
  const [overallProgress, setOverallProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)
  const fileInputRef = React.useRef<Map<string, File>>(new Map())

  const handleFilesChange = (files: File[]) => {
    const map = new Map<string, File>()
    files.forEach((f) => map.set(f.name, f))
    fileInputRef.current = map
    setBatchFiles(files.map((f) => ({ name: f.name, size: f.size, status: "pending" as FileStatus })))
  }

  const handleProcessAll = async () => {
    if (batchFiles.length === 0) return
    setProcessing(true)
    setOverallProgress(0)
    setCompleted(false)

    const results: BatchFile[] = []

    for (let i = 0; i < batchFiles.length; i++) {
      const file = fileInputRef.current.get(batchFiles[i].name)
      if (!file) {
        results.push({ ...batchFiles[i], status: "failed" })
        setOverallProgress(Math.round(((i + 1) / batchFiles.length) * 100))
        continue
      }

      setBatchFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: "processing" } : f))

      try {
        const formData = new FormData()
        formData.append("tool", toolApiMap[operation] || operation)
        formData.append("file", file)

        const res = await fetch("/api/process", { method: "POST", body: formData })

        if (!res.ok) {
          throw new Error(await res.text())
        }

        const contentType = res.headers.get("content-type")
        if (contentType?.includes("application/pdf")) {
          const blob = await res.blob()
          results.push({ ...batchFiles[i], status: "completed", resultBlob: blob })
        } else {
          const json = await res.json()
          if (json.success && json.files) {
            for (const f of json.files) {
              const byteChars = atob(f.data)
              const byteArray = new Uint8Array(byteChars.length)
              for (let bi = 0; bi < byteChars.length; bi++) {
                byteArray[bi] = byteChars.charCodeAt(bi)
              }
              const blob = new Blob([byteArray], { type: "application/pdf" })
              results.push({ name: f.name, size: blob.size, status: "completed", resultBlob: blob })
            }
          } else {
            throw new Error("Unexpected response format")
          }
        }
      } catch {
        results.push({ ...batchFiles[i], status: "failed" })
      }

      setOverallProgress(Math.round(((i + 1) / batchFiles.length) * 100))
    }

    setBatchFiles(results)
    setProcessing(false)
    setOverallProgress(100)
    setCompleted(true)
  }

  const completedCount = batchFiles.filter((f) => f.status === "completed").length
  const failedCount = batchFiles.filter((f) => f.status === "failed").length

  const downloadResult = (file: BatchFile) => {
    if (!file.resultBlob) return
    const url = URL.createObjectURL(file.resultBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name.replace(/\.[^.]+$/, "") + "-processed.pdf"
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    const completed = batchFiles.filter((f) => f.status === "completed" && f.resultBlob)
    completed.forEach(downloadResult)
  }

  const clearAll = () => {
    setBatchFiles([])
    fileInputRef.current = new Map()
    setCompleted(false)
    setOverallProgress(0)
  }

  const statusIcon = (status: FileStatus) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing": return <Settings className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed": return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const statusBadge = (status: FileStatus) => {
    switch (status) {
      case "pending": return <Badge variant="outline">Pending</Badge>
      case "processing": return <Badge className="bg-blue-500/10 text-blue-500">Processing</Badge>
      case "completed": return <Badge className="bg-emerald-500/10 text-emerald-500">Completed</Badge>
      case "failed": return <Badge variant="destructive">Failed</Badge>
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <motion.div variants={itemVariants}>
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/"><ChevronLeft className="h-4 w-4" /> Dashboard</Link>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batch Processing</h1>
          <p className="text-muted-foreground mt-1">Process multiple files at once</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" /> Upload Files
              </CardTitle>
              <CardDescription>Select all files you want to process</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg", ".webp"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
                maxSize={100 * 1024 * 1024}
                onFilesChange={handleFilesChange}
                multiple
              />
            </CardContent>
          </Card>

          {batchFiles.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Files ({batchFiles.length})
                    </CardTitle>
                    {(completed || processing) && (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-emerald-500">{completedCount} done</span>
                        {failedCount > 0 && <span className="text-red-500">{failedCount} failed</span>}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {batchFiles.map((file, i) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-lg border bg-background p-3"
                    >
                      {statusIcon(file.status)}
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      {statusBadge(file.status)}
                      {file.status === "completed" && file.resultBlob && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => downloadResult(file)} title="Download">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Operation</Label>
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOperations.map((op) => (
                      <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Summary</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Files selected: {batchFiles.length}</p>
                  <p>Operation: {batchOperations.find((o) => o.value === operation)?.label}</p>
                  <p>Total size: {batchFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024 > 1
                    ? `${(batchFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB`
                    : `${(batchFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(0)} KB`
                  }</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-2"
                disabled={batchFiles.length === 0 || processing}
                onClick={handleProcessAll}
              >
                {processing ? (
                  <><Settings className="h-4 w-4 animate-spin" /> Processing...</>
                ) : completed ? (
                  <><Archive className="h-4 w-4" /> Download All (ZIP)</>
                ) : (
                  <><Layers className="h-4 w-4" /> Process All</>
                )}
              </Button>
            </CardContent>
          </Card>

          {(processing || completed) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{processing ? "Processing..." : "Complete!"}</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} />
                  {completed && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={downloadAll} disabled={completedCount === 0}>
                        <Download className="h-3 w-3" /> Download All
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={clearAll}>
                        <X className="h-3 w-3" /> Clear All
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
