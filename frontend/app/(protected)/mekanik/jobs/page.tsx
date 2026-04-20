"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Car, User, ChevronRight, Search, Wrench, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"

type JobStatus = "all" | "pending" | "in_progress" | "waiting_parts" | "waiting_approval" | "completed"

const mockJobs = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    customer: "Ahmad Sudirman",
    phone: "0812-3456-7890",
    vehicle: { brand: "Toyota", model: "Avanza", year: 2020, plateNumber: "B 1234 ABC" },
    serviceType: "Service Berkala 10.000km",
    description: "AC kurang dingin, suara mesin agak kasar",
    status: "in_progress" as const,
    estimatedDuration: 120,
    priority: "high" as const,
    assignedAt: new Date("2024-01-15T09:30:00"),
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    customer: "Siti Rahayu",
    phone: "0813-4567-8901",
    vehicle: { brand: "Honda", model: "Jazz", year: 2019, plateNumber: "B 5678 DEF" },
    serviceType: "Ganti Oli + Tune Up",
    description: "Rutin ganti oli dan pengecekan umum",
    status: "pending" as const,
    estimatedDuration: 60,
    priority: "normal" as const,
    assignedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Joko Widodo",
    phone: "0814-5678-9012",
    vehicle: { brand: "Daihatsu", model: "Xenia", year: 2021, plateNumber: "B 9012 GHI" },
    serviceType: "Perbaikan AC",
    description: "AC tidak dingin sama sekali",
    status: "pending" as const,
    estimatedDuration: 90,
    priority: "urgent" as const,
    assignedAt: new Date("2024-01-15T08:00:00"),
  },
  {
    id: "4",
    spkNumber: "SPK-2024-004",
    customer: "Dewi Lestari",
    phone: "0815-6789-0123",
    vehicle: { brand: "Suzuki", model: "Ertiga", year: 2022, plateNumber: "B 3456 JKL" },
    serviceType: "Ganti Kampas Rem",
    description: "Rem bunyi dan kurang pakem",
    status: "waiting_parts" as const,
    estimatedDuration: 45,
    priority: "high" as const,
    assignedAt: new Date("2024-01-14T14:00:00"),
  },
  {
    id: "5",
    spkNumber: "SPK-2024-005",
    customer: "Andi Pratama",
    phone: "0816-7890-1234",
    vehicle: { brand: "Mitsubishi", model: "Xpander", year: 2020, plateNumber: "B 7890 MNO" },
    serviceType: "Service Berkala 20.000km",
    description: "Service rutin",
    status: "completed" as const,
    estimatedDuration: 150,
    priority: "normal" as const,
    assignedAt: new Date("2024-01-14T09:00:00"),
  },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  in_progress: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  waiting_parts: { label: "Tunggu Parts", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  waiting_approval: { label: "Tunggu Approval", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Selesai", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
}

const priorityConfig = {
  low: { label: "Low", className: "bg-slate-100 text-slate-600" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-600" },
  high: { label: "High", className: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-600" },
}

export default function JobsListPage() {
  const [activeTab, setActiveTab] = useState<JobStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredJobs = mockJobs.filter((job) => {
    const matchesStatus = activeTab === "all" || job.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      job.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: mockJobs.length,
    pending: mockJobs.filter((j) => j.status === "pending").length,
    in_progress: mockJobs.filter((j) => j.status === "in_progress").length,
    waiting_parts: mockJobs.filter((j) => j.status === "waiting_parts").length,
    completed: mockJobs.filter((j) => j.status === "completed").length,
  }

  return (
    <>
      <MekanikHeader title="Pekerjaan" description="Kelola dan pantau semua Surat Perintah Kerja (SPK)" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Top Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari No. SPK, Pelanggan, Plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JobStatus)} className="w-full md:w-auto">
              <TabsList className="bg-slate-100 p-1 w-full md:w-auto flex overflow-x-auto no-scrollbar">
                <TabsTrigger value="all" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                  Semua
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-xs md:text-sm">
                  Pending ({statusCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-xs md:text-sm">
                  Dikerjakan
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm text-xs md:text-sm">
                  Selesai
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Jobs List */}
          <div className="grid gap-4">
            {filteredJobs.length === 0 ? (
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <Search className="size-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Tidak ada SPK</h3>
                  <p className="text-sm text-slate-500 mt-1">Gunakan kata kunci lain atau pilih filter yang berbeda.</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Link key={job.id} href={`/mekanik/jobs/${job.id}`}>
                  <Card className="group hover:border-primary/50 transition-all shadow-sm border-slate-200 overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className={`md:w-1 transition-all group-hover:w-2 ${
                          job.status === 'in_progress' ? 'bg-blue-500' : 
                          job.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></div>
                        <div className="flex-1 p-5">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            
                            <div className="flex-1 min-w-0 space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">{job.spkNumber}</span>
                                <Badge className={priorityConfig[job.priority].className}>
                                  {priorityConfig[job.priority].label}
                                </Badge>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  {job.assignedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <User className="size-3.5" /> Pelanggan
                                  </div>
                                  <p className="font-bold text-slate-900">{job.customer}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Car className="size-3.5" /> Kendaraan
                                  </div>
                                  <p className="font-bold text-slate-900 truncate">
                                    {job.vehicle.brand} {job.vehicle.model} • {job.vehicle.plateNumber}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600">
                                <div className="flex items-center gap-1.5">
                                  <div className="p-1 rounded bg-slate-100">
                                    <Wrench className="size-3.5 text-primary" />
                                  </div>
                                  <span className="font-medium">{job.serviceType}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="p-1 rounded bg-slate-100">
                                    <Clock className="size-3.5 text-slate-400" />
                                  </div>
                                  <span>{job.estimatedDuration} menit</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-0 border-slate-100">
                              <Badge className={`${statusConfig[job.status].className} px-4 py-1.5 border font-bold text-xs uppercase tracking-wider`}>
                                {statusConfig[job.status].label}
                              </Badge>
                              <Button variant="ghost" size="sm" className="bg-slate-50 hover:bg-primary group-hover:text-slate-900 transition-colors font-bold px-4">
                                Detail <ChevronRight className="ml-1 size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
