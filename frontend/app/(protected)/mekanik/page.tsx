"use client"

import Link from "next/link"
import { ClipboardList, Package, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, Wrench, Car, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"

// Mock data - replace with actual API calls
const mockMechanic = {
  name: "Budi Santoso",
  rating: 4.8,
  totalReviews: 120,
}

const mockStats = {
  pending: 5,
  inProgress: 2,
  completed: 8,
}

const mockTodayJobs = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    customer: "Ahmad Sudirman",
    vehicle: { brand: "Toyota", model: "Avanza", year: 2020, plateNumber: "B 1234 ABC" },
    serviceType: "Service Berkala 10.000km",
    status: "in_progress" as const,
    estimatedDuration: 120,
    priority: "high" as const,
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    customer: "Siti Rahayu",
    vehicle: { brand: "Honda", model: "Jazz", year: 2019, plateNumber: "B 5678 DEF" },
    serviceType: "Ganti Oli + Tune Up",
    status: "pending" as const,
    estimatedDuration: 60,
    priority: "normal" as const,
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Joko Widodo",
    vehicle: { brand: "Daihatsu", model: "Xenia", year: 2021, plateNumber: "B 9012 GHI" },
    serviceType: "Perbaikan AC",
    status: "pending" as const,
    estimatedDuration: 90,
    priority: "urgent" as const,
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  in_progress: { label: "Dikerjakan", variant: "default" as const, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  waiting_parts: { label: "Tunggu Parts", variant: "secondary" as const, className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  waiting_approval: { label: "Tunggu Approval", variant: "secondary" as const, className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Selesai", variant: "default" as const, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
}

const priorityConfig = {
  low: { label: "Low", className: "bg-slate-100 text-slate-600" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-600" },
  high: { label: "High", className: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-600" },
}

export default function MekanikDashboard() {
  return (
    <>
      <MekanikHeader title="Dashboard" description="Ringkasan tugas dan progres pekerjaan Anda" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Greeting Card - Admin Style */}
          <Card className="bg-slate-900 text-slate-50 border-none overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wrench className="size-32 rotate-12" />
            </div>
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Star className="h-6 w-6 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">{getGreeting()},</p>
                  <h2 className="text-3xl font-bold tracking-tight">{mockMechanic.name}</h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 font-semibold px-3 py-1">
                  Mekanik Senior
                </Badge>
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Star className="size-4 text-primary fill-primary" />
                  <span className="font-bold text-white">{mockMechanic.rating}</span>
                  <span className="text-slate-500">({mockMechanic.totalReviews} review)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary - Matches Admin Card Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Pekerjaan Pending</p>
                    <p className="text-3xl font-bold">{mockStats.pending}</p>
                    <p className="text-xs text-amber-600 font-medium">+2 dari kemarin</p>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-xl bg-amber-50">
                    <AlertCircle className="size-7 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Dalam Proses</p>
                    <p className="text-3xl font-bold">{mockStats.inProgress}</p>
                    <p className="text-xs text-blue-600 font-medium">Prioritas Tinggi</p>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-xl bg-blue-50">
                    <Wrench className="size-7 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Selesai Hari Ini</p>
                    <p className="text-3xl font-bold">{mockStats.completed}</p>
                    <p className="text-xs text-emerald-600 font-medium">Bagus! Target tercapai</p>
                  </div>
                  <div className="flex size-14 items-center justify-center rounded-xl bg-emerald-50">
                    <CheckCircle2 className="size-7 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* SPK Hari Ini - Main List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">SPK Hari Ini</h3>
                <Link href="/mekanik/jobs">
                  <Button variant="ghost" className="text-primary font-semibold hover:text-primary/80 hover:bg-primary/10">
                    Lihat Semua <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-4">
                {mockTodayJobs.map((job) => (
                  <Link key={job.id} href={`/mekanik/jobs/${job.id}`}>
                    <Card className="group hover:border-primary/50 transition-all shadow-sm border-slate-200 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1 bg-primary group-hover:w-2 transition-all"></div>
                          <div className="flex-1 p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">{job.spkNumber}</span>
                                  <Badge className={priorityConfig[job.priority].className}>
                                    {priorityConfig[job.priority].label}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-slate-900">{job.customer}</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <Car className="size-4" />
                                    <span>{job.vehicle.brand} {job.vehicle.model} • {job.vehicle.plateNumber}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                  <div className="flex items-center gap-1.5">
                                    <Wrench className="size-3.5 text-primary" />
                                    <span>{job.serviceType}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="size-3.5" />
                                    <span>{job.estimatedDuration} menit</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                                <Badge className={`${statusConfig[job.status].className} px-4 py-1.5 border font-semibold`}>
                                  {statusConfig[job.status].label}
                                </Badge>
                                <Button variant="outline" size="sm" className="hidden md:flex group-hover:bg-primary group-hover:text-slate-900 group-hover:border-primary transition-colors">
                                  Detail <ChevronRight className="ml-1 size-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions & Others */}
            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg">Menu Cepat</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <Link href="/mekanik/jobs" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/30 transition-all group">
                    <div className="bg-slate-900 rounded-lg p-2.5 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-slate-900/10">
                      <ClipboardList className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Lihat Semua SPK</p>
                      <p className="text-[11px] text-slate-500">Pantau daftar pekerjaan</p>
                    </div>
                  </Link>

                  <Link href="/mekanik/parts-request" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/30 transition-all group">
                    <div className="bg-slate-900 rounded-lg p-2.5 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-slate-900/10">
                      <Package className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Request Suku Cadang</p>
                      <p className="text-[11px] text-slate-500">Ajukan parts yang dibutuhkan</p>
                    </div>
                  </Link>

                  <Link href="/mekanik/history" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-primary/30 transition-all group">
                    <div className="bg-slate-900 rounded-lg p-2.5 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-slate-900/10">
                      <Clock className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Riwayat Pekerjaan</p>
                      <p className="text-[11px] text-slate-500">Lihat pekerjaan yang selesai</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Performance Indicator - Added for Premium Look */}
              <Card className="shadow-sm border-slate-200 bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute -bottom-6 -right-6 opacity-10">
                  <Star className="size-24 text-primary fill-primary" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Performa Minggu Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">94%</span>
                    <span className="text-xs font-semibold text-emerald-600 mb-1.5">+2.4%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Efisiensi kerja Anda sangat baik minggu ini. Pertahankan!
                  </p>
                  <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[94%] rounded-full shadow-sm shadow-primary/20"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
