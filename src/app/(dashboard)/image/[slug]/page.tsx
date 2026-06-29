"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Maximize, FileDown, Crop, RefreshCw, Droplets, Wand2,
  ZoomIn, Upload, Download, Settings, AlertCircle, ChevronLeft,
  Eye, EyeOff
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IMAGE_TOOLS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Maximize, FileDown, Crop, RefreshCw, Droplets, Wand2, ZoomIn,
}

function ToolConfig({ slug }: { slug: string }) {
  const [width, setWidth] = React.useState("1920")
  const [height, setHeight] = React.useState("1080")
  const [aspectRatio, setAspectRatio] = React.useState(true)
  const [quality, setQuality] = React.useState([80])
  const [cropRatio, setCropRatio] = React.useState("16:9")
  const [targetFormat, setTargetFormat] = React.useState("png")
  const [watermarkText, setWatermarkText] = React.useState("")
  const [watermarkPosition, setWatermarkPosition] = React.useState("bottom-right")
  const [scale, setScale] = React.useState("2x")

  switch (slug) {
    case "resize-image":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input id="height" type="number" value={height} onChange={(e) => { setHeight(e.target.value); if (aspectRatio) setWidth(String(Math.round(parseInt(e.target.value) * 16 / 9))) }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="aspect-ratio" checked={aspectRatio} onCheckedChange={(v) => setAspectRatio(v === true)} />
            <Label htmlFor="aspect-ratio" className="cursor-pointer">Maintain aspect ratio</Label>
          </div>
        </div>
      )
    case "compress-image":
      return (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Quality: {quality[0]}%</Label>
            </div>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller size</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>
      )
    case "crop-image":
      return (
        <div className="space-y-2">
          <Label>Aspect Ratio</Label>
          <Select value={cropRatio} onValueChange={setCropRatio}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="1:1">Square (1:1)</SelectItem>
              <SelectItem value="4:3">Standard (4:3)</SelectItem>
              <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
              <SelectItem value="3:2">Photo (3:2)</SelectItem>
              <SelectItem value="9:16">Portrait (9:16)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "convert-image":
      return (
        <div className="space-y-2">
          <Label>Target Format</Label>
          <Select value={targetFormat} onValueChange={setTargetFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="tiff">TIFF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "watermark-image":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="watermark-text">Watermark Text</Label>
            <Input id="watermark-text" placeholder="e.g. © 2026 MaxTools" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case "remove-background":
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">AI-powered background removal. Upload an image and we&apos;ll remove the background automatically.</p>
        </div>
      )
    case "image-upscaler":
      return (
        <div className="space-y-2">
          <Label>Scale Factor</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2x">2x (Recommended)</SelectItem>
              <SelectItem value="4x">4x</SelectItem>
              <SelectItem value="8x">8x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    default:
      return null
  }
}

export default function ImageToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = IMAGE_TOOLS.find((t) => t.slug === slug)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  if (!tool) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Image tool not found</h2>
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
        return p + 10
      })
    }, 200)
    await new Promise((r) => setTimeout(r, 2000))
    clearInterval(interval)
    setProgress(100)
    setTimeout(() => { setProcessing(false); setCompleted(true); setShowPreview(true) }, 500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/"><ChevronLeft className="h-4 w-4" /> Dashboard</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
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
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".tiff"] }}
              maxSize={MAX_FILE_SIZE}
              showPreview
              multiple={false}
            />

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Configuration</h4>
              <ToolConfig slug={slug} />
            </div>

            <Separator />

            <Button size="lg" className="w-full gap-2" disabled={processing} onClick={handleProcess}>
              {processing ? (
                <><Settings className="h-4 w-4 animate-spin" /> Processing...</>
              ) : completed ? (
                <><Download className="h-4 w-4" /> Download</>
              ) : (
                <><Upload className="h-4 w-4" /> Process Image</>
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
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Image processed successfully!</p>
                <Button className="mt-3 w-full gap-2">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Preview</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Maximize className="h-8 w-8" />
                    <span className="text-sm">Processed image preview</span>
                  </motion.div>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Upload and process to see preview</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {completed && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparison</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Before</p>
                    <div className="aspect-square rounded-lg bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">After</p>
                    <div className="aspect-square rounded-lg bg-muted/70" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
