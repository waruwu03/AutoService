"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Clock,
  ArrowUpRight,
  Boxes,
  ShoppingCart,
} from "lucide-react"
import { fetcher } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import useSWR from "swr"

// ─── Tipe Data ─────────────────────────────────────────────────────────────────
interface StockItem {
  id: string
  code: string
  name: string
  category: string
  stockQuantity: number
  minStock: number
  maxStock?: number
  unit: string
  sellPrice: number
  location?: string
  brand?: string
}

type StockStatus = "Kritis" | "Menipis" | "Aman" | "Penuh"

function getStockStatus(stock: number, min: number, max?: number): StockStatus {
  if (stock <= 0) return "Kritis"
  if (stock <= min) return "Menipis"
  if (max && stock >= max * 0.9) return "Penuh"
  return "Aman"
}

function getStockPercent(stock: number, min: number, max?: number): number {
  const ceiling = max || min * 5 || 100
  return Math.min(100, Math.round((stock / ceiling) * 100))
}

const STATUS_CONFIG: Record<StockStatus, {
  label: string
  badge: string
  bar: string
  icon: React.ReactNode
  pulse?: boolean
}> = {
  Kritis: {
    label: "Kritis",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/20",
    bar: "bg-red-500",
    icon: <XCircle className="size-3.5 text-red-500" />,
    pulse: true,
  },
  Menipis: {
    label: "Menipis",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    bar: "bg-amber-500",
    icon: <AlertTriangle className="size-3.5 text-amber-500" />,
  },
  Aman: {
    label: "Aman",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    bar: "bg-emerald-500",
    icon: <CheckCircle2 className="size-3.5 text-emerald-500" />,
  },
  Penuh: {
    label: "Penuh",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    bar: "bg-blue-500",
    icon: <ArrowUpRight className="size-3.5 text-blue-500" />,
  },
}

// ─── Komponen Bar Stok Per Item ─────────────────────────────────────────────
function StockRow({ item }: { item: StockItem & { status: StockStatus; percent: number } }) {
  const cfg = STATUS_CONFIG[item.status]
  return (
    <div className={cn(
      "group p-4 rounded-2xl border transition-all duration-200 hover:shadow-md",
      item.status === "Kritis"
        ? "border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5"
        : item.status === "Menipis"
        ? "border-amber-200 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5"
        : "border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/40"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Info Item */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-slate-900 dark:text-slate-100 text-sm truncate">
              {item.name}
            </span>
            {item.status === "Kritis" && (
              <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {item.code} {item.brand ? `· ${item.brand}` : ""} {item.location ? `· 📍 ${item.location}` : ""}
          </p>
        </div>

        {/* Badge Status */}
        <span className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0",
          cfg.badge
        )}>
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Stok: <span className="font-black text-slate-900 dark:text-white">{item.stockQuantity}</span> {item.unit}
          </span>
          <span className="text-slate-400">
            Min: {item.minStock} {item.maxStock ? `/ Max: ${item.maxStock}` : ""}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", cfg.bar)}
            style={{ width: `${item.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────────
export default function StokDashboardPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "kritis" | "menipis" | "aman">("all")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isOnline, setIsOnline] = useState(true)

  // SWR dengan auto-refresh setiap 30 detik
  const { data: rawData, isLoading, mutate } = useSWR(
    "/inventory/spareparts?limit=500&sortBy=stockQuantity&sortOrder=asc",
    fetcher,
    {
      refreshInterval: 30_000, // 30 detik
      onSuccess: () => setLastRefresh(new Date()),
      onError: () => setIsOnline(false),
    }
  )

  // Pantau koneksi online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const rawItems: any[] = Array.isArray(rawData?.data) ? rawData.data : []

  // Enrichment data
  const enriched = rawItems.map((item) => {
    const stock = item.stockQuantity ?? item.stok ?? 0
    const min = item.minStock ?? item.stok_minimum ?? 5
    const max = item.maxStock ?? item.stok_maksimum ?? undefined
    return {
      ...item,
      stockQuantity: stock,
      minStock: min,
      maxStock: max,
      status: getStockStatus(stock, min, max) as StockStatus,
      percent: getStockPercent(stock, min, max),
    }
  })

  // Statistik ringkasan
  const kritisCount = enriched.filter((i) => i.status === "Kritis").length
  const menipisCount = enriched.filter((i) => i.status === "Menipis").length
  const amanCount = enriched.filter((i) => i.status === "Aman").length
  const totalNilai = enriched.reduce(
    (sum, i) => sum + Number(i.sellPrice ?? 0) * (i.stockQuantity ?? 0),
    0
  )

  // Filter dan search
  const filtered = enriched.filter((item) => {
    const matchSearch =
      (item.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.code ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.brand ?? "").toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === "all" ||
      (filter === "kritis" && item.status === "Kritis") ||
      (filter === "menipis" && item.status === "Menipis") ||
      (filter === "aman" && (item.status === "Aman" || item.status === "Penuh"))

    return matchSearch && matchFilter
  })

  const handleManualRefresh = useCallback(() => {
    mutate()
    setLastRefresh(new Date())
  }, [mutate])

  return (
    <>
      <AdminHeader
        title="Dashboard Stok Realtime"
        description="Pantau sisa stok sparepart secara langsung. Auto-refresh setiap 30 detik."
      />

      <div className="p-6 space-y-6">

        {/* Status Bar Atas */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Indikator Online / Last Refresh */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
              isOnline
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
            )}>
              {isOnline ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
              {isOnline ? "Live" : "Offline"}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="size-3" />
              Update: {lastRefresh.toLocaleTimeString("id-ID")}
            </span>
          </div>

          {/* Tombol Refresh Manual */}
          <Button
            id="btn-manual-refresh"
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="gap-2 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800"
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            Refresh Sekarang
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Total Item"
            value={isLoading ? "..." : `${enriched.length}`}
            icon={Boxes}
            description="Jenis sparepart aktif"
            colorTheme="blue"
          />
          <PremiumStatCard
            title="Stok Kritis"
            value={isLoading ? "..." : kritisCount.toString()}
            icon={XCircle}
            description={kritisCount > 0 ? "Perlu restock segera!" : "Semua aman"}
            colorTheme="red"
            criticalAlert={kritisCount > 0}
          />
          <PremiumStatCard
            title="Stok Menipis"
            value={isLoading ? "..." : menipisCount.toString()}
            icon={AlertTriangle}
            description="Di bawah batas minimum"
            colorTheme="amber"
            criticalAlert={menipisCount > 0}
          />
          <PremiumStatCard
            title="Total Nilai Stok"
            value={isLoading ? "..." : `Rp ${(totalNilai / 1_000_000).toFixed(1)}jt`}
            icon={TrendingUp}
            description="Estimasi nilai aset gudang"
            colorTheme="emerald"
          />
        </div>

        {/* Banner Kritis */}
        {!isLoading && kritisCount > 0 && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/15 shadow-sm shadow-red-500/5">
            <div className="bg-red-100 dark:bg-red-500/20 p-3 rounded-xl shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-black text-red-800 dark:text-red-400 uppercase tracking-tight italic">
                ⚠ {kritisCount} Item Stok Habis / Kritis!
              </p>
              <p className="text-sm text-red-700/80 dark:text-red-400/70 mt-0.5">
                Segera lakukan pengadaan stok agar layanan servis tidak terganggu.
              </p>
            </div>
          </div>
        )}

        {/* Distribusi Status (Overview Bar) */}
        {!isLoading && enriched.length > 0 && (
          <Card className="border-slate-100 dark:border-white/5 rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-black">Distribusi Status Stok</CardTitle>
              <CardDescription>Persentase kondisi stok dari total {enriched.length} item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Bar Distribusi */}
              <div className="flex h-5 w-full rounded-full overflow-hidden gap-0.5">
                {kritisCount > 0 && (
                  <div
                    className="bg-red-500 transition-all duration-700"
                    style={{ width: `${(kritisCount / enriched.length) * 100}%` }}
                    title={`Kritis: ${kritisCount}`}
                  />
                )}
                {menipisCount > 0 && (
                  <div
                    className="bg-amber-500 transition-all duration-700"
                    style={{ width: `${(menipisCount / enriched.length) * 100}%` }}
                    title={`Menipis: ${menipisCount}`}
                  />
                )}
                {amanCount > 0 && (
                  <div
                    className="bg-emerald-500 transition-all duration-700"
                    style={{ width: `${(amanCount / enriched.length) * 100}%` }}
                    title={`Aman: ${amanCount}`}
                  />
                )}
              </div>
              {/* Legend */}
              <div className="flex gap-4 flex-wrap text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  Kritis ({kritisCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  Menipis ({menipisCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  Aman ({amanCount})
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Cari nama, kode, atau brand..."
              className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-2xl h-11 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "all", label: "Semua", count: enriched.length },
              { key: "kritis", label: "🔴 Kritis", count: kritisCount },
              { key: "menipis", label: "🟡 Menipis", count: menipisCount },
              { key: "aman", label: "🟢 Aman", count: amanCount },
            ] as const).map(({ key, label, count }) => (
              <button
                key={key}
                id={`filter-stok-${key}`}
                onClick={() => setFilter(key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200",
                  filter === key
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800"
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Item Stok */}
        <div>
          {isLoading ? (
            /* Skeleton Loading */
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 animate-pulse space-y-3">
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-zinc-700 rounded-lg" />
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Package className="size-12 text-slate-200 dark:text-zinc-700" />
              <p className="font-bold text-slate-400">Tidak ada item ditemukan</p>
              <p className="text-sm text-slate-300 dark:text-zinc-600">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 mb-3 font-medium">
                Menampilkan {filtered.length} dari {enriched.length} item
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {/* Kritis & Menipis duluan */}
                {filtered
                  .sort((a, b) => {
                    const order: Record<StockStatus, number> = { Kritis: 0, Menipis: 1, Aman: 2, Penuh: 3 }
                    return order[a.status] - order[b.status]
                  })
                  .map((item) => (
                    <StockRow key={item.id} item={item} />
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-300 dark:text-zinc-600 pb-4">
          Data diperbarui otomatis setiap 30 detik · Terakhir: {lastRefresh.toLocaleString("id-ID")}
        </p>
      </div>
    </>
  )
}
