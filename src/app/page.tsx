"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import {
  ArrowRight, Check, Combine, Split, FileType, Image, Wand2, Printer,
  Workflow, Cloud, Layers, Shield, Zap, Star, ChevronDown, ChevronUp,
  Quote, Box, Search, Users, Activity, Clock, Shuffle
} from "lucide-react"
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <div ref={ref} className="text-3xl sm:text-4xl font-bold tabular-nums">{count}{suffix}</div>
}

const popularTools = [
  { href: "/pdf/merge-pdf", label: "Merge PDF", icon: Combine, color: "text-blue-500", bg: "bg-blue-500/10" },
  { href: "/pdf/split-pdf", label: "Split PDF", icon: Split, color: "text-violet-500", bg: "bg-violet-500/10" },
  { href: "/convert/pdf-to-word", label: "File Converter", icon: FileType, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { href: "/image/resize-image", label: "Image Tools", icon: Image, color: "text-amber-500", bg: "bg-amber-500/10" },
  { href: "/ai/ai-summary", label: "AI Summary", icon: Wand2, color: "text-rose-500", bg: "bg-rose-500/10" },
  { href: "/print/n-up", label: "Print Tools", icon: Printer, color: "text-cyan-500", bg: "bg-cyan-500/10" },
]

const categories = [
  { icon: Combine, title: "PDF Tools", desc: "Merge, split, compress, and edit PDFs with ease.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Shuffle, title: "Conversion", desc: "Convert between PDF, DOCX, images, and more.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Image, title: "Image Tools", desc: "Resize, compress, and convert image formats.", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Wand2, title: "AI Tools", desc: "Summarize, extract, and translate with AI.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Printer, title: "Print Production", desc: "Prepress checks, color management, imposition.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: Workflow, title: "Workflow Builder", desc: "Automate repetitive tasks with custom workflows.", color: "text-violet-500", bg: "bg-violet-500/10" },
]

const features = [
  { icon: Cloud, title: "Cloud Processing", desc: "All processing happens in the cloud. No downloads needed." },
  { icon: Layers, title: "Batch Processing", desc: "Process hundreds of files simultaneously with ease." },
  { icon: Wand2, title: "AI-Powered", desc: "Smart tools that understand your documents." },
  { icon: Printer, title: "Print Production", desc: "Professional-grade print preparation tools." },
  { icon: Shield, title: "Secure", desc: "Files are encrypted and automatically deleted after processing." },
  { icon: Zap, title: "Fast", desc: "Lightning-fast processing powered by modern infrastructure." },
]

const plans = [
  { name: "Free", price: "$0", desc: "Perfect for getting started", features: ["5 files per day", "Up to 10MB per file", "Basic PDF tools", "Web access"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$12", desc: "For professionals and power users", features: ["Unlimited files", "Up to 500MB per file", "All tools", "Batch processing", "Priority support", "API access"], cta: "Start Free Trial", popular: true },
  { name: "Business", price: "$49", desc: "For teams and organizations", features: ["Everything in Pro", "Up to 2GB per file", "Team collaboration", "Custom workflows", "Dedicated support", "SLA guarantee"], cta: "Contact Sales", popular: false },
]

const testimonials = [
  { name: "Sarah Chen", role: "Product Designer", avatar: "SC", content: "MaxTools has transformed our document workflow. The batch processing alone saves us hours every week." },
  { name: "Marcus Johnson", role: "DevOps Engineer", avatar: "MJ", content: "The API is incredibly well-documented. We integrated it in under an hour." },
  { name: "Elena Rodriguez", role: "Print Shop Owner", avatar: "ER", content: "The print production suite is a game-changer. Prepress checks that used to take 30 minutes now take seconds." },
  { name: "Alex Kim", role: "Freelancer", avatar: "AK", content: "As a freelancer, the free tier gives me everything I need. Upgraded to Pro within a week." },
]

const faqs = [
  { q: "Is MaxTools free to use?", a: "Yes! We offer a generous free tier that includes 5 files per day with basic PDF tools. Upgrade to Pro for unlimited access." },
  { q: "Are my files secure?", a: "Absolutely. All files are encrypted in transit and at rest. Files are automatically deleted from our servers within 1 hour of processing." },
  { q: "What file formats are supported?", a: "We support PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, SVG, TIFF, and many more formats." },
  { q: "Can I process files in batch?", a: "Yes, batch processing is available on Pro and Business plans. You can process up to 100 files simultaneously." },
  { q: "Do you have an API?", a: "Yes, our REST API is available on Pro and Business plans. Check our API documentation for details." },
  { q: "What is the maximum file size?", a: "Free: 10MB, Pro: 500MB, Business: 2GB per file." },
]

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b">
      <button onClick={onToggle} className="flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-primary">
        {q}
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="pb-4 text-sm text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = React.useState<string | null>(null)
  const [testimonialIdx, setTestimonialIdx] = React.useState(0)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredTools = searchQuery
    ? popularTools.filter((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : popularTools

  React.useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">50+ Tools Available</Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MaxTools &mdash; The Ultimate <span className="text-primary"> PDF &amp; File Toolkit</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert, edit, merge, split, and manage your documents online. Powerful tools for professionals, with AI-powered features and batch processing.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-base px-8 gap-2">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="text-base px-8 gap-2" asChild>
                <Link href="/dashboard">Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </SignedIn>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link href="#tools">Explore Tools</Link>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Free tier</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Secure</span>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-y bg-muted/50">
        <div className="mx-auto max-w-2xl px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tools (e.g., Merge PDF, Compress)..." className="pl-12 h-14 text-base rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          {searchQuery && filteredTools.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-2">No tools found. Try a different search term.</p>
          )}
        </div>
      </section>

      <section id="tools" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Popular Tools</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">Our most-used tools, ready when you are.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredTools.map((tool, idx) => (
              <motion.div key={tool.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -4 }}>
                <Link href={tool.href}>
                  <Card className="h-full group cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-3">
                      <div className={cn("rounded-xl p-3", tool.bg)}><tool.icon className={cn("h-6 w-6", tool.color)} /></div>
                      <span className="text-sm font-medium">{tool.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Tool Categories</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <FadeIn key={cat.title} delay={idx * 0.05}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className={cn("rounded-xl p-3 w-fit", cat.bg)}><cat.icon className={cn("h-6 w-6", cat.color)} /></div>
                    <CardTitle className="text-lg mt-2">{cat.title}</CardTitle>
                    <CardDescription>{cat.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why MaxTools?</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <FadeIn key={feat.title} delay={idx * 0.05}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="rounded-xl p-3 w-fit bg-primary/10"><feat.icon className="h-6 w-6 text-primary" /></div>
                    <CardTitle className="text-lg mt-2">{feat.title}</CardTitle>
                    <CardDescription>{feat.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Activity, target: 10, suffix: "M+", label: "Files Processed" },
              { icon: Box, target: 50, suffix: "+", label: "Tools" },
              { icon: Clock, target: 99, suffix: "%", label: "Uptime" },
              { icon: Users, target: 100, suffix: "K+", label: "Users" },
            ].map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <div className="mt-1 flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
                  <stat.icon className="h-4 w-4" />{stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple Pricing</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <FadeIn key={plan.name} delay={idx * 0.1}>
                <Card className={cn("relative flex flex-col h-full", plan.popular && "border-primary shadow-lg shadow-primary/10")}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="px-4 py-1">Most Popular</Badge></div>}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2"><span className="text-4xl font-bold">{plan.price}</span><span className="text-muted-foreground text-sm">/month</span></div>
                    <CardDescription className="mt-2">{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />{feat}
                        </li>
                      ))}
                    </ul>
                    {plan.name === "Business" ? (
                      <Button className="mt-6 w-full" variant="outline" asChild>
                        <Link href="/contact">{plan.cta}</Link>
                      </Button>
                    ) : (
                      <>
                        <SignedOut>
                          <SignUpButton mode="modal">
                            <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                          </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                          <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"} asChild>
                            <Link href="/dashboard">{plan.cta}</Link>
                          </Button>
                        </SignedIn>
                      </>
                    )}
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What Our Users Say</h2>
          </FadeIn>
          <FadeIn>
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <Quote className="h-8 w-8 text-primary/30 mx-auto mb-6" />
                <AnimatePresence mode="wait">
                  <motion.div key={testimonialIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">&ldquo;{testimonials[testimonialIdx].content}&rdquo;</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <Avatar><AvatarFallback>{testimonials[testimonialIdx].avatar}</AvatarFallback></Avatar>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{testimonials[testimonialIdx].name}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[testimonialIdx].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center justify-center gap-2 mt-8">
                  {testimonials.map((_, idx) => (
                    <button key={idx} onClick={() => setTestimonialIdx(idx)} className={cn("h-2 w-2 rounded-full transition-all", idx === testimonialIdx ? "bg-primary w-6" : "bg-primary/30")} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </FadeIn>
          <FadeIn>
            <Card>
              <CardContent className="p-6 sm:p-8">
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} open={openFaq === faq.q} onToggle={() => setOpenFaq(openFaq === faq.q ? null : faq.q)} />
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to Supercharge Your Workflow?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">Join 100,000+ professionals who trust MaxTools for their document needs.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" variant="secondary" className="text-base px-8 gap-2" asChild>
                  <Link href="/dashboard">Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </SignedIn>
              <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
