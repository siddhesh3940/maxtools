import { Providers } from "@/providers/providers"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  )
}
