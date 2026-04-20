import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { GudangSidebar } from "@/components/gudang/gudang-sidebar"

export const metadata = {
  title: "AutoServis - Gudang Dashboard",
  description: "Sistem manajemen gudang otomotif",
}

export default function GudangLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <GudangSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
