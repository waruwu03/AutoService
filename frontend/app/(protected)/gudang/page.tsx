"use client"

import Link from "next/link"
import {
  Package, AlertTriangle, ClipboardCheck, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, ChevronRight,
  Boxes, ArrowRight, Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import { DashboardCharts } from "@/components/gudang/dashboard-charts"
import { GudangHeader } from "@/components/gudang/gudang-header"
import { CriticalStockAlert } from "@/components/gudang/critical-stock-alert"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function GudangDashboard() {
  const { data: sparepartsRaw, isLoading: loadingStock } = useSWR(
    "/inventory/spareparts?limit=500",
    fetcher
  )
  const { data: movementsRaw, isLoading: loadingMovements } = useSWR(
    "/inventory/stock-movements?limit=10&sortBy=createdAt&sortOrder=desc",
    fetcher
  )

  const allItems: any[] = Array.isArray(sparepartsRaw?.data) ? sparepartsRaw.data : []
  const movements: any[] = Array.isArray(movementsRaw?.data) ? movementsRaw.data : []

  const criticalItems = allItems.filter(
    (i: any) => i.stockQuantity !== undefined && i.stockQuantity <= 0
  )
  const minimumItems = allItems.filter(
    (i: any) => i.stockQuantity !== undefined && i.stockQuantity > 0 && i.stockQuantity <= (i.minStock ?? 5)
  )

  const todayInbound = movements.filter((m: any) =>
    ["PURCHASE", "INITIAL", "ADJUSTMENT_IN"].includes(m.movementType)
  ).reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)

  const todayOutbound = movements.filter((m: any) =>
    ["SALE", "ADJUSTMENT_OUT"].includes(m.movementType)
  ).reduce((sum: number, m: any) => sum + Math.abs(m.quantity || 0), 0)

  const recentMovements = movements.slice(0, 5)

  return (
    <>
      <GudangHeader title="Overview Gudang" description="Monitoring real-time status inventori dan logistik" />
      <CriticalStockAlert />

      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-black/20">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total SKU"
              value={loadingStock ? "..." : allItems.length.toLocaleString()}
              icon={Package}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Stok Kosong"
              value={loadingStock ? "..." : criticalItems.length}
              icon={AlertTriangle}
              colorTheme="red"
              criticalAlert={criticalItems.length > 0}
            />
            <PremiumStatCard
              title="Stok Menipis"
              value={loadingStock ? "..." : minimumItems.length}
              icon={TrendingDown}
              colorTheme="amber"
            />
            <PremiumStatCard
              title="Nilai Inventori"
              value={loadingStock ? "..." : `Rp ${(
                allItems.reduce((s: number, i: any) => s + Number(i.sellPrice || 0) * (i.stockQuantity || 0), 0) / 1_000_000
              ).toFixed(0)}Jt`}
              icon={ClipboardCheck}
              colorTheme="emerald"
            />
          </div>

          {/* Secondary Stats & Quick Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm group">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <ArrowDownRight className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Inbound</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                  +{todayInbound} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Units</span>
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm group">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 shrink-0 border border-rose-500/20 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Outbound</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                  -{todayOutbound} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Units</span>
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm group">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                <Clock className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Aktivitas</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                  {movements.length} <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Entries</span>
                </h4>
              </div>
            </div>
          </div>

          {/* Charts Area */}
          <DashboardCharts />

          {/* Critical Lists & Recent Movements */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Critical Stock List */}
            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between space-y-0">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">STOK KRITIS</p>
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Priority Restock</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-primary" asChild>
                  <Link href="/gudang/inventory?status=critical">Lihat Semua <ChevronRight className="ml-2 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-3">
                {loadingStock ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : [...criticalItems, ...minimumItems].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <ClipboardCheck className="size-12 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Semua stok aman</p>
                  </div>
                ) : (
                  [...criticalItems, ...minimumItems].slice(0, 4).map((item: any) => {
                    const isCritical = item.stockQuantity <= 0
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-amber-400 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "size-2.5 rounded-full",
                            isCritical ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500"
                          )} />
                          <div>
                            <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight leading-none mb-1.5">{item.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.code} • {item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-base font-black italic tracking-tighter leading-none mb-1",
                            isCritical ? "text-rose-500" : "text-amber-500"
                          )}>
                            {item.stockQuantity} <span className="text-[10px] font-bold text-slate-400 opacity-50">/ {item.minStock ?? 5}</span>
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty / Min</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Recent Activity List */}
            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between space-y-0">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">LOG TERBARU</p>
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Recent Activities</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-primary" asChild>
                  <Link href="/gudang/stock-movements">Riwayat Log <ChevronRight className="ml-2 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-3">
                {loadingMovements ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : recentMovements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <Boxes className="size-12 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Belum ada pergerakan</p>
                  </div>
                ) : (
                  recentMovements.slice(0, 4).map((movement: any) => {
                    const isIn = ["PURCHASE", "INITIAL", "ADJUSTMENT_IN"].includes(movement.movementType)
                    return (
                      <div key={movement.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "flex size-10 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform",
                            isIn ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          )}>
                            {isIn ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                          </div>
                          <div className="max-w-[200px]">
                            <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight leading-none mb-1.5 truncate">
                              {movement.sparepart?.name || "PART UNKNOWN"}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                              {movement.movementType} • {movement.createdBy?.name || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-base font-black italic tracking-tighter leading-none mb-1",
                            isIn ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {isIn ? "+" : "-"}{Math.abs(movement.quantity || 0)}
                          </p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {movement.createdAt ? format(new Date(movement.createdAt), "dd MMM") : "-"}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Banner */}
          <div className="relative overflow-hidden rounded-[3rem] bg-[#0A0A0B] p-10 shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
              <Boxes className="size-64" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left space-y-4">
                <Badge className="bg-primary text-black border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg">QUICK ACCESS</Badge>
                <h3 className="text-[2.5rem] font-black text-white leading-none tracking-tighter uppercase italic">Optimalkan Stok Anda</h3>
                <p className="text-slate-400 text-sm max-w-lg font-medium leading-relaxed">
                  Gunakan modul inventori untuk update stok massal, atau setujui permintaan sparepart mekanik dalam hitungan detik.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button className="h-16 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs px-10 rounded-[1.5rem] shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all flex-1 md:flex-none" asChild>
                  <Link href="/gudang/inventory">
                    <Boxes className="mr-3 size-5" />
                    Manajemen Stok
                  </Link>
                </Button>
                <Button variant="outline" className="h-16 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs px-10 rounded-[1.5rem] hover:scale-105 transition-all flex-1 md:flex-none" asChild>
                  <Link href="/gudang/approvals">
                    Verifikasi Permintaan <ArrowRight className="ml-3 size-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { format } from "date-fns"

