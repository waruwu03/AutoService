"use client"

import { useState } from "react"
import { Package, Plus, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, Search, ClipboardList, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"

type RequestStatus = "all" | "pending" | "approved" | "rejected" | "received"

const mockPartsRequests = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    vehicle: "Toyota Avanza - B 1234 ABC",
    items: [
      { name: "Belt Kipas", quantity: 1, price: 150000 },
      { name: "Filter Udara", quantity: 1, price: 85000 },
    ],
    status: "pending" as const,
    requestedAt: new Date("2024-01-15T10:30:00"),
    notes: "Urgent - pelanggan menunggu",
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    vehicle: "Honda Jazz - B 5678 DEF",
    items: [
      { name: "Oli Mesin 4L", quantity: 1, price: 350000 },
      { name: "Filter Oli", quantity: 1, price: 45000 },
    ],
    status: "approved" as const,
    requestedAt: new Date("2024-01-15T09:00:00"),
    approvedAt: new Date("2024-01-15T09:30:00"),
    notes: "",
  },
  {
    id: "3",
    spkNumber: "SPK-2024-004",
    vehicle: "Suzuki Ertiga - B 3456 JKL",
    items: [
      { name: "Kampas Rem Depan", quantity: 1, price: 280000 },
      { name: "Kampas Rem Belakang", quantity: 1, price: 250000 },
    ],
    status: "received" as const,
    requestedAt: new Date("2024-01-14T14:00:00"),
    approvedAt: new Date("2024-01-14T14:30:00"),
    receivedAt: new Date("2024-01-15T08:00:00"),
    notes: "",
  },
  {
    id: "4",
    spkNumber: "SPK-2024-003",
    vehicle: "Daihatsu Xenia - B 9012 GHI",
    items: [
      { name: "Kompresor AC", quantity: 1, price: 2500000 },
    ],
    status: "rejected" as const,
    requestedAt: new Date("2024-01-14T11:00:00"),
    rejectedAt: new Date("2024-01-14T12:00:00"),
    rejectionReason: "Stok tidak tersedia, perlu order 3-5 hari",
    notes: "",
  },
]

const statusConfig = {
  pending: { label: "Menunggu", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Disetujui", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Ditolak", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
  received: { label: "Diterima", icon: Package, className: "bg-blue-100 text-blue-700 border-blue-200" },
}

export default function PartsRequestPage() {
  const [activeTab, setActiveTab] = useState<RequestStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRequests = mockPartsRequests.filter((req) => {
    const matchesStatus = activeTab === "all" || req.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      req.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: mockPartsRequests.length,
    pending: mockPartsRequests.filter((r) => r.status === "pending").length,
    approved: mockPartsRequests.filter((r) => r.status === "approved").length,
    rejected: mockPartsRequests.filter((r) => r.status === "rejected").length,
    received: mockPartsRequests.filter((r) => r.status === "received").length,
  }

  return (
    <>
      <MekanikHeader title="Permintaan Parts" description="Daftar pengajuan suku cadang untuk perbaikan" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-5xl space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari SPK atau Nama Parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestStatus)} className="w-full md:w-auto">
                <TabsList className="bg-slate-100 p-1 w-full md:w-auto">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white rounded-lg">Semua</TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-white rounded-lg">Menunggu</TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-white rounded-lg">Disetujui</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button className="bg-primary text-slate-900 hover:bg-primary/90 font-bold">
                <Plus className="size-4 mr-2" />
                Buat Permintaan
              </Button>
            </div>
          </div>

          {/* Requests List */}
          <div className="grid gap-4">
            {filteredRequests.length === 0 ? (
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex size-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <Package className="size-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Tidak ada permintaan</h3>
                  <p className="text-sm text-slate-500 mt-1">Belum ada pengajuan suku cadang yang ditemukan.</p>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon
                const totalPrice = request.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

                return (
                  <Card key={request.id} className="group hover:border-primary/50 transition-all shadow-sm border-slate-200 overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className={`md:w-1 transition-all group-hover:w-2 ${
                          request.status === 'received' ? 'bg-blue-500' : 
                          request.status === 'approved' ? 'bg-emerald-500' : 
                          request.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                        
                        <div className="flex-1 p-5">
                          <div className="flex flex-col lg:flex-row justify-between gap-6">
                            
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-700 w-fit">
                                  <ClipboardList className="size-3.5" />
                                  {request.spkNumber}
                                </div>
                                <Badge variant="outline" className={`${statusConfig[request.status].className} font-bold px-3 py-1 flex items-center gap-1.5`}>
                                  <StatusIcon className="size-3.5" />
                                  {statusConfig[request.status].label}
                                </Badge>
                              </div>
                              
                              <div>
                                <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                                  <ShoppingBag className="size-3.5" /> Items ({request.items.length})
                                </p>
                                <div className="grid gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  {request.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                      <span className="font-semibold text-slate-900">{item.name}</span>
                                      <div className="flex items-center gap-4">
                                        <span className="text-slate-500">x{item.quantity}</span>
                                        <span className="font-bold text-slate-900">Rp {item.price.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-200">
                                    <span>Total Estimasi</span>
                                    <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              {request.status === "rejected" && request.rejectionReason && (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                  <p className="text-xs text-red-600 font-bold mb-1 uppercase tracking-wider">Alasan Penolakan:</p>
                                  <p className="text-sm text-red-700 flex items-start gap-2 italic">
                                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                    {request.rejectionReason}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-between pt-4 lg:pt-0 border-t lg:border-0 border-slate-100 gap-4">
                              <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Diminta Pada</p>
                                <p className="text-xs font-bold text-slate-900">
                                  {request.requestedAt.toLocaleDateString("id-ID")} {request.requestedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm" className="bg-slate-50 hover:bg-slate-900 hover:text-white transition-all font-bold px-4 rounded-lg group/btn">
                                Detail <ChevronRight className="ml-1 size-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
