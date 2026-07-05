"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, Package, History, User, Wrench, Bell, ChevronLeft, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/mekanik" },
  { icon: ClipboardList, label: "Jobs", href: "/mekanik/jobs" },
  { icon: Package, label: "Parts", href: "/mekanik/parts-request" },
  { icon: History, label: "History", href: "/mekanik/history" },
  { icon: User, label: "Profile", href: "/mekanik/profile" },
]

import { useAuth } from "@/context/AuthContext"
import { useUI } from "@/context/UIContext"
import { ChatBot } from "@/components/admin/chatbot"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

function MekanikHeader() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { toggleChat, selectedDate, setSelectedDate } = useUI()
  const isSubPage = pathname.split("/").filter(Boolean).length > 2

  const getTitle = () => {
    if (pathname === "/mekanik") return "Dashboard"
    if (pathname.includes("/inspection")) return "Pemeriksaan"
    if (pathname.match(/\/jobs\/[^/]+$/)) return "Detail SPK"
    if (pathname.includes("/jobs")) return "Daftar SPK"
    if (pathname.includes("/parts-request")) return "Permintaan Parts"
    if (pathname.includes("/history")) return "Riwayat"
    if (pathname.includes("/settings")) return "Pengaturan"
    if (pathname.includes("/certifications")) return "Sertifikasi"
    if (pathname.includes("/promo")) return "Daftar Promo"
    if (pathname.includes("/profile")) return "Profil"
    return "AutoServis"
  }

  return (
    <header className="z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 h-14 flex items-center justify-between px-5 shadow-sm dark:shadow-xl transition-colors duration-300 shrink-0">
      <div className="flex items-center gap-4">
        {isSubPage ? (
          <Link href="/mekanik" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all duration-300 active:scale-95 group">
            <ChevronLeft className="h-5 w-5 text-primary group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div className="flex items-center gap-2.5">
            <Logo iconSize={20} textSize="text-xs" subtitle="MEKANIK" className="gap-2" />
            <div className="h-5 w-[1px] bg-slate-200 dark:bg-white/10 ml-1 hidden sm:block" />
          </div>
        )}
        
        {pathname === "/mekanik" ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all outline-none" suppressHydrationWarning>
                <h1 className="font-extrabold text-[15px] tracking-[0.05em] uppercase italic text-slate-900 dark:text-zinc-100 transition-colors duration-300">
                  {selectedDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </h1>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <h1 className="font-extrabold text-[15px] tracking-[0.05em] uppercase italic text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 transition-colors duration-300">
            {getTitle()}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => toggleChat()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl relative group transition-all duration-300 active:scale-95"
        >
          <Bot className="h-5 w-5 text-slate-500 dark:text-zinc-400 group-hover:text-primary transition-colors" />
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl relative group transition-all duration-300 active:scale-95">
          <Bell className="h-5 w-5 text-slate-500 dark:text-zinc-400 group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-white dark:ring-black shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        </button>
        <Link href="/mekanik/profile" className="active:scale-95 transition-transform">
          <Avatar className="h-9 w-9 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
            <AvatarImage src={resolvePhotoUrl(user?.photoUrl)} alt={user?.name} className="object-cover" />
            <AvatarFallback className="bg-slate-100 dark:bg-zinc-900 text-[10px] font-black text-slate-700 dark:text-zinc-300 uppercase tracking-widest">
              {user?.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2) || "MK"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}

function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/mekanik") return pathname === "/mekanik"
    return pathname.startsWith(href)
  }

  return (
    <nav className="z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-3xl border-t border-slate-200 dark:border-white/5 h-14 px-4 relative transition-colors duration-300 shrink-0 pb-safe">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
      <div className="flex items-center justify-between h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative group outline-none active:scale-90",
                active ? "text-primary" : "text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              )}
            >
              {active && (
                <>
                  <div className="absolute top-0 w-12 h-0.5 bg-primary rounded-b-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                </>
              )}
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-500", 
                  active ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.4)] dark:drop-shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "group-hover:scale-110 group-active:scale-95"
                )} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-[0.05em] transition-all duration-300",
                active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}


export default function MekanikLayout({ children }: { children: React.ReactNode }) {
  const { isChatOpen, closeChat } = useUI()
  
  return (
    <div className="h-[100dvh] bg-slate-100 dark:bg-black relative selection:bg-primary/30 selection:text-primary overflow-hidden transition-colors duration-300">
      {/* Precision Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-[100%] blur-[120px] opacity-60 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-md mx-auto border-x border-slate-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/40 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors duration-300">
        <MekanikHeader />
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pt-3 pb-6 px-3">
          {children}
        </main>
        <ChatBot isOpen={isChatOpen} onClose={closeChat} />
        <BottomNav />
      </div>
    </div>
  )
}