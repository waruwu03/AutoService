"use client"

import { useTheme } from "next-themes"
import { Bell, Moon, Sun, ChevronDown, Loader2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { useSocketNotifications } from "@/hooks/useSocketNotifications"
import { useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api, fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { toast } from "sonner"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

interface MekanikHeaderProps {
  title?: string
  description?: string
}

export function MekanikHeader({ title, description }: MekanikHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch fresh profile
  const { data: profileData, mutate: mutateProfile } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const { data: notifications, mutate: mutateNotifications } = useSWR("/notifications", fetcher, {
    refreshInterval: 30000
  })
  useSocketNotifications(mutateNotifications)
  
  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Mekanik"
  const initials = displayName.substring(0, 2).toUpperCase()

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      await refreshUser()
      await mutateProfile()
      toast.success("Foto profil berhasil diperbarui!")
    } catch {
      toast.error("Gagal mengupload foto")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-6 transition-all duration-300">
      <SidebarTrigger className="-ml-1 text-slate-500 hover:text-primary transition-all hover:scale-110" />
      <Separator orientation="vertical" className="h-6 mx-2 bg-slate-200 dark:bg-white/10" />

      {title && (
        <div className="flex flex-col ml-2">
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">{title}</h1>
          {description && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{description}</p>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-6">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Mekanik Online
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-5 dark:hidden text-slate-700" />
            <Moon className="size-5 hidden dark:block text-slate-300" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative size-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <Bell className="size-5 text-slate-700 dark:text-slate-300" />
            <span className="absolute top-2 right-2 flex size-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-4 bg-amber-500 text-[9px] font-black items-center justify-center text-white border border-white dark:border-zinc-950">
                2
              </span>
            </span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 hidden md:block bg-slate-200 dark:bg-white/10" />

        {/* Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-2xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-white/5">
              <div className="relative">
                <Avatar className="size-10 rounded-xl border-2 border-white dark:border-zinc-900 shadow-md group-hover:scale-105 transition-transform">
                  {isUploading ? (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-zinc-900 rounded-xl">
                      <Loader2 className="size-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage src={displayPhoto} alt={displayName} className="object-cover" />
                      <AvatarFallback className="bg-primary text-black font-black text-xs">{initials}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 shadow-sm" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1.5">{displayName}</span>
                <Badge className="w-fit bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md leading-none">{user?.role || "MEKANIK"}</Badge>
              </div>
              <ChevronDown className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-[2rem] border-none shadow-2xl bg-white dark:bg-zinc-950">
            <DropdownMenuLabel className="p-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
               <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-2" />
            <DropdownMenuItem
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
            >
              Upload New Photo
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-2" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              Sign Out Securely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>
    </header>
  )
}
