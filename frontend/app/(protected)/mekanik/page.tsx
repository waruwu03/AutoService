"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Loader2 } from "lucide-react"
import { ClipboardList, Package, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, Wrench, Car } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { User, Phone, Calendar, X } from "lucide-react"
import { PromoCarousel } from "@/components/admin/PromoCarousel"

const mockTodayJobs: any[] = []

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 4 && hour < 10) return "Selamat Pagi"
  if (hour >= 10 && hour < 15) return "Selamat Siang"
  if (hour >= 15 && hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

const statusConfig: Record<string, any> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20" },
  IN_PROGRESS: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20" },
  WAITING_PARTS: { label: "Tunggu Parts", className: "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20" },
  QUALITY_CHECK: { label: "Cek Kualitas", className: "bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20" },
  COMPLETED: { label: "Selesai", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20" },
}

const priorityConfig: Record<string, any> = {
  LOW: { label: "Low", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  NORMAL: { label: "Normal", className: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  HIGH: { label: "High", className: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
}


export default function MekanikDashboard() {
  const [greeting, setGreeting] = useState("")
  const { user } = useAuth()
  const { selectedDate } = useUI()
  
  const mechanicName = user?.name || "Mekanik"
  const firstName = mechanicName.split(' ')[0]
  const lastName = mechanicName.split(' ').slice(1).join(' ')
  
  // Format date for API (YYYY-MM-DD)
  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const { data: woData, isLoading } = useSWR(
    user ? `/work-orders?assignedMechanicId=${user.id}&date=${dateStr}&limit=10&sortBy=createdAt&sortOrder=desc` : null, 
    fetcher
  )
  
  const jobs = woData?.data || mockTodayJobs

  const stats = {
    pending: jobs.filter((j: any) => j.status === 'PENDING').length,
    inProgress: jobs.filter((j: any) => j.status === 'IN_PROGRESS' || j.status === 'WAITING_PARTS').length,
    completed: jobs.filter((j: any) => j.status === 'COMPLETED' || j.status === 'INVOICED').length,
  }

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <div className="space-y-5">
      {/* Greeting Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-[2rem] blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 overflow-hidden relative rounded-[2rem] shadow-xl shadow-primary/20 transition-all duration-500">
          {/* Animated Background Elements */}
          <div className="absolute -top-12 -right-4 p-8 opacity-[0.15] group-hover:opacity-[0.25] transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 transform-gpu mix-blend-overlay pointer-events-none">
            <Wrench className="h-48 w-48 text-white" />
          </div>
          
          {/* Glass Gradients */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-black/10 rounded-full blur-[60px] pointer-events-none" />
          
          <CardContent className="pt-8 pb-8 px-7 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-pulse" />
              <p className="text-white/90 text-[11px] font-black tracking-[0.3em] uppercase drop-shadow-sm">{greeting || "Selamat Datang"},</p>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-[2.5rem] font-black tracking-tighter text-white uppercase italic leading-none flex flex-wrap gap-x-3 drop-shadow-md">
                <span>{firstName}</span>
                <span className="text-white/70 font-medium">{lastName}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="h-[2px] w-12 bg-white/30 rounded-full" />
              <p className="text-white/70 text-[10px] font-bold tracking-[0.25em] uppercase">Professional Dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PromoCarousel viewAllHref="/mekanik/promo" />


      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: stats.pending, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "Progres", value: stats.inProgress, icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { label: "Selesai", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        ].map((item) => (
          <Card key={item.label} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 rounded-2xl shadow-sm dark:shadow-none group">
            <CardContent className="p-3 text-center">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center mx-auto mb-1.5 border transition-all duration-500 group-hover:scale-110", item.bg, item.border)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-zinc-100">{item.value}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-0.5">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 px-0.5">
        <Link href="/mekanik/jobs" className="outline-none group active:scale-[0.98] transition-transform">
          <Card className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border-slate-200 dark:border-white/5 hover:border-primary/40 dark:hover:border-primary/40 hover:bg-white dark:hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden rounded-2xl h-full shadow-sm dark:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-3.5 flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300 shrink-0">
                <ClipboardList className="h-5 w-5 text-slate-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
              </div>
              <div>
                <p className="font-black text-[12px] uppercase tracking-wider text-slate-700 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">Daftar SPK</p>
                <p className="text-[8px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest mt-0.5">Buka Tugas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mekanik/parts-request" className="outline-none group active:scale-[0.98] transition-transform">
          <Card className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-md border-slate-200 dark:border-white/5 hover:border-primary/40 dark:hover:border-primary/40 hover:bg-white dark:hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden rounded-2xl h-full shadow-sm dark:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-3.5 flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300 shrink-0">
                <Package className="h-5 w-5 text-slate-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
              </div>
              <div>
                <p className="font-black text-[12px] uppercase tracking-wider text-slate-700 dark:text-zinc-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">Request Parts</p>
                <p className="text-[8px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest mt-0.5">Pengajuan</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Today Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black italic uppercase tracking-widest text-sm flex items-center gap-2 text-slate-800 dark:text-zinc-200 transition-colors duration-300">
            <Clock className="h-4 w-4 text-primary" />
            Pekerjaan Hari Ini
          </h3>
          <Link href="/mekanik/jobs" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all outline-none">
            Lihat Semua <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-slate-400 dark:text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/60 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <ClipboardList className="h-10 w-10 text-slate-300 dark:text-zinc-600 mb-3" />
              <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Tidak ada SPK aktif</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-widest font-black">Pekerjaan Kosong</p>
            </div>
          ) : (
            jobs.map((job: any) => (
            <Sheet key={job.id}>
              <SheetTrigger asChild>
                <div className="block outline-none group cursor-pointer">
                  <Card className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border-slate-200 dark:border-white/5 hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 overflow-hidden rounded-[24px] shadow-sm hover:shadow-xl group">
                    <CardContent className="p-0 relative">
                      <div className="flex">
                        <div className="w-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                        <div className="flex-1 p-4">
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              {job.orderNumber || job.spkNumber}
                            </span>
                            <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest border-0", priorityConfig[job.priority || 'NORMAL']?.className)}>
                              {priorityConfig[job.priority || 'NORMAL']?.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-black/40 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5">
                              <Car className="h-4.5 w-4.5 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight truncate leading-tight">
                                {job.vehicle?.brand} {job.vehicle?.model}
                              </p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{job.vehicle?.licensePlate || job.vehicle?.plateNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[150px]">
                              {job.customerComplaints || job.serviceType || 'Cek Kendaraan'}
                            </p>
                            <Badge variant="outline" className={cn("text-[9px] font-black uppercase italic border-0", statusConfig[job.status]?.className || statusConfig['PENDING'].className)}>
                              {statusConfig[job.status]?.label || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[92vh] bg-white dark:bg-zinc-950 border-x border-t border-slate-200 dark:border-white/10 rounded-t-[40px] p-0 overflow-hidden max-w-md mx-auto inset-x-0 outline-none">
                <div className="h-full flex flex-col">
                  <div className="w-16 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mt-5 mb-2 shadow-inner" />
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4 space-y-7 custom-scrollbar">
                    <SheetHeader className="text-left space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Workshop Task Order</span>
                            <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none flex items-center gap-3">
                              {job.orderNumber || job.spkNumber}
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            </SheetTitle>
                         </div>
                         <Badge variant="outline" className={cn("text-[11px] font-black uppercase italic border-0 px-4 h-8 flex items-center shadow-[inset_0_1px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_10px_rgba(0,0,0,0.5)]", statusConfig[job.status]?.className || statusConfig['PENDING'].className)}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50" />
                            {statusConfig[job.status]?.label || 'Pending'}
                         </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest border-y border-slate-200 dark:border-white/5 py-3">
                         <span className="flex items-center gap-1.5" suppressHydrationWarning><Clock className="h-3 w-3" /> {new Date(job.createdAt || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                         <span className="h-3 w-px bg-slate-200 dark:bg-white/10" />
                         <span className="flex items-center gap-1.5" suppressHydrationWarning><Calendar className="h-3 w-3" /> {new Date(job.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </SheetHeader>

                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2">
                          <User className="h-3 w-3 text-primary" /> Informasi Pemilik
                        </h4>
                        <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-white/5 p-5 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xl font-black text-slate-900 dark:text-zinc-100 uppercase italic tracking-tight">{job.customer?.name || job.customer}</p>
                            <p className="text-xs font-mono text-slate-500 dark:text-zinc-400 flex items-center gap-2">{job.customer?.phone || '0812-3456-7890'}</p>
                          </div>
                          <a href={`tel:${job.customer?.phone || '081234567890'}`}>
                            <Button size="icon" variant="outline" className="rounded-xl bg-white dark:bg-zinc-950 border-slate-200 dark:border-white/10 text-primary">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2">
                          <Car className="h-3 w-3 text-primary" /> Spesifikasi Unit
                        </h4>
                        <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-white/5 p-3 grid grid-cols-2 xs:grid-cols-3 gap-2">
                          <div className="bg-white dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                            <p className="text-[8px] text-slate-500 dark:text-zinc-500 font-bold uppercase mb-0.5">Merk/Model</p>
                            <p className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase">{job.vehicle?.brand} {job.vehicle?.model}</p>
                          </div>
                          <div className="bg-white dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                            <p className="text-[8px] text-slate-500 dark:text-zinc-500 font-bold uppercase mb-0.5">Plat Nomor</p>
                            <p className="text-[11px] font-black text-primary font-mono">{job.vehicle?.licensePlate || job.vehicle?.plateNumber}</p>
                          </div>
                          <div className="bg-white dark:bg-black/40 rounded-xl p-3 border border-slate-200 dark:border-white/5 col-span-2 xs:col-span-1">
                            <p className="text-[8px] text-slate-500 dark:text-zinc-500 font-bold uppercase mb-0.5">Tahun</p>
                            <p className="text-[11px] font-black text-slate-800 dark:text-zinc-200">{job.vehicle?.year || '2020'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2">
                          <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
                        </h4>
                        <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden">
                          <div className="bg-primary/10 px-5 py-3 border-b border-primary/10 dark:border-white/5">
                            <span className="text-xs font-black text-primary uppercase italic">{job.serviceType || 'Servis Kendaraan'}</span>
                          </div>
                          <div className="p-5">
                            <div className="bg-white dark:bg-black/30 rounded-2xl p-4 border border-slate-200 dark:border-white/5 border-dashed">
                              <p className="text-sm text-slate-700 dark:text-zinc-300 italic font-medium leading-relaxed">
                                &ldquo;{job.customerComplaints || 'Tidak ada keluhan tertulis, periksa secara menyeluruh.'}&rdquo;
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-white/10 p-6 flex items-center gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
                    <SheetTrigger asChild>
                       <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-500">
                          <X className="h-5 w-5" />
                       </Button>
                    </SheetTrigger>
                    <Link href={`/mekanik/jobs/${job.id}`} className="flex-1">
                      <Button className="w-full bg-primary text-white dark:text-black font-black uppercase text-sm tracking-[0.15em] h-14 shadow-[0_4px_25px_rgba(var(--primary),0.3)] rounded-2xl">
                         PREPARE WORKSPACE <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            ))
          )}
        </div>
      </div>

      {/* Rating Widget */}
      <Link href="/mekanik/profile" className="block outline-none">
        <Card className="bg-primary border-0 overflow-hidden relative group cursor-pointer rounded-xl shadow-[0_4px_12px_-4px_rgba(var(--primary),0.5)] hover:-translate-y-0.5 transition-transform duration-300 active:scale-[0.98]">
          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <CardContent className="p-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/10 dark:bg-black/15 flex items-center justify-center border border-white/20 dark:border-black/10 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Star className="h-3.5 w-3.5 text-white dark:text-black fill-white dark:fill-black" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-white/80 dark:text-black/70 leading-none mb-0.5">Rating</p>
                <span className="text-lg font-black italic text-white dark:text-black leading-none drop-shadow-sm">{user?.rating || "5.0"}</span>
              </div>
            </div>
            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/5 group-hover:bg-white/20 dark:group-hover:bg-black/10 transition-colors duration-300 shrink-0">
              <ChevronRight className="h-3 w-3 text-white dark:text-black group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
      </Link>
    </div>
  )
}