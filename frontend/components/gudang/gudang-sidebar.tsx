"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  FileText,
  Settings,
  LogOut,
  Wrench,
  Boxes
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/gudang", icon: LayoutDashboard },
  { title: "Inventori", href: "/gudang/inventory", icon: Package },
  { title: "Validasi Nota", href: "/gudang/approvals", icon: ClipboardCheck },
  { title: "Pergerakan Stok", href: "/gudang/stock-movements", icon: ArrowLeftRight },
  { title: "Supplier", href: "/gudang/suppliers", icon: Truck },
  { title: "Laporan", href: "/gudang/reports", icon: FileText },
]

export function GudangSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/gudang" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-8 shrink-0">
            <Settings className="absolute size-8 text-[#FFC107]" />
            <Wrench className="absolute size-[14px] text-white -rotate-45" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-[17px] font-bold leading-tight">
              <span className="text-white">AUTO </span>
              <span className="text-[#FFC107]">SERVICE</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase leading-none mt-0.5">Gudang</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2 group-data-[collapsible=icon]:hidden">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/gudang" && pathname.startsWith(item.href))}
                    tooltip={item.title}
                    className="data-[active=true]:bg-[#FFC107] data-[active=true]:text-slate-900 data-[active=true]:font-bold transition-colors my-0.5 hover:bg-white/5 py-3.5 px-3 rounded-lg"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="size-[20px]" />
                      <span className="font-semibold text-[14px] tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 bg-white/10 my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2 group-data-[collapsible=icon]:hidden">Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-white/5 transition-colors text-sidebar-foreground py-3.5 px-3 rounded-lg" tooltip="Pengaturan">
                  <Link href="/gudang/settings" className="flex items-center gap-3">
                    <Settings className="size-[20px]" />
                    <span className="font-semibold text-[14px] tracking-wide">Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2 flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-white/5 transition-colors text-sidebar-foreground py-3.5 px-3 rounded-lg">
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="size-[20px]" />
                <span className="font-semibold text-[14px] tracking-wide">Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
