"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const files = [
  { id: "1", name: "Q4_Financial_Report.pdf", user: "Alice Johnson", size: "2.4 MB", type: "PDF", created: "2025-06-10", category: "PDF" as const },
  { id: "2", name: "Marketing_Banner.png", user: "Bob Smith", size: "3.1 MB", type: "PNG", created: "2025-06-09", category: "IMAGE" as const },
  { id: "3", name: "Contract_Draft_v3.docx", user: "Carol Davis", size: "1.2 MB", type: "DOCX", created: "2025-06-09", category: "CONVERSION" as const },
  { id: "4", name: "Product_Catalog.pdf", user: "David Wilson", size: "8.7 MB", type: "PDF", created: "2025-06-08", category: "PDF" as const },
  { id: "5", name: "Invoice_Template.xlsx", user: "Eve Martinez", size: "856 KB", type: "XLSX", created: "2025-06-08", category: "CONVERSION" as const },
  { id: "6", name: "Presentation_Deck.pptx", user: "Frank Lee", size: "12.4 MB", type: "PPTX", created: "2025-06-07", category: "CONVERSION" as const },
  { id: "7", name: "User_Guide.pdf", user: "Grace Kim", size: "5.2 MB", type: "PDF", created: "2025-06-07", category: "PDF" as const },
  { id: "8", name: "Logo_HighRes.png", user: "Henry Brown", size: "4.8 MB", type: "PNG", created: "2025-06-06", category: "IMAGE" as const },
  { id: "9", name: "Technical_Specs.pdf", user: "Iris Chen", size: "3.6 MB", type: "PDF", created: "2025-06-06", category: "PDF" as const },
  { id: "10", name: "Meeting_Notes.txt", user: "Jack Taylor", size: "12 KB", type: "TXT", created: "2025-06-05", category: "CONVERSION" as const },
  { id: "11", name: "Architecture_Diagram.png", user: "Alice Johnson", size: "2.1 MB", type: "PNG", created: "2025-06-05", category: "IMAGE" as const },
  { id: "12", name: "Employee_Handbook.pdf", user: "Carol Davis", size: "15.3 MB", type: "PDF", created: "2025-06-04", category: "PDF" as const },
]

const typeColors: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-500",
  PNG: "bg-blue-500/10 text-blue-500",
  DOCX: "bg-indigo-500/10 text-indigo-500",
  XLSX: "bg-emerald-500/10 text-emerald-500",
  PPTX: "bg-orange-500/10 text-orange-500",
  TXT: "bg-muted text-muted-foreground",
}

const categories = ["ALL", "PDF", "IMAGE", "CONVERSION"]

export default function AdminFiles() {
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")

  const filtered = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.user.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "ALL" || f.category === categoryFilter
    return matchSearch && matchCategory
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        <p className="text-muted-foreground">Browse and manage all uploaded files.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === "ALL" ? "All Types" : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.user}</TableCell>
                  <TableCell className="text-muted-foreground">{file.size}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[file.type] || "bg-muted text-muted-foreground"} variant="outline">
                      {file.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{file.created}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No files found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
