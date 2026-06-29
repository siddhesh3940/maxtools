import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold">
            MaxTools
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </nav>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} MaxTools. All rights reserved.
        </div>
        <div className="mt-1 text-center text-xs text-muted-foreground/50">
          by Siddhesh Vaishnav
        </div>
      </div>
    </footer>
  )
}
