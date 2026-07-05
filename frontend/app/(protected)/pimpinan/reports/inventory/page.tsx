"use client"

import * as React from "react"
import {
  Package,
  Download,
  Filter,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ChevronDown,
  FileText,
  FileSpreadsheet,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import useSWR from "swr"
import { apiClient, fetcher } from "@/lib/api-client"
import { toast } from "sonner"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export default function InventoryReportPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data: invRaw, isLoading: invLoading } = useSWR('/reports/inventory', fetcher)
  const { data: movRaw, isLoading: movLoading } = useSWR('/inventory/stock-movements?limit=5', fetcher)

  const isLoading = invLoading || movLoading

  const inventoryItems = invRaw?.data?.items?.map((i: any) => ({
    id: i.id,
    name: i.name,
    sku: i.code,
    category: i.category,
    stock: i.stockQuantity,
    minStock: i.minStock,
    maxStock: i.maxStock || (i.minStock * 3),
    unit: i.unit,
    price: Number(i.sellPrice),
    value: Number(i.sellPrice) * i.stockQuantity,
    status: i.stockQuantity <= i.minStock * 0.5 ? "critical" : i.stockQuantity <= i.minStock ? "low" : "normal"
  })) || []

  const catMap: Record<string, number> = {}
  inventoryItems.forEach((i: any) => { catMap[i.category] = (catMap[i.category] || 0) + i.value })
  const totalInvValue = inventoryItems.reduce((s: number, x: any) => s + x.value, 0)
  const categoryDistribution = Object.entries(catMap).map(([name, value], idx) => ({
    name: name.replace(/_/g, ' '), 
    value: totalInvValue > 0 ? Math.round((value / totalInvValue) * 100) : 0, 
    color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6b7280", "#ec4899", "#14b8a6"][idx % 7]
  })).sort((a, b) => b.value - a.value).slice(0, 5)

  const recentTransactions = Array.isArray(movRaw?.data?.data) ? movRaw.data.data.map((m: any) => ({
    id: m.id,
    date: new Date(m.createdAt).toLocaleDateString('id-ID'),
    item: m.sparepart?.name || '-',
    type: (m.movementType.includes('OUT') || m.movementType.includes('SALE') || m.movementType.includes('RETURN_SUPPLIER')) ? 'out' : 'in',
    quantity: m.quantity,
    spk: m.referenceId || m.referenceType || '-',
    by: m.createdBy?.name || 'Sistem'
  })) : []

  const stockMovement = [
    { month: "Jun", masuk: 150, keluar: 130 },
    { month: "Jul", masuk: 180, keluar: 160 },
    { month: "Aug", masuk: 165, keluar: 155 },
    { month: "Sep", masuk: 190, keluar: 170 },
    { month: "Okt", masuk: 175, keluar: 165 },
    { month: "Nov", masuk: 145, keluar: 140 },
  ]

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await apiClient.get(
        `/reports/export?type=inventory&format=${format}`,
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `laporan-inventory.${format === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Laporan berhasil diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh laporan')
    } finally {
      setIsExporting(false)
    }
  }

  const filteredItems = inventoryItems.filter((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalValue = totalInvValue
  const lowStockCount = inventoryItems.filter((item: any) => item.status === "low").length
  const criticalStockCount = inventoryItems.filter((item: any) => item.status === "critical").length

  return (
    <>
      <PimpinanHeader title="Laporan Inventory" description="Monitor stok dan pergerakan barang" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Inventory</h1>
            <p className="text-muted-foreground">Monitor stok dan pergerakan barang</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all"><SelectTrigger className="w-[150px]"><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Kategori</SelectItem><SelectItem value="oli">Oli & Pelumas</SelectItem><SelectItem value="filter">Filter</SelectItem><SelectItem value="rem">Rem</SelectItem><SelectItem value="kelistrikan">Kelistrikan</SelectItem></SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={isExporting}
                  className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-primary/20 text-[10px]"
                >
                  {isExporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}
                  Export Data
                  <ChevronDown className="ml-2 size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-zinc-950 border-white/10 text-white shadow-2xl">
                <DropdownMenuItem onClick={() => handleExport('excel')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileSpreadsheet className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <FileText className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">PDF Document (.pdf)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Item</CardTitle><Package className="size-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{inventoryItems.length}</div><p className="text-xs text-muted-foreground">jenis barang</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Nilai Stok</CardTitle><Package className="size-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatRupiah(totalValue)}</div><div className="flex items-center gap-1 text-xs text-emerald-500"><ArrowUpRight className="size-3" /><span>+5% dari bulan lalu</span></div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Stok Rendah</CardTitle><AlertTriangle className="size-4 text-amber-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-500">{lowStockCount}</div><p className="text-xs text-muted-foreground">item perlu restock</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Stok Kritis</CardTitle><AlertTriangle className="size-4 text-destructive" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-destructive">{criticalStockCount}</div><p className="text-xs text-muted-foreground">item segera habis</p></CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Pergerakan Stok</CardTitle><CardDescription>Barang masuk vs keluar 6 bulan terakhir</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={stockMovement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={({ active, payload, label }) => { if (active && payload && payload.length) { return (<div className="rounded-lg border bg-background p-3 shadow-lg"><p className="font-medium">{label}</p>{payload.map((entry, index) => (<p key={index} className="text-sm" style={{ color: entry.color }}>{entry.name}: {entry.value} unit</p>))}</div>); } return null; }} />
                  <Legend />
                  <Bar dataKey="masuk" name="Barang Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="keluar" name="Barang Keluar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Distribusi Kategori</CardTitle><CardDescription>Berdasarkan nilai stok</CardDescription></CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[200px] w-full">
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {categoryDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => { if (active && payload && payload.length) { const data = payload[0].payload; return (<div className="rounded-lg border bg-background p-3 shadow-lg"><p className="font-medium">{data.name}</p><p className="text-sm text-muted-foreground">{data.value}%</p></div>); } return null; }} />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {categoryDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><div className="size-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><CardTitle>Daftar Inventory</CardTitle><CardDescription>Semua item dalam stok</CardDescription></div>
              <div className="flex items-center gap-2">
                <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Cari item atau SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-[250px] pl-9" /></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Item</TableHead><TableHead>SKU</TableHead><TableHead>Kategori</TableHead><TableHead className="text-right">Stok</TableHead><TableHead>Level</TableHead><TableHead className="text-right">Harga</TableHead><TableHead className="text-right">Nilai</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">Tidak ada item ditemukan</TableCell></TableRow>
                ) : filteredItems.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">{item.stock} {item.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min((item.stock / item.maxStock) * 100, 100)} className={`h-2 w-16 ${item.status === "critical" ? "[&>div]:bg-destructive" : item.status === "low" ? "[&>div]:bg-amber-500" : ""}`} />
                        <span className="text-xs text-muted-foreground">{Math.round(Math.min((item.stock / item.maxStock) * 100, 100))}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatRupiah(item.price)}</TableCell>
                    <TableCell className="text-right font-medium">{formatRupiah(item.value)}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "normal" ? "default" : item.status === "low" ? "secondary" : "destructive"} className={item.status === "normal" ? "bg-emerald-500 hover:bg-emerald-600" : item.status === "low" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}>
                        {item.status === "normal" ? "Normal" : item.status === "low" ? "Rendah" : "Kritis"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader><CardTitle>Transaksi Terakhir</CardTitle><CardDescription>Riwayat keluar masuk barang</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Tanggal</TableHead><TableHead>Item</TableHead><TableHead>Tipe</TableHead><TableHead className="text-right">Qty</TableHead><TableHead>Referensi</TableHead><TableHead>Oleh</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : recentTransactions.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Belum ada riwayat transaksi</TableCell></TableRow>
                ) : recentTransactions.map((tx: any, index: number) => (
                  <TableRow key={tx.id || index}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell className="font-medium">{tx.item}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "in" ? "default" : "secondary"} className={tx.type === "in" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600 text-white"}>
                        {tx.type === "in" ? <><ArrowDownRight className="mr-1 size-3" />Masuk</> : <><ArrowUpRight className="mr-1 size-3" />Keluar</>}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{tx.quantity}</TableCell>
                    <TableCell><Badge variant="outline">{tx.spk}</Badge></TableCell>
                    <TableCell>{tx.by}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
