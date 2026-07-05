"use client"

import { useTheme } from "next-themes"
import { Bell, Search, Calendar, ChevronDown, Moon, Sun, CheckCircle2, AlertCircle, Info, Package } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api, fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { toast } from "sonner"
import { Loader2, Bot } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as localeID } from "date-fns/locale"
import { useUI } from "@/context/UIContext"
import { useSocketNotifications } from "@/hooks/useSocketNotifications"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001"

function resolvePhotoUrl(photoUrl?: string | null): string | undefined {
  if (!photoUrl) return undefined
  if (photoUrl.startsWith("http")) return photoUrl
  if (photoUrl.startsWith("local:")) {
    const key = photoUrl.replace("local:", "")
    return `${BACKEND_URL}/api/v1/uploads/${key}`
  }
  
  const bucketName = "autoservis"
  const minioUrl = "http://localhost:9000"
  
  try {
    const url = new URL(BACKEND_URL)
    return `http://${url.hostname}:9000/${bucketName}/${photoUrl}`
  } catch {
    return `${minioUrl}/${bucketName}/${photoUrl}`
  }
}

interface AdminHeaderProps {
  title?: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, logout, refreshUser } = useAuth()
  const { toggleChat } = useUI()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { data: profileData, mutate: mutateProfile } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user
  
  const { data: notifications, mutate: mutateNotifications } = useSWR("/notifications", fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  })
  useSocketNotifications(mutateNotifications)
  
  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0

  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const displayPhoto = resolvePhotoUrl(profile?.photoUrl || user?.photoUrl)
  const displayName = profile?.name || user?.name || "Admin"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      mutateNotifications()
    } catch (error) {
      console.error("Failed to mark as read", error)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      await api.put("/auth/profile", formData, { headers: { "Content-Type": "multipart/form-data" } })
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

  const handleEditName = async () => {
    const newName = window.prompt("Masukkan nama profil baru:", displayName)
    if (newName && newName.trim() !== "" && newName !== displayName) {
      try {
        await api.put("/auth/profile", { name: newName.trim() })
        await refreshUser()
        await mutateProfile()
        toast.success("Nama profil diperbarui")
      } catch {
        toast.error("Gagal memperbarui nama profil")
      }
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return <AlertCircle className="size-4 text-red-500" />
      case 'PAYMENT_RECEIVED': return <CheckCircle2 className="size-4 text-green-500" />
      case 'WORK_ORDER_UPDATE': return <Package className="size-4 text-blue-500" />
      default: return <Info className="size-4 text-slate-400" />
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-6 transition-all duration-300">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-slate-500 hover:text-primary transition-all hover:scale-110" />
        <Separator orientation="vertical" className="h-6 mx-2 bg-slate-200 dark:bg-white/10" />
      </div>

      {title && (
        <div className="flex flex-col ml-2">
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">{title}</h1>
          {description && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{description}</p>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden lg:flex items-center group">
          <Search className="absolute left-4 size-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="h-11 w-72 rounded-2xl border border-slate-200 bg-slate-100/50 dark:bg-white/5 dark:border-white/10 pl-11 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all focus:w-80"
          />
        </form>

        <div className="hidden md:flex items-center gap-2">
          {/* AI Chat */}
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20 group"
            onClick={() => toggleChat()}
          >
            <Bot className="size-5 group-hover:scale-110 transition-transform" />
            <span className="sr-only">AI Assistant</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-transparent"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="size-5 dark:hidden text-slate-700" />
            <Moon className="size-5 hidden dark:block text-slate-300" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-transparent">
                <Bell className="size-5 text-slate-700 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex size-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-4 bg-rose-500 text-[9px] font-black items-center justify-center text-white border border-white dark:border-zinc-950">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-zinc-950">
              <div className="bg-[#0A0A0B] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">Notifications</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{unreadCount} UNREAD MESSAGES</p>
                </div>
                <Bell className="size-5 text-primary opacity-50" />
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={`flex flex-col items-start gap-2 p-4 cursor-pointer rounded-2xl transition-all mb-1 ${!notif.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="size-8 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-slate-100 dark:border-white/5">
                           {getNotificationIcon(notif.type)}
                        </div>
                        <span className="font-black flex-1 text-xs uppercase tracking-tight">{notif.title}</span>
                        {!notif.isRead && <div className="size-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed ml-11">{notif.message}</p>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-11 mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: localeID })}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="size-8 text-slate-200 dark:text-white/5 mx-auto mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System clear</p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-8 hidden md:block bg-slate-200 dark:bg-white/10" />

        {/* User Profile */}
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
                      <AvatarFallback className="bg-primary text-black font-black text-xs">{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 shadow-sm" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1.5">{displayName}</span>
                <Badge className="w-fit bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md leading-none">{user?.role || "ADMIN"}</Badge>
              </div>
              <ChevronDown className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-[2rem] border-none shadow-2xl bg-white dark:bg-zinc-950">
            <div className="p-4 mb-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
               <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-2" />
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">
              Upload New Photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditName} className="cursor-pointer h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">
              Rename Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-2" />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
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
