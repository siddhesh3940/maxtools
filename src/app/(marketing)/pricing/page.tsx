"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const plans = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    desc: "Perfect for getting started",
    features: {
      "Files per day": "5",
      "Max file size": "10MB",
      "PDF Tools": true,
      "Conversion Tools": true,
      "Image Tools": true,
      "AI Tools": false,
      "Print Production": false,
      "Batch Processing": false,
      "API Access": false,
      "Priority Support": false,
      "Team Collaboration": false,
      "Custom Workflows": false,
    },
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "$12",
    yearlyPrice: "$10",
    desc: "For professionals and power users",
    features: {
      "Files per day": "Unlimited",
      "Max file size": "500MB",
      "PDF Tools": true,
      "Conversion Tools": true,
      "Image Tools": true,
      "AI Tools": true,
      "Print Production": true,
      "Batch Processing": true,
      "API Access": true,
      "Priority Support": true,
      "Team Collaboration": false,
      "Custom Workflows": false,
    },
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    monthlyPrice: "$49",
    yearlyPrice: "$41",
    desc: "For teams and organizations",
    features: {
      "Files per day": "Unlimited",
      "Max file size": "2GB",
      "PDF Tools": true,
      "Conversion Tools": true,
      "Image Tools": true,
      "AI Tools": true,
      "Print Production": true,
      "Batch Processing": true,
      "API Access": true,
      "Priority Support": true,
      "Team Collaboration": true,
      "Custom Workflows": true,
    },
    cta: "Contact Sales",
    popular: false,
  },
]

const featureLabels = Object.keys(plans[0].features)

export default function PricingPage() {
  const [yearly, setYearly] = React.useState(false)

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
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Simple, transparent pricing. No hidden fees. Upgrade or cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={cn("text-sm", !yearly && "font-medium")}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={cn("text-sm", yearly && "font-medium")}>
              Yearly <span className="text-green-500 font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={cn(
                  "relative flex flex-col h-full",
                  plan.popular && "border-primary shadow-lg shadow-primary/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">
                      {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                    {yearly && plan.name !== "Free" && (
                      <div className="text-xs text-green-500 mt-1">
                        ${parseInt(plan.yearlyPrice.slice(1)) * 12}/year
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-2">{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {featureLabels.map((label) => {
                      const value = plan.features[label as keyof typeof plan.features]
                      return (
                        <li key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                            )
                          ) : (
                            <span className="font-medium">{value}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  <Button
                    className={cn("mt-6 w-full")}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.name === "Business" ? "/contact" : "/pricing"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Need a custom plan?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
      <Footer />
    </div>
  )
}
