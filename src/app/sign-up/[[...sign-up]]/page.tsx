"use client"

import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <SignUp />
      </main>
      <Footer />
    </div>
  )
}
