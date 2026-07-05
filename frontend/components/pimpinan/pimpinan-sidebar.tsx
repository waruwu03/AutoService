"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Settings,
  LogOut,
  ChevronDown,
  User,
  Settings as SettingsIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/context/AuthContext"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

const navItems = [
  { title: "Dashboard", href: "/pimpinan", icon: LayoutDashboard },
  { title: "Approval", href: "/pimpinan/approvals", icon: CheckSquare },
  {
    title: "Laporan",
    href: "/pimpinan/reports",
    icon: BarChart3,
    items: [
      { title: "Laporan Inventory", href: "/pimpinan/reports/inventory" },
      { title: "Laporan Mekanik", href: "/pimpinan/reports/mekanik" },
      { title: "Laporan Pendapatan", href: "/pimpinan/reports/pendapatan" },
    ]
  },
  { title: "Pengaturan", href: "/pimpinan/settings", icon: Settings },
]

export function PimpinanSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fetch fresh profile from API
  const { data: profileData } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Pimpinan"
  const initials = displayName.substring(0, 2).toUpperCase()

  const isActive = (href: string) => {
    if (href === "/pimpinan") return pathname === "/pimpinan"
    return pathname.startsWith(href)
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border bg-[#0A0A0B] overflow-x-hidden">
      <SidebarHeader className="p-6">
        <Link href="/pimpinan" className="flex items-center gap-3 group">
          <Logo subtitle="Executive" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-data-[collapsible=icon]:hidden">
            EXECUTIVE CONTROL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                if (!item.items) {
                  return (
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
                  )
                }

                const hasActiveChild = item.items.some(sub => pathname === sub.href)

                return (
                  <Collapsible
                    key={item.href}
                    asChild
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "group/btn transition-all duration-300 px-4 h-10 rounded-xl",
                            hasActiveChild
                              ? "bg-primary/10 text-primary"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <item.icon className={cn(
                            "size-5 transition-all",
                            hasActiveChild ? "text-primary" : "group-hover/btn:text-white"
                          )} />
                          <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-white/5 ml-6 pl-3 space-y-0.5 mt-1 mb-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                                className={cn(
                                  "transition-all h-9 rounded-xl px-4",
                                  pathname === subItem.href
                                    ? "text-primary bg-primary/5"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                )}
                              >
                                <Link href={subItem.href}>
                                  <span className="text-[11px] font-black uppercase tracking-widest">{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


    </Sidebar>
  )
}
