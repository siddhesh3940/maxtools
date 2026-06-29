import { Providers } from "@/providers/providers"
import { MarketingLayout } from "@/components/layout/marketing-layout"

export default function MarketingRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <MarketingLayout>{children}</MarketingLayout>
    </Providers>
  )
}
