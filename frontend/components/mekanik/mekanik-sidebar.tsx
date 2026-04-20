"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  History,
  UserCircle,
  Wrench,
  Settings,
  LogOut
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", href: "/mekanik", icon: LayoutDashboard },
  { title: "Daftar SPK", href: "/mekanik/jobs", icon: ClipboardList },
  { title: "Permintaan Parts", href: "/mekanik/parts-request", icon: Package },
  { title: "Riwayat", href: "/mekanik/history", icon: History },
  { title: "Profil", href: "/mekanik/profile", icon: UserCircle },
]

export function MekanikSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/mekanik" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-8 shrink-0">
            <Settings className="absolute size-8 text-[#FFC107]" />
            <Wrench className="absolute size-[14px] text-white -rotate-45" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-[17px] font-bold leading-tight">
              <span className="text-white">AUTO </span>
              <span className="text-[#FFC107]">SERVICE</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase leading-none mt-0.5">Mekanik</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/mekanik" && pathname.startsWith(item.href))}
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
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2 flex flex-col gap-2">
        <div className="rounded-xl border border-slate-800 p-3 text-white relative overflow-hidden group-data-[collapsible=icon]:hidden bg-slate-950 mt-auto">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="relative z-10">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Spesial Promo</p>
            <h4 className="font-bold text-[15px] leading-tight mb-1">DISKON SERVIS</h4>
            <div className="text-3xl font-extrabold text-[#FFC107] mb-1.5">20%</div>
            <p className="text-[10px] text-slate-300 mb-3 leading-tight">Berlaku sampai<br/>31 Mei 2024</p>
            <Link href="/admin/promo" className="block w-full bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold py-1.5 text-center rounded-lg text-xs transition-colors cursor-pointer">
              Lihat Promo
            </Link>
          </div>
        </div>

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
