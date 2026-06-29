"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions, type FileRejection } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, File, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Progress } from "./progress"

export interface FileUploadProps {
  className?: string
  onDrop?: DropzoneOptions["onDrop"]
  onFilesChange?: (files: File[]) => void
  maxSize?: number
  showPreview?: boolean
  multiple?: boolean
  accept?: DropzoneOptions["accept"]
  disabled?: boolean
}

interface FileWithPreview extends File {
  preview?: string
  uploadProgress?: number
}

export function FileUpload({
  className,
  onDrop: onDropProp,
  onFilesChange,
  maxSize = 10 * 1024 * 1024,
  showPreview = true,
  multiple = true,
  accept,
  disabled,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [rejections, setRejections] = React.useState<FileRejection[]>([])

  const onDrop = React.useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      const withPreview = accepted.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
          uploadProgress: 100,
        })
      )

      const updated = multiple
        ? [...files, ...withPreview]
        : withPreview.slice(0, 1)

      updated.forEach((f) => {
        if (f.preview && f.type.startsWith("image/")) {
          URL.revokeObjectURL(f.preview)
          f.preview = URL.createObjectURL(f)
        }
      })

      setFiles(updated)
      setRejections(rejected)
      onFilesChange?.(updated)
      onDropProp?.(accepted, rejected, undefined as any)
    },
    [files, multiple, onFilesChange, onDropProp]
  )

  const removeFile = React.useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index)
      updated.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
      setFiles(updated)
      onFilesChange?.(updated)
    },
    [files, onFilesChange]
  )

  React.useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      maxSize,
      multiple,
      accept,
      disabled,
    })

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const errorMessages = rejections
    .flatMap((r) => r.errors)
    .filter((e, i, a) => a.findIndex((x) => x.code === e.code) === i)

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          {isDragActive ? (
            <p className="text-sm font-medium text-primary">Drop files here</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drag & drop files or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {accept
                  ? Object.values(accept).flat().join(", ")
                  : "All files"}{" "}
                · Max {formatSize(maxSize)}
              </p>
            </>
          )}
        </motion.div>
      </div>

      {errorMessages.length > 0 && (
        <div className="space-y-1">
          {errorMessages.map((err, i) => (
            <p key={i} className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {err.message}
            </p>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${file.size}-${index}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-lg border bg-background p-3"
          >
            {showPreview && file.preview ? (
              <img
                src={file.preview}
                alt={file.name}
                className="h-10 w-10 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                <File className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
              {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                <Progress
                  value={file.uploadProgress}
                  className="mt-1 h-1"
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                removeFile(index)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
