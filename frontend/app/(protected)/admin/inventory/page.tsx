"use client"
import Link from "next/link"
import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertTriangle, Plus, Search, Filter, Pencil, Trash2, Package, Receipt, Loader2, TrendingUp } from "lucide-react"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("")

  const { data: rawData, isLoading } = useSWR(
    "/inventory/spareparts?limit=500&sortBy=name&sortOrder=asc",
    fetcher
  )
  const inventoryData: any[] = Array.isArray(rawData?.data) ? rawData.data : []

  const getStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "Kritis"
    if (stock <= minStock) return "Mendekati Minimum"
    return "Aman"
  }

  const getStockBadge = (status: string, stock: number) => {
    if (status === "Aman")
      return (
        <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-none px-3 font-bold shadow-none rounded-lg">
          {stock} Pcs (Aman)
        </Badge>
      )
    if (status === "Mendekati Minimum")
      return (
        <Badge className="bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-none px-3 font-bold shadow-none rounded-lg">
          {stock} Pcs (Warning)
        </Badge>
      )
    return (
      <Badge className="bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-none animate-pulse px-3 font-black shadow-none rounded-lg">
        {stock} Pcs (Kritis)
      </Badge>
    )
  }

  const enriched = inventoryData.map((item: any) => {
    const stock = item.stockQuantity ?? item.stok ?? 0
    const minStock = item.minStock ?? item.stok_minimum ?? 5
    return {
      ...item,
      status: getStatus(stock, minStock),
      stock: stock,
    }
  })

  const criticalCount = enriched.filter((i) => i.status === "Kritis").length
  const totalValue = enriched.reduce(
    (sum, i) => sum + Number(i.sellPrice ?? i.harga_jual ?? 0) * (i.stock ?? 0),
    0
  )

  const filtered = enriched.filter(
    (item) =>
      (item.name ?? item.nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.code ?? item.kode ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AdminHeader title="Stok Barang" description="Manajemen inventori suku cadang dan sparepart bengkel." />
      <div className="p-6 space-y-8">

        {/* Critical Alert */}
        {!isLoading && criticalCount > 0 && (
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10 text-red-900 dark:text-red-400 shadow-sm flex items-center gap-4 rounded-3xl p-6">
            <div className="bg-red-100 dark:bg-red-500/20 p-4 rounded-2xl">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <AlertTitle className="text-red-800 dark:text-red-400 font-black text-xl tracking-tight uppercase italic mb-1">Peringatan Stok Kritis!</AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400/80 font-medium">
                Terdapat <strong className="text-red-900 dark:text-red-200">{criticalCount}</strong> jenis barang yang stoknya habis atau di bawah batas minimum.
                Segera lakukan restock untuk menjaga kelancaran servis.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <PremiumStatCard
            title="Total Suku Cadang"
            value={isLoading ? "..." : `${enriched.length} Item`}
            icon={Package}
            description="Total item unik"
            colorTheme="blue"
          />
          <PremiumStatCard
            title="Barang Kritis"
            value={isLoading ? "..." : criticalCount.toString()}
            icon={AlertTriangle}
            description={criticalCount > 0 ? "Butuh Restock" : "Aman"}
            colorTheme="red"
            criticalAlert={criticalCount > 0}
          />
          <PremiumStatCard
            title="Total Nilai Stok"
            value={isLoading ? "..." : `Rp ${(totalValue / 1_000_000).toFixed(1)}jt`}
            icon={TrendingUp}
            description="Estimasi nilai aset"
            colorTheme="emerald"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Cari kode atau nama part..."
                className="pl-10 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-2xl h-12 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-2xl h-12 px-6 font-bold">
              <Filter className="size-4 mr-2" /> Filter
            </Button>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto h-12 px-8 rounded-2xl font-black uppercase italic tracking-wider shadow-lg shadow-orange-500/20">
            <Link href="/admin/spareparts">
              <Plus className="size-5 mr-2" /> Tambah Part
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
                <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500 pl-6 h-14">Kode Part</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500 h-14">Nama Part</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500 h-14">Kategori</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-slate-500 h-14">Harga Jual</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-500 px-6 h-14">Stok Terkini</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-500 pr-6 h-14">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin inline text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="size-10 text-slate-200" />
                        <p className="font-bold">Tidak ada item ditemukan</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 border-slate-100 dark:border-white/5 transition-colors h-16",
                        item.status === "Kritis" ? "bg-red-50/20 dark:bg-red-500/5" : ""
                      )}
                    >
                      <TableCell className="font-bold text-slate-400 pl-6 font-mono text-xs">{item.code ?? item.kode ?? item.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-black text-slate-900 dark:text-slate-100">{item.name ?? item.nama}</TableCell>
                      <TableCell className="font-bold text-slate-500 text-xs">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 rounded-md">
                          {item.category?.name ?? item.category?.nama ?? item.category ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900 dark:text-white">
                        Rp {Number(item.sellPrice ?? item.harga_jual ?? 0).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="px-6">{getStockBadge(item.status, item.stock)}</TableCell>
                      <TableCell className="text-center pr-6">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                          >
                            <Link href="/admin/spareparts">
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
