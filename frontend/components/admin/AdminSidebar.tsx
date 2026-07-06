'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Receipt,
  Package,
  Settings,
  LogOut,
  Wrench,
  ChevronDown,
  Gift,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
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
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo } from '@/components/ui/logo'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { resolvePhotoUrl } from '@/lib/resolve-photo'

const mainMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Pelanggan',
    url: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Kendaraan',
    url: '/admin/vehicles',
    icon: Car,
  },
  {
    title: 'Mekanik',
    url: '/admin/mechanics',
    icon: Wrench,
  },
  {
    title: 'Manajemen Tim',
    url: '/admin/team',
    icon: ShieldCheck,
  },
  {
    title: 'Promo',
    url: '/admin/promo',
    icon: Gift,
  },
]

const transactionMenuItems = [
  {
    title: 'SPK',
    url: '/admin/spk',
    icon: FileText,
  },
  {
    title: 'Invoice & Pembayaran',
    icon: Receipt,
    items: [
      { title: 'Daftar Invoice', url: '/admin/invoices' },
      { title: 'Riwayat Pembayaran', url: '/admin/payments' },
    ],
  },
]

const inventoryMenuItems = [
  {
    title: 'Sparepart',
    url: '/admin/spareparts',
    icon: Package,
  },
  {
    title: 'Jasa Servis',
    url: '/admin/services',
    icon: Wrench,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fetch fresh profile from API
  const { data: profileData } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Admin"
  const initials = displayName.substring(0, 2).toUpperCase()

  const isActive = (url: string) => {
    if (url === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(url)
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border bg-[#0A0A0B] overflow-x-hidden">
      <SidebarHeader className="p-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <Logo subtitle="System" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4 px-2">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-data-[collapsible=icon]:hidden">
            CORE CONTROL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-300 group/btn px-4 h-10 rounded-xl",
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "size-5 transition-all", 
                        isActive(item.url) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Transactions */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-data-[collapsible=icon]:hidden">
            OPERATIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {transactionMenuItems.map((item) => {
                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url!)}
                        tooltip={item.title}
                        className={cn(
                          "relative transition-all duration-300 group/btn px-4 h-10 rounded-xl",
                          isActive(item.url!) 
                            ? "bg-primary/10 text-primary" 
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.url!} className="flex items-center gap-4">
                          <item.icon className={cn(
                            "size-5 transition-all", 
                            isActive(item.url!) ? "text-primary scale-110" : "group-hover/btn:text-white"
                          )} />
                          <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                          {isActive(item.url!) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const hasActiveChild = item.items.some(sub => isActive(sub.url))

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} className="group/btn text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-300 px-4 h-10 rounded-xl">
                          <item.icon className="size-5 transition-colors group-hover/btn:text-white" />
                          <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-white/5 ml-6 pl-3 space-y-0.5 mt-1 mb-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isActive(subItem.url)}
                                className={cn(
                                  "transition-all h-9 rounded-xl px-4",
                                  isActive(subItem.url) 
                                    ? "text-primary bg-primary/5" 
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                )}
                              >
                                <Link href={subItem.url}>
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

        {/* Inventory */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 group-data-[collapsible=icon]:hidden">
            RESOURCES
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {inventoryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-300 group/btn px-4 h-10 rounded-xl",
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-4">
                      <item.icon className={cn(
                        "size-5 transition-all", 
                        isActive(item.url) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-black text-xs uppercase tracking-widest">{item.title}</span>
                      {isActive(item.url) && (
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
