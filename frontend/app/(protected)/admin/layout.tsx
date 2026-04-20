import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ChatBot } from "@/components/admin/chatbot"

export const metadata = {
  title: "AutoServis - Admin Dashboard",
  description: "Sistem manajemen bengkel otomotif",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
        <ChatBot />
      </SidebarInset>
    </SidebarProvider>
  )
}
