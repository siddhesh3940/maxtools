"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast, { Toaster as HotToaster, resolveValue, type Toast } from "react-hot-toast"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<Toast["type"], typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  loading: Info,
  blank: Info,
  custom: Info,
}

const Toast = ({ t }: { t: Toast }) => {
  const Icon = iconMap[t.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-background p-4 shadow-lg",
        t.visible ? "block" : "hidden"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          t.type === "success" && "text-green-500",
          t.type === "error" && "text-destructive",
          t.type === "blank" && "text-foreground"
        )}
      />
      <div className="flex-1 text-sm">{resolveValue(t.message, t)}</div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

function Toaster() {
  return (
    <HotToaster position="bottom-right" gutter={8}>
      {(t) => (
        <AnimatePresence>
          {t.visible && <Toast t={t} />}
        </AnimatePresence>
      )}
    </HotToaster>
  )
}

export { toast, Toaster }
