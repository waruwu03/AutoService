"use client"

import { useState } from "react"
import { Package, Plus, Clock, CheckCircle2, XCircle, ChevronRight, Search, Car, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { PartRequestDialog } from "@/components/mekanik/PartRequestDialog"
import { apiClient } from "@/lib/api-client"

type RequestStatus = "all" | "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED"

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  PENDING: { label: "Menunggu", icon: Clock, className: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20" },
  APPROVED: { label: "Disetujui", icon: CheckCircle2, className: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-500/20" },
  RECEIVED: { label: "Diterima", icon: CheckCircle2, className: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20" },
  REJECTED: { label: "Ditolak", icon: XCircle, className: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20" },
}

export default function PartsRequestPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<RequestStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [isFulfilling, setIsFulfilling] = useState<string | null>(null)

  const { data: rawData, isLoading, mutate } = useSWR(
    user ? `/gudang/part-requests?requestedById=${user.id}&limit=100` : null,
    fetcher
  )

  const handleFulfill = async (id: string) => {
    setIsFulfilling(id)
    try {
      await apiClient.post(`/gudang/part-requests/${id}/fulfill`)
      toast.success("Part berhasil dikonfirmasi diterima")
      mutate()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengonfirmasi penerimaan part")
    } finally {
      setIsFulfilling(null)
    }
  }

  const realRequests: any[] = Array.isArray(rawData?.data) ? rawData.data : []

  const partsRequests = realRequests.map((r: any) => {
    // Backend status is already lowercase from mappedData
    let reqStatus = r.status.toUpperCase()
    if (reqStatus === 'FULFILLED') reqStatus = 'RECEIVED'

    return {
      ...r,
      reqStatus,
      orderNumber: r.spk_number,
      customer: { name: r.customer_name },
      vehicle: { brand: r.vehicle_info, model: '', licensePlate: r.vehicle_plate },
      spareparts: r.items.map((i: any) => ({
        name: i.sparepart_name,
        code: i.sparepart_code,
        quantity: i.quantity,
      })),
    }
  })

  const filtered = partsRequests.filter((req: any) => {
    const matchesStatus = activeTab === "all" || req.reqStatus === activeTab
    const spkNumber = req.orderNumber || req.spkNumber || ""
    const customerName = req.customer?.name || ""
    const plate = req.vehicle?.licensePlate || req.vehicle?.plateNumber || ""
    const matchesSearch =
      searchQuery === "" ||
      spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const counts = {
    all: partsRequests.length,
    PENDING: partsRequests.filter((r: any) => r.reqStatus === "PENDING").length,
    APPROVED: partsRequests.filter((r: any) => r.reqStatus === "APPROVED").length,
    REJECTED: partsRequests.filter((r: any) => r.reqStatus === "REJECTED").length,
    RECEIVED: partsRequests.filter((r: any) => r.reqStatus === "RECEIVED").length,
  }

  return (
    <div className="space-y-6">
      {/* Search & Action */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <Input
            placeholder="Cari request parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 focus:border-primary/50 transition-all rounded-xl shadow-sm dark:shadow-none"
          />
        </div>
        <Button
          className="bg-primary text-white dark:text-black font-black rounded-xl px-4 shadow-[0_4px_20px_rgba(var(--primary),0.3)]"
          onClick={() => setRequestDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <PartRequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        onSuccess={() => {
          mutate()
        }}
      />

      {/* Status Filter */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestStatus)} className="w-fit">
          <TabsList className="h-10 inline-flex items-center gap-2 bg-white/60 dark:bg-zinc-900/50 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <TabsTrigger value="all" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-slate-200 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white">
              SEMUA ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400">
              PENDING ({counts.PENDING})
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              APPROVED ({counts.APPROVED})
            </TabsTrigger>
            <TabsTrigger value="RECEIVED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400">
              DITERIMA ({counts.RECEIVED})
            </TabsTrigger>
            <TabsTrigger value="REJECTED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-500/20 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">
              DITOLAK ({counts.REJECTED})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="bg-white/50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="bg-white/50 dark:bg-zinc-900/50 border-slate-200 dark:border-white/5 border-dashed shadow-sm dark:shadow-none">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-xs">Tidak ada permintaan parts</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((req: any) => {
            const config = statusConfig[req.reqStatus] || statusConfig.PENDING
            const Icon = config.icon
            const spkNumber = req.orderNumber || req.spkNumber || "-"
            const customerName = req.customer?.name || "-"
            const brand = req.vehicle?.brand || ""
            const model = req.vehicle?.model || ""
            const plate = req.vehicle?.licensePlate || req.vehicle?.plateNumber || "-"
            const parts = req.spareparts || []
            const totalItems = parts.reduce((acc: number, p: any) => acc + (p.quantity || 0), 0)
            const createdAt = req.createdAt ? new Date(req.createdAt) : new Date()

            return (
              <Card key={req.id} className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group shadow-sm hover:shadow-md dark:shadow-none">
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                        {spkNumber}
                      </span>
                      <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-black uppercase italic tracking-tight text-sm pt-1">
                        <User className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                        {customerName}
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-black uppercase border h-6 px-2.5", config.className)}>
                      <Icon className="h-3 w-3 mr-1.5" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-0.5">
                    <Car className="h-3 w-3" />
                    {brand} {model} {plate !== "-" && `• ${plate}`}
                  </div>

                  {/* Parts Summary */}
                  <div className="bg-slate-50 dark:bg-black/30 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200 dark:border-white/5">
                      <span className="text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest">Suku Cadang</span>
                      <span className="text-[10px] font-mono text-primary">
                        {parts.length > 0 ? `${parts.length} jenis • ${totalItems} unit` : "Belum ada parts"}
                      </span>
                    </div>
                    {parts.length > 0 ? (
                      <div className="space-y-2">
                        {parts.slice(0, 3).map((p: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-slate-700 dark:text-zinc-300 font-medium">{p.sparepart?.name || p.name || "-"}</span>
                            <span className="text-slate-500 dark:text-zinc-500 font-mono">x{p.quantity}</span>
                          </div>
                        ))}
                        {parts.length > 3 && (
                          <p className="text-[10px] text-slate-400 dark:text-zinc-600 italic">+{parts.length - 3} item lainnya...</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-zinc-600 italic">Lihat detail SPK untuk informasi parts</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-zinc-600 uppercase">
                      <Clock className="h-3 w-3" />
                      {createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </div>
                    <div className="flex items-center gap-2">
                      {req.reqStatus === 'APPROVED' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleFulfill(req.id)}
                          disabled={isFulfilling === req.id}
                          className="h-7 text-[9px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 shadow-sm"
                        >
                          {isFulfilling === req.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                          Terima Part
                        </Button>
                      )}
                      {req.workOrderId ? (
                        <Link href={`/mekanik/jobs/${req.workOrderId}`} className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all outline-none bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                          Detail <ChevronRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all outline-none opacity-50 cursor-not-allowed bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5" disabled>
                          Detail <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
