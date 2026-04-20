"use client"

import { useTheme } from "next-themes"
import { Bell, Moon, Sun, Sparkles } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface MekanikHeaderProps {
  title?: string
  description?: string
}

export function MekanikHeader({ title, description }: MekanikHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 hover:bg-slate-100 p-2 rounded-lg transition-colors" />
        <Separator orientation="vertical" className="h-6 bg-slate-200" />

        {title && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
            {description && (
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* Status Indicator - Optional premium touch */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold mr-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl size-9 hover:bg-slate-50 transition-colors"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-[18px] dark:hidden text-slate-600" />
          <Moon className="size-[18px] hidden dark:block text-slate-300" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-xl size-9 hover:bg-slate-50 transition-colors">
          <Bell className="size-[18px] text-slate-600" />
          <Badge
            className="absolute top-1.5 right-1.5 size-4 rounded-full p-0 flex items-center justify-center bg-amber-500 text-slate-900 border-2 border-white font-bold text-[9px]"
          >
            2
          </Badge>
        </Button>
        
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="size-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <Sparkles className="size-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
