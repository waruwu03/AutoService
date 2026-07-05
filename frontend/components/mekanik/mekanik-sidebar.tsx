"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  History,
  UserCircle,
  LogOut,
  Gift,
  ChevronUp,
  User,
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
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { Logo } from "@/components/ui/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { resolvePhotoUrl } from "@/lib/resolve-photo"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/mekanik", icon: LayoutDashboard },
  { title: "Daftar SPK", href: "/mekanik/jobs", icon: ClipboardList },
  { title: "Permintaan Parts", href: "/mekanik/parts-request", icon: Package },
  { title: "Riwayat", href: "/mekanik/history", icon: History },
  { title: "Profil", href: "/mekanik/profile", icon: UserCircle },
  { title: "Promo", href: "/admin/promo", icon: Gift },
]

export function MekanikSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fetch fresh profile from API
  const { data: profileData } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Mekanik"
  const initials = displayName.substring(0, 2).toUpperCase()

  const isActive = (href: string) => {
    return pathname === href || (href !== "/mekanik" && pathname.startsWith(href))
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border bg-[#0A0A0B] overflow-x-hidden">
      <SidebarHeader className="p-6">
        <Link href="/mekanik" className="flex items-center gap-3 group">
          <Logo subtitle="Mekanik" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-data-[collapsible=icon]:hidden">
            TASK CONTROL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-300 group/btn px-4 h-10 rounded-xl",
                      isActive(item.href) 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "size-5 transition-all", 
                        isActive(item.href) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


    </Sidebar>
  )
}
