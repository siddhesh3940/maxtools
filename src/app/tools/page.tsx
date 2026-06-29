"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search, Combine, Split, FileDown, RotateCw, ArrowUpDown, Trash2,
  FileOutput, Droplets, Lock, Unlock, PenLine, FlipHorizontal,
  FileSearch, Wrench, FileText, FileImage, FileSpreadsheet,
  Presentation, Code, RefreshCw, Wand2, ZoomIn,
  ScanText, MessageSquare, HelpCircle, Layers, ListChecks,
  BookOpen, Grid3x3, BookCopy, Scissors, Crop,
  Printer, Workflow, Heart, ChevronDown, Coffee, Zap, BookMarked
} from "lucide-react"
import { PDF_TOOLS, CONVERSION_TOOLS, POWER_TOOLS, PRINT_TOOLS, TOOL_CATEGORIES } from "@/lib/constants"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Combine, Split, FileDown, RotateCw, ArrowUpDown, Trash2,
  FileOutput, Droplets, Lock, Unlock, PenLine, FlipHorizontal,
  FileSearch, Wrench, FileText, FileImage, FileSpreadsheet,
  Presentation, Code, RefreshCw, Wand2, ZoomIn,
  ScanText, MessageSquare, HelpCircle, Layers, ListChecks,
  BookOpen, Grid3x3, BookCopy, Scissors, Crop, Printer, Workflow, Zap,
}

interface ToolDef {
  name: string
  slug: string
  icon: string
  description: string
  category: string
}

function getHref(tool: ToolDef): string {
  if (tool.slug === 'workflow-builder') return '/workflow'
  if (tool.slug === 'batch-processing') return '/batch'
  if (tool.category === 'CONVERT') return `/convert/${tool.slug}`
  if (tool.category === 'POWER_TOOLS') return `/print/${tool.slug}`
  return `/pdf/${tool.slug}`
}

const categories = TOOL_CATEGORIES.map(cat => {
  const seen = new Set<string>()
  return {
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    tools: [
      ...POWER_TOOLS.filter(t => t.category === cat.id && !seen.has(t.slug) && seen.add(t.slug)),
      ...PRINT_TOOLS.filter(t => t.category === cat.id && !seen.has(t.slug) && seen.add(t.slug)),
      ...PDF_TOOLS.filter(t => t.category === cat.id && !seen.has(t.slug) && seen.add(t.slug)),
      ...CONVERSION_TOOLS.filter(t => t.category === cat.id && !seen.has(t.slug) && seen.add(t.slug)),
    ],
  }
}).filter(cat => cat.tools.length > 0)

const allTools = categories.flatMap((c) => c.tools.map((t) => ({ ...t as unknown as ToolDef, categoryId: c.id })))

const catIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, FileText, Combine, RefreshCw, PenLine, Lock, Layers,
}

function FileTypeIcon({ className }: { className?: string }) {
  return <FileText className={className} />
}

export default function ToolsPage() {
  const [search, setSearch] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("all")
  const pathname = usePathname()

  const filteredCategories = activeCategory === "all"
    ? categories
    : categories.filter((c) => c.id === activeCategory)

  const filteredTools = activeCategory === "all"
    ? allTools
    : allTools.filter((t) => t.categoryId === activeCategory)

  const searchedTools = filteredTools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-white" />
            </div>
            MaxTools
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="relative text-sm font-medium text-foreground">
              Tools
              <ChevronDown className="inline h-3 w-3 ml-0.5" />
              <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </nav>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-4 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Coffee className="h-3.5 w-3.5" />
            Buy me a coffee
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Tool Explorer</h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xl leading-relaxed">
            Browse our complete collection of free online tools. Merge, split, compress, convert, edit, and
            manage your PDFs, images, and documents — all in your browser, no installation required.
          </p>
          <div className="mt-4">
            <Link
              href="/batch"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              Batch Processing
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Categories */}
            <nav className="space-y-0.5">
              <button
                onClick={() => setActiveCategory("all")}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === "all" ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">All Tools</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${activeCategory === "all" ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-500"}`}>
                  {allTools.length}
                </span>
              </button>
              {categories.map((cat) => {
                const CatIcon = catIconMap[cat.icon] || FileTypeIcon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeCategory === cat.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <CatIcon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className={`text-xs rounded-full px-2 py-0.5 ${activeCategory === cat.id ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-500"}`}>
                      {cat.tools.length}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Tool Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeCategory === "all" ? "All Tools" : categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <span className="text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">{searchedTools.length}</span>
          </div>

          {searchedTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No tools found matching &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchedTools.map((tool) => {
                const ToolIcon = iconMap[tool.icon]
                return (
                  <Link
                    key={tool.slug}
                    href={getHref(tool)}
                    className="block rounded-xl border border-gray-100 bg-white p-4 hover:border-gray-200 hover:shadow-sm transition-all group"
                  >
                    {ToolIcon && (
                      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                        <ToolIcon className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900">{tool.name}</h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <a
        href="https://buymeacoffee.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors"
      >
        <Heart className="h-5 w-5 text-pink-400 fill-pink-400" />
      </a>
    </div>
  )
}
