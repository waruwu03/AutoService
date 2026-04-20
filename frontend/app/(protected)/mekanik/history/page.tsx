"use client"

import { useState } from "react"
import { Car, Clock, Calendar, Star, TrendingUp, CheckCircle2, ChevronRight, Search, ClipboardList, Timer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"

const mockHistory = [
  {
    id: "1",
    spkNumber: "SPK-2024-005",
    customer: "Andi Pratama",
    vehicle: { brand: "Mitsubishi", model: "Xpander", plateNumber: "B 7890 MNO" },
    serviceType: "Service Berkala 20.000km",
    completedAt: new Date("2024-01-14T16:00:00"),
    duration: 145,
    rating: 5,
    review: "Mekanik sangat teliti dan profesional",
  },
  {
    id: "2",
    spkNumber: "SPK-2024-004",
    customer: "Dewi Lestari",
    vehicle: { brand: "Suzuki", model: "Ertiga", plateNumber: "B 3456 JKL" },
    serviceType: "Ganti Kampas Rem",
    completedAt: new Date("2024-01-13T14:30:00"),
    duration: 50,
    rating: 4,
    review: "Bagus, tapi agak lama menunggu parts",
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Rudi Hermawan",
    vehicle: { brand: "Toyota", model: "Innova", plateNumber: "B 2345 PQR" },
    serviceType: "Perbaikan AC + Tune Up",
    completedAt: new Date("2024-01-12T17:00:00"),
    duration: 180,
    rating: 5,
    review: "AC dingin lagi, mesin halus. Mantap!",
  },
  {
    id: "4",
    spkNumber: "SPK-2024-002",
    customer: "Maya Sari",
    vehicle: { brand: "Honda", model: "Brio", plateNumber: "B 6789 STU" },
    serviceType: "Ganti Oli + Filter",
    completedAt: new Date("2024-01-11T11:00:00"),
    duration: 35,
    rating: 5,
    review: null,
  },
  {
    id: "5",
    spkNumber: "SPK-2024-001",
    customer: "Bambang Setiawan",
    vehicle: { brand: "Daihatsu", model: "Terios", plateNumber: "B 1234 VWX" },
    serviceType: "Service Berkala 40.000km",
    completedAt: new Date("2024-01-10T15:30:00"),
    duration: 200,
    rating: 4,
    review: "Overall puas, pelayanan ramah",
  },
]

const stats = {
  totalJobs: 45,
  avgDuration: 95,
  avgRating: 4.8,
  completionRate: 98,
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = mockHistory.filter((job) => {
    return (
      searchQuery === "" ||
      job.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <>
      <MekanikHeader title="Riwayat" description="Daftar pekerjaan yang telah Anda selesaikan" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Stats Summary - Matches Admin Card Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stats.totalJobs}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Selesai</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Star className="size-5 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stats.avgRating}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Rating</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Timer className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stats.avgDuration}m</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Durasi</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className="size-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <TrendingUp className="size-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stats.completionRate}%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Progres</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Header */}
          <div className="flex bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari No. SPK, Pelanggan, atau Plat Kendaraan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* History List */}
          <div className="grid gap-4">
            {filteredHistory.length === 0 ? (
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="py-12 text-center text-slate-500">
                  Riwayat pekerjaan tidak ditemukan
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((job) => (
                <Card key={job.id} className="group hover:border-primary/50 transition-all shadow-sm border-slate-200 overflow-hidden bg-white">
                  <CardContent className="p-5">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-700 w-fit">
                            <ClipboardList className="size-3.5" />
                            {job.spkNumber}
                          </div>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold px-3 py-1 flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5" />
                            Selesai
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">{job.customer}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Car className="size-4" />
                              <span>{job.vehicle.brand} {job.vehicle.model} • {job.vehicle.plateNumber}</span>
                            </div>
                          </div>
                          <div className="space-y-1 md:text-right">
                            <p className="text-sm font-bold text-slate-900">{job.serviceType}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-400 md:justify-end">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {job.completedAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: 'numeric' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {job.duration} menit
                              </span>
                            </div>
                          </div>
                        </div>

                        {job.rating && (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`size-3.5 ${s <= job.rating ? "text-amber-500 fill-amber-500" : "text-slate-200"}`}
                                />
                              ))}
                              <span className="text-xs font-bold text-slate-900 ml-2">Review Pelanggan</span>
                            </div>
                            <p className="text-sm text-slate-600 italic leading-relaxed">
                              &ldquo;{job.review || "Tidak ada komentar tertulis."}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center lg:pl-6 lg:border-l border-slate-100">
                        <Button variant="ghost" size="icon" className="hover:bg-primary group-hover:text-slate-900 rounded-full transition-all">
                          <ChevronRight className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
