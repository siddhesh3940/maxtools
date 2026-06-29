"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Scissors,
  Download,
  Upload,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  RotateCcw,
  Grid3X3,
  BookOpen,
  Layers,
  ArrowLeft,
  ArrowRight,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculateCutAndStack } from "@/lib/print/cut-and-stack"
import type { CutAndStackConfig, CutAndStackResult } from "@/types"

const STEPS = [
  { id: 1, label: "Upload", icon: Upload },
  { id: 2, label: "Configure", icon: Settings },
  { id: 3, label: "Preview", icon: Eye },
  { id: 4, label: "Download", icon: Download },
] as const

const defaultConfig: CutAndStackConfig = {
  rows: 2,
  columns: 2,
  duplex: "long-edge",
  stackDirection: "left-right",
  autoPadding: true,
  cutMarks: true,
  cropMarks: false,
  registrationMarks: false,
  printInstructions: false,
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function CutAndStackImposition() {
  const [step, setStep] = React.useState(1)
  const [config, setConfig] = React.useState<CutAndStackConfig>(defaultConfig)
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState<number>(16)
  const [manualPageCount, setManualPageCount] = React.useState<boolean>(false)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [currentSheetIndex, setCurrentSheetIndex] = React.useState(0)
  const [previewSide, setPreviewSide] = React.useState<"front" | "back">("front")

  const result = React.useMemo<CutAndStackResult | null>(() => {
    if (pageCount <= 0) return null
    return calculateCutAndStack(config, pageCount)
  }, [config, pageCount])

  const currentPhysicalSheet = React.useMemo(() => {
    if (!result) return null
    const sides = result.sheets.filter((s) => s.side === previewSide)
    if (sides.length === 0) return null
    return sides[currentSheetIndex] ?? null
  }, [result, currentSheetIndex, previewSide])

  React.useEffect(() => {
    setCurrentSheetIndex(0)
  }, [config, pageCount])

  React.useEffect(() => {
    if (!result) return
    const maxIdx = Math.max(0, result.sheets.filter((s) => s.side === previewSide).length - 1)
    if (currentSheetIndex > maxIdx) setCurrentSheetIndex(maxIdx)
  }, [result, currentSheetIndex, previewSide])

  const updateConfig = React.useCallback(
    <K extends keyof CutAndStackConfig>(key: K, value: CutAndStackConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const handleFileDrop = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    try {
      const { PDFDocument } = await import("pdf-lib")
      const buf = await f.arrayBuffer()
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
      setPageCount(doc.getPageCount())
      setManualPageCount(false)
    } catch {
      setManualPageCount(true)
    }
  }, [])

  const handleRemoveFile = React.useCallback(() => {
    setFile(null)
    setManualPageCount(false)
  }, [])

  const handleProcess = React.useCallback(async () => {
    if (!result || result.totalSheets === 0) return
    setProcessing(true)
    setProgress(0)
    const duration = 1500
    const interval = 50
    const increment = interval / duration
    let current = 0
    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        current += increment
        if (current >= 1) {
          current = 1
          clearInterval(timer)
          resolve()
        }
        setProgress(Math.min(current, 1))
      }, interval)
    })
    setProgress(1)
    await new Promise((r) => setTimeout(r, 300))
    setProcessing(false)
    setStep(4)
  }, [result])

  const totalPhysicalSheets = result ? result.sheets.filter((s) => s.side === "front").length : 0

  const gridCells = React.useMemo(() => {
    if (!currentPhysicalSheet) return []
    return currentPhysicalSheet.pages
  }, [currentPhysicalSheet])

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.id <= step) setStep(s.id)
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    step === s.id
                      ? "text-primary"
                      : step > s.id
                        ? "text-primary/70 hover:text-primary"
                        : "text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                      step === s.id
                        ? "border-primary bg-primary/10 text-primary"
                        : step > s.id
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground",
                    )}
                  >
                    {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="mx-2 flex-1 border-t border-border/40" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {/* STEP 1 - UPLOAD */}
        {step === 1 && (
          <motion.div
            key="step-upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Upload PDF</CardTitle>
                    <CardDescription>Select a PDF file to impose using cut-and-stack</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!file ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 transition-colors hover:border-muted-foreground/50">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileDrop}
                    />
                    <div className="rounded-full bg-primary/10 p-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      Drag & drop or <span className="text-primary">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PDF files only</p>
                  </label>
                ) : (
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                        {manualPageCount ? (
                          <p className="mt-1 text-xs text-amber-500">
                            Could not detect pages — enter page count below
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {pageCount} page{pageCount !== 1 ? "s" : ""} detected
                          </p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                        Change
                      </Button>
                    </div>
                  </div>
                )}

                {(manualPageCount || !file) && (
                  <div className="space-y-2">
                    <Label htmlFor="page-count">Page Count</Label>
                    <Input
                      id="page-count"
                      type="number"
                      min={1}
                      max={99999}
                      value={pageCount}
                      onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    variant="default"
                    disabled={pageCount <= 0}
                    onClick={() => setStep(2)}
                  >
                    Configure Layout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 2 - CONFIGURE */}
        {step === 2 && (
          <motion.div
            key="step-configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Imposition Settings</CardTitle>
                    <CardDescription>Configure the cut-and-stack grid and output options</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grid Settings */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Grid3X3 className="h-4 w-4" />
                    Grid Settings
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rows">Rows</Label>
                      <Input
                        id="rows"
                        type="number"
                        min={1}
                        max={10}
                        value={config.rows}
                        onChange={(e) => updateConfig("rows", Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="columns">Columns</Label>
                      <Input
                        id="columns"
                        type="number"
                        min={1}
                        max={10}
                        value={config.columns}
                        onChange={(e) => updateConfig("columns", Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Live Statistics */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Live Statistics
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatBox label="Grid Capacity (K)" value={`${config.rows} × ${config.columns} = ${config.rows * config.columns}`} />
                    <StatBox label="Pages / Sheet" value={`${2 * config.rows * config.columns}`} />
                    <StatBox label="Page Count" value={`${pageCount}`} />
                    <StatBox
                      label="Blank Pages Added"
                      value={`${result?.blankPagesAdded ?? 0}`}
                      highlight={(result?.blankPagesAdded ?? 0) > 0}
                    />
                  </div>
                  {result && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <StatBox label="Physical Sheets" value={`${result.totalSheets}`} />
                      <StatBox label="Total Sides" value={`${result.totalSheets * 2}`} />
                      <StatBox label="Stacks" value={`${result.stacks.length}`} />
                      <StatBox
                        label="Total (padded)"
                        value={`${result.totalPages}`}
                        highlight={result.blankPagesAdded > 0}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Duplex & Stack Direction */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Duplex Binding</Label>
                    <Select
                      value={config.duplex}
                      onValueChange={(v: "long-edge" | "short-edge") => updateConfig("duplex", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long-edge">Long Edge (Portrait)</SelectItem>
                        <SelectItem value="short-edge">Short Edge (Landscape)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stack Direction</Label>
                    <Select
                      value={config.stackDirection}
                      onValueChange={(v: "left-right" | "right-left" | "top-bottom" | "bottom-top") =>
                        updateConfig("stackDirection", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left-right">Left → Right</SelectItem>
                        <SelectItem value="right-left">Right → Left</SelectItem>
                        <SelectItem value="top-bottom">Top → Bottom</SelectItem>
                        <SelectItem value="bottom-top">Bottom → Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Marks & Options */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Printer className="h-4 w-4" />
                    Marks & Options
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.cutMarks}
                        onCheckedChange={(v) => updateConfig("cutMarks", v)}
                      />
                      <Label className="cursor-pointer text-sm">Cut Marks</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.cropMarks}
                        onCheckedChange={(v) => updateConfig("cropMarks", v)}
                      />
                      <Label className="cursor-pointer text-sm">Crop Marks</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.registrationMarks}
                        onCheckedChange={(v) => updateConfig("registrationMarks", v)}
                      />
                      <Label className="cursor-pointer text-sm">Registration Marks</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.printInstructions}
                        onCheckedChange={(v) => updateConfig("printInstructions", v)}
                      />
                      <Label className="cursor-pointer text-sm">Print Instructions</Label>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Checkbox
                      checked={config.autoPadding}
                      onCheckedChange={(v) => updateConfig("autoPadding", v === true)}
                    />
                    <Label className="cursor-pointer text-sm">
                      Auto-pad with blank pages (Total Pages % 2K = 0)
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    variant="default"
                    disabled={!result || result.totalSheets === 0}
                    onClick={() => setStep(3)}
                  >
                    Preview Layout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 3 - PREVIEW */}
        {step === 3 && (
          <motion.div
            key="step-preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Sheet Preview</CardTitle>
                    <CardDescription>
                      Visual layout of imposed pages on each sheet
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Side toggle */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant={previewSide === "front" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewSide("front")}
                  >
                    Front Side
                  </Button>
                  <Button
                    variant={previewSide === "back" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewSide("back")}
                  >
                    Back Side
                  </Button>
                </div>

                {/* Grid Visualization */}
                {currentPhysicalSheet && (
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        "inline-grid w-full max-w-md gap-0 rounded-lg border-2 p-1",
                        previewSide === "front"
                          ? "border-blue-500/40 bg-blue-500/5"
                          : "border-amber-500/40 bg-amber-500/5",
                      )}
                      style={{
                        gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                        gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                        aspectRatio: `${config.columns} / ${config.rows}`,
                      }}
                    >
                      {gridCells.map((cell) => (
                        <div
                          key={`${cell.row}-${cell.col}`}
                          className={cn(
                            "relative flex flex-col items-center justify-center border border-dashed p-1 text-center transition-colors",
                            previewSide === "front"
                              ? "border-blue-500/20 hover:bg-blue-500/10"
                              : "border-amber-500/20 hover:bg-amber-500/10",
                          )}
                        >
                          <span
                            className={cn(
                              "font-mono text-lg font-bold sm:text-2xl",
                              cell.pageNum === 0
                                ? "text-muted-foreground/40"
                                : previewSide === "front"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-amber-600 dark:text-amber-400",
                            )}
                          >
                            {cell.pageNum === 0 ? "—" : cell.pageNum}
                          </span>
                          <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/50">
                            {cell.row},{cell.col}
                          </span>
                          {cell.pageNum === 0 && (
                            <Badge
                              variant="outline"
                              className="mt-1 px-1 py-0 text-[8px] leading-none text-muted-foreground/50"
                            >
                              BLANK
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sheet Navigation */}
                {totalPhysicalSheets > 0 && (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentSheetIndex === 0}
                      onClick={() => setCurrentSheetIndex((i) => Math.max(0, i - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[120px] text-center font-mono text-sm tabular-nums text-muted-foreground">
                      Sheet {currentSheetIndex + 1} / {totalPhysicalSheets}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentSheetIndex >= totalPhysicalSheets - 1}
                      onClick={() =>
                        setCurrentSheetIndex((i) => Math.min(totalPhysicalSheets - 1, i + 1))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Stack legend */}
                {result && result.stacks.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground">Stacks:</span>
                    {result.stacks.map((s) => (
                      <Badge
                        key={s.stackNum}
                        variant="secondary"
                        className="font-mono text-xs"
                      >
                        #{s.stackNum}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Action buttons */}
                <div className="flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPreviewSide("front")
                        setCurrentSheetIndex(0)
                      }}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset View
                    </Button>
                    <Button
                      variant="default"
                      disabled={processing || !result || result.totalSheets === 0}
                      onClick={handleProcess}
                    >
                      {processing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Scissors className="mr-2 h-4 w-4" />
                          Generate Imposition
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {processing && (
                  <Progress
                    value={progress * 100}
                    className="h-2"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 4 - DOWNLOAD */}
        {step === 4 && result && (
          <motion.div
            key="step-download"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Imposition Complete</CardTitle>
                    <CardDescription>
                      {result.blankPagesAdded > 0
                        ? `${result.blankPagesAdded} blank page${result.blankPagesAdded !== 1 ? "s" : ""} added for proper alignment`
                        : "All pages aligned perfectly — no padding needed"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SummaryCard
                    label="Physical Sheets"
                    value={result.totalSheets}
                    icon={<Layers className="h-4 w-4" />}
                  />
                  <SummaryCard
                    label="Front / Back"
                    value={`${result.frontSheets} / ${result.backSheets}`}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                  <SummaryCard
                    label="Pages per Sheet"
                    value={result.pagesPerSheet}
                    icon={<Grid3X3 className="h-4 w-4" />}
                  />
                  <SummaryCard
                    label="Grid Capacity"
                    value={`${config.rows}×${config.columns} (${result.gridCapacity})`}
                    icon={<Grid3X3 className="h-4 w-4" />}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <SummaryCard
                    label="Total Pages"
                    value={result.totalPages}
                    icon={<FileText className="h-4 w-4" />}
                  />
                  <SummaryCard
                    label="Blank Pages Added"
                    value={result.blankPagesAdded}
                    icon={<RotateCcw className="h-4 w-4" />}
                    highlight={result.blankPagesAdded > 0}
                  />
                  <SummaryCard
                    label="Number of Stacks"
                    value={result.stacks.length}
                    icon={<Layers className="h-4 w-4" />}
                  />
                  <SummaryCard
                    label="Duplex"
                    value={config.duplex === "long-edge" ? "Long Edge" : "Short Edge"}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                </div>

                <Separator />

                {/* Per-Stack Breakdown */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    Per-Stack Page Breakdown
                  </div>
                  <ScrollArea className="max-h-64 rounded-lg border">
                    <div className="divide-y">
                      {result.stacks.map((stack) => (
                        <div key={stack.stackNum} className="p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              Stack #{stack.stackNum}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {stack.frontPages.length + stack.backPages.length} pages
                            </span>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <span className="text-xs font-medium text-blue-500">Front:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {stack.frontPages.map((p) => (
                                  <Badge
                                    key={p}
                                    variant="outline"
                                    className="font-mono text-xs"
                                  >
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-amber-500">Back:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {stack.backPages.map((p) => (
                                  <Badge
                                    key={p}
                                    variant="outline"
                                    className="font-mono text-xs"
                                  >
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setStep(1); setFile(null); setManualPageCount(false) }}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                    <Button variant="default" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Imposed PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/30 p-3",
        highlight && "border-amber-500/30 bg-amber-500/5",
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-sm font-bold",
          highlight ? "text-amber-500" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/30 p-3",
        highlight && "border-amber-500/30 bg-amber-500/5",
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-bold",
          highlight ? "text-amber-500" : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  )
}
