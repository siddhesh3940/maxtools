"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const posts = [
  {
    title: "How to Merge PDF Files Online: The Complete Guide",
    excerpt: "Learn how to combine multiple PDF files into a single document quickly and securely with MaxTools.",
    category: "PDF Tips",
    author: "Sarah Chen",
    date: "Jun 8, 2026",
    readTime: "5 min read",
    tags: ["PDF", "Merge", "Tutorial"],
  },
  {
    title: "Batch Processing: Save Hours of Manual Work",
    excerpt: "Discover how batch processing can transform your document workflow and boost productivity.",
    category: "Productivity",
    author: "Marcus Johnson",
    date: "Jun 5, 2026",
    readTime: "7 min read",
    tags: ["Batch", "Workflow", "Tips"],
  },
  {
    title: "AI-Powered Document Summarization Is Here",
    excerpt: "Our new AI tools can summarize lengthy documents in seconds. See how it works.",
    category: "AI",
    author: "Elena Rodriguez",
    date: "Jun 2, 2026",
    readTime: "4 min read",
    tags: ["AI", "Summarization", "New Feature"],
  },
  {
    title: "Print Production Checklist: Prepress Best Practices",
    excerpt: "Ensure your files are print-ready with our comprehensive prepress checklist and automated tools.",
    category: "Print",
    author: "Alex Kim",
    date: "May 28, 2026",
    readTime: "6 min read",
    tags: ["Print", "Prepress", "Guide"],
  },
  {
    title: "Converting Files Between Formats: What You Need to Know",
    excerpt: "A complete guide to file conversion including PDF to Word, images to PDF, and more.",
    category: "Conversion",
    author: "Sarah Chen",
    date: "May 24, 2026",
    readTime: "5 min read",
    tags: ["Conversion", "PDF", "Formats"],
  },
  {
    title: "Security First: How We Protect Your Files",
    excerpt: "Learn about the security measures we take to ensure your documents are safe and private.",
    category: "Security",
    author: "Marcus Johnson",
    date: "May 20, 2026",
    readTime: "3 min read",
    tags: ["Security", "Privacy", "Encryption"],
  },
]

const categories = ["All", "PDF Tips", "AI", "Productivity", "Conversion", "Print", "Security"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  const filtered = selectedCategory === "All"
    ? posts
    : posts.filter((p) => p.category === selectedCategory)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Tips, tutorials, and updates from the MaxTools team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 max-w-md mx-auto"
        >
          <Input placeholder="Search articles..." />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </motion.div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {post.author.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <p className="font-medium">{post.author}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                          <Clock className="h-3 w-3 ml-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
      <Footer />
    </div>
  )
}
