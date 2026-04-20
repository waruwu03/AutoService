import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MekanikSidebar } from "@/components/mekanik/mekanik-sidebar"

export const metadata = {
  title: "AutoServis - Mekanik Dashboard",
  description: "Dashboard mekanik bengkel otomotif",
}

export default function MekanikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <MekanikSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
