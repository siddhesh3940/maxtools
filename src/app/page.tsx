import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { POWER_TOOLS, PDF_TOOLS, CONVERSION_TOOLS } from "@/lib/constants"

const toolGroups = [
  { title: "Power Tools", tools: POWER_TOOLS, basePath: "" },
  { title: "Compress", tools: PDF_TOOLS.filter(t => t.category === 'COMPRESS'), basePath: "/pdf" },
  { title: "Merge & Split", tools: PDF_TOOLS.filter(t => t.category === 'MERGE_SPLIT'), basePath: "/pdf" },
  { title: "Convert", tools: CONVERSION_TOOLS, basePath: "/convert" },
  { title: "Edit & Sign", tools: PDF_TOOLS.filter(t => t.category === 'EDIT_SIGN'), basePath: "/pdf" },
  { title: "Security", tools: PDF_TOOLS.filter(t => t.category === 'SECURITY'), basePath: "/pdf" },
  { title: "Organize", tools: PDF_TOOLS.filter(t => t.category === 'ORGANIZE'), basePath: "/pdf" },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              MaxTools &mdash; The Ultimate PDF &amp; File Toolkit
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Merge, split, compress, convert, and manage your documents online.
              Powerful tools for professionals, with AI-powered features and batch processing.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Browse All Tools
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {toolGroups.map((group) => (
          <section key={group.title} className="border-b">
            <div className="mx-auto max-w-6xl px-4 py-16">
              <h2 className="text-2xl font-bold mb-6">{group.title}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.tools.map((tool) => {
                  const href = group.basePath ? `${group.basePath}/${tool.slug}` :
                    tool.slug === 'workflow-builder' ? '/workflow' :
                    tool.slug === 'batch-processing' ? '/batch' :
                    `/print/${tool.slug}`
                  return (
                    <Link key={tool.slug} href={href}
                      className="block rounded-lg border p-4 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        ))}

        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Why MaxTools?</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { title: "Fast Processing", desc: "Documents process in seconds, not minutes. No waiting in queues." },
                { title: "Secure", desc: "Files are encrypted and automatically deleted after processing." },
                { title: "Batch Processing", desc: "Process hundreds of files simultaneously with ease." },
                { title: "AI-Powered", desc: "Smart tools that understand and analyze your documents." },
                { title: "Professional Print", desc: "Advanced imposition tools for print production." },
                { title: "Workflow Automation", desc: "Chain multiple operations in automated workflows." },
              ].map((feat) => (
                <div key={feat.title}>
                  <h3 className="font-medium">{feat.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Built for Everyone</h2>
            <div className="grid sm:grid-cols-4 gap-8">
              {[
                { title: "Students", desc: "Merge lecture slides and compress assignments." },
                { title: "Professionals", desc: "Process confidential documents securely." },
                { title: "Print Shops", desc: "Professional imposition and booklet tools." },
                { title: "Developers", desc: "API access and workflow automation." },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
