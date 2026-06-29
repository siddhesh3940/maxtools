import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/providers/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MaxTools — The Ultimate PDF & File Toolkit",
  description:
    "Convert, edit, merge, split, and manage your PDFs and files online. Powerful tools for professionals.",
  keywords: ["PDF", "file converter", "PDF tools", "online PDF editor", "MaxTools"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("theme")||"system";var r=t==="system"?(window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):t;document.documentElement.classList.toggle("dark",r==="dark")}catch(e){}})()`
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}