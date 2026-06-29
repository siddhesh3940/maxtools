"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ScanText, FileText, MessageSquare, StickyNote, HelpCircle,
  Layers, ListChecks, BookOpen, Upload, Download, Settings,
  AlertCircle, ChevronLeft, Send, Sparkles, Bot
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AI_TOOLS, ALLOWED_PDF_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUpload } from "@/components/ui/file-upload"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ScanText, FileText, MessageSquare, StickyNote, HelpCircle,
  Layers, ListChecks, BookOpen,
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

function ChatInterface() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I've analyzed your PDF. What would you like to know about it?" },
  ])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `I understand you're asking about "${userMsg}". Based on the document analysis, I can help you with that. Could you provide more specific details about what you're looking for?` },
    ])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[500px] rounded-lg border">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                <motion.div className="flex gap-1" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2">
          <Input
            placeholder="Ask a question about your PDF..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function AIToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const tool = AI_TOOLS.find((t) => t.slug === slug)
  const [processing, setProcessing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [completed, setCompleted] = React.useState(false)
  const [result, setResult] = React.useState("")

  if (!tool) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">AI tool not found</h2>
          <p className="mt-2 text-muted-foreground">The tool &quot;{slug}&quot; does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const Icon = iconMap[tool.icon]
  const isChat = slug === "chat-with-pdf"

  const getResultContent = (toolSlug: string) => {
    const samples: Record<string, string> = {
      "ocr-pdf": "Extracted text from scanned PDF document:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "ai-summary": "## Document Summary\n\nThis document discusses key trends in digital transformation across industries. The main findings include:\n\n- 78% of organizations have accelerated their digital transformation initiatives\n- Cloud adoption has increased by 45% year-over-year\n- AI and machine learning are the top investment priorities\n- Security concerns remain the primary barrier to adoption",
      "generate-notes": "## Study Notes\n\n### Key Concepts\n1. Digital transformation is reshaping business models\n2. Cloud computing enables scalable infrastructure\n3. AI drives automation and insights\n\n### Important Terms\n- **Digital Transformation**: Integration of digital technology into all areas of business\n- **Cloud Computing**: On-demand availability of computing resources\n- **Machine Learning**: AI subset that enables systems to learn from data",
      "generate-mcqs": "## Multiple Choice Questions\n\n**Q1: What is the primary benefit of cloud computing?**\n\nA) Lower cost\nB) Scalability\nC) Security\nD) Speed\n\n**Answer: B) Scalability**\n\n**Q2: Which technology enables systems to learn from data without explicit programming?**\n\nA) Blockchain\nB) IoT\nC) Machine Learning\nD) Edge Computing\n\n**Answer: C) Machine Learning**",
      "generate-flashcards": "## Flashcards\n\n**Front:** What is digital transformation?\n**Back:** The integration of digital technology into all areas of a business\n\n**Front:** Define cloud computing\n**Back:** On-demand availability of computing resources over the internet\n\n**Front:** What is machine learning?\n**Back:** A subset of AI that enables systems to learn and improve from experience",
      "extract-key-points": "## Key Points Extracted\n\n- Digital transformation is accelerating globally\n- Cloud adoption is a key enabler\n- AI/ML are priority investment areas\n- Security remains a top concern\n- Skills gap is a significant challenge\n- ROI from digital initiatives varies by industry",
      "study-material": "## Comprehensive Study Material\n\n### Module 1: Introduction to Digital Transformation\n\nDigital transformation refers to the profound changes in business activities, processes, competencies, and models leveraging digital technologies.\n\n### Module 2: Key Technologies\n\n1. **Cloud Computing**: Enables scalable, on-demand computing resources\n2. **Artificial Intelligence**: Simulates human intelligence in machines\n3. **Internet of Things**: Connects physical devices to the internet\n\n### Module 3: Implementation Strategies\n\nSuccessful digital transformation requires:\n- Clear vision and leadership\n- Investment in talent and training\n- Agile methodology adoption\n- Continuous evaluation and iteration",
    }
    return samples[toolSlug] || "AI processing complete. Your content has been generated successfully."
  }

  const handleProcess = async () => {
    setProcessing(true)
    setProgress(0)
    setCompleted(false)
    setResult("")
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 3
      })
    }, 150)
    await new Promise((r) => setTimeout(r, 5000))
    clearInterval(interval)
    setProgress(100)
    setResult(getResultContent(slug))
    setProcessing(false)
    setCompleted(true)
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
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{tool.name}</CardTitle>
                <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" /> AI</Badge>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isChat ? (
            <>
              <FileUpload accept={{ "application/pdf": [".pdf"] }} maxSize={MAX_FILE_SIZE} showPreview multiple={false} />
              <Separator />
              <ChatInterface />
            </>
          ) : (
            <>
              <FileUpload accept={{ "application/pdf": [".pdf"], "text/plain": [".txt"] }} maxSize={MAX_FILE_SIZE} showPreview multiple={false} />

              <Separator />

              <Button size="lg" className="w-full gap-2" disabled={processing || completed} onClick={handleProcess}>
                {processing ? (
                  <><Sparkles className="h-4 w-4 animate-pulse" /> Processing with AI...</>
                ) : completed ? (
                  <><Download className="h-4 w-4" /> Download Results</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate with AI</>
                )}
              </Button>

              <AnimatePresence>
                {processing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Sparkles className="h-4 w-4 text-primary" />
                      </motion.div>
                      <span className="text-sm text-muted-foreground">AI is analyzing your document...</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </motion.div>
                )}
              </AnimatePresence>

              {completed && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" /> Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">
                        {result}
                      </div>
                      <Button className="mt-4 w-full gap-2">
                        <Download className="h-4 w-4" /> Download Results
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
