import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PimpinanSidebar } from "@/components/pimpinan/pimpinan-sidebar"

export const metadata = {
  title: "AutoServis - Pimpinan Dashboard",
  description: "Dashboard pimpinan bengkel otomotif",
}

export default function PimpinanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PimpinanSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
