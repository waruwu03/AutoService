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

const inventoryItems = [
  { id: 1, name: "Oli Mesin 10W-40", sku: "OIL-10W40-001", category: "Oli", stock: 45, minStock: 20, maxStock: 100, unit: "Liter", price: 85000, value: 3825000, status: "normal" },
  { id: 2, name: "Filter Oli Universal", sku: "FIL-OIL-001", category: "Filter", stock: 32, minStock: 15, maxStock: 60, unit: "Pcs", price: 45000, value: 1440000, status: "normal" },
  { id: 3, name: "Kampas Rem Depan", sku: "BRK-PAD-001", category: "Rem", stock: 8, minStock: 10, maxStock: 40, unit: "Set", price: 250000, value: 2000000, status: "low" },
  { id: 4, name: "Busi Iridium", sku: "SPK-IRD-001", category: "Kelistrikan", stock: 24, minStock: 20, maxStock: 80, unit: "Pcs", price: 120000, value: 2880000, status: "normal" },
  { id: 5, name: "Freon AC R134a", sku: "AC-FRN-001", category: "AC", stock: 3, minStock: 5, maxStock: 20, unit: "Kaleng", price: 150000, value: 450000, status: "critical" },
  { id: 6, name: "Minyak Rem DOT 4", sku: "BRK-FLU-001", category: "Rem", stock: 18, minStock: 10, maxStock: 30, unit: "Botol", price: 65000, value: 1170000, status: "normal" },
  { id: 7, name: "V-Belt Set", sku: "BLT-SET-001", category: "Mesin", stock: 6, minStock: 8, maxStock: 25, unit: "Set", price: 350000, value: 2100000, status: "low" },
  { id: 8, name: "Air Radiator Coolant", sku: "RAD-COL-001", category: "Pendingin", stock: 25, minStock: 15, maxStock: 50, unit: "Liter", price: 45000, value: 1125000, status: "normal" },
]

const stockMovement = [
  { month: "Jun", masuk: 150, keluar: 130 },
  { month: "Jul", masuk: 180, keluar: 160 },
  { month: "Aug", masuk: 165, keluar: 155 },
  { month: "Sep", masuk: 190, keluar: 170 },
  { month: "Okt", masuk: 175, keluar: 165 },
  { month: "Nov", masuk: 145, keluar: 140 },
]

const categoryDistribution = [
  { name: "Oli & Pelumas", value: 35, color: "#3b82f6" },
  { name: "Filter", value: 20, color: "#10b981" },
  { name: "Rem", value: 18, color: "#f59e0b" },
  { name: "Kelistrikan", value: 15, color: "#8b5cf6" },
  { name: "Lainnya", value: 12, color: "#6b7280" },
]

const recentTransactions = [
  { date: "2024-11-15", item: "Oli Mesin 10W-40", type: "out", quantity: 5, spk: "SPK-2024-0145", by: "Andi Susanto" },
  { date: "2024-11-15", item: "Filter Oli Universal", type: "out", quantity: 2, spk: "SPK-2024-0145", by: "Andi Susanto" },
  { date: "2024-11-14", item: "Oli Mesin 10W-40", type: "in", quantity: 50, spk: "PO-2024-089", by: "Admin Gudang" },
  { date: "2024-11-14", item: "Kampas Rem Depan", type: "out", quantity: 2, spk: "SPK-2024-0143", by: "Cahyo Wibowo" },
  { date: "2024-11-13", item: "Busi Iridium", type: "out", quantity: 4, spk: "SPK-2024-0142", by: "Beni Kurniawan" },
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export default function InventoryReportPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const filteredItems = inventoryItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
  const lowStockCount = inventoryItems.filter((item) => item.status === "low").length
  const criticalStockCount = inventoryItems.filter((item) => item.status === "critical").length

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
            <Button><Download className="mr-2 size-4" /> Export</Button>
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
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">{item.stock} {item.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={(item.stock / item.maxStock) * 100} className={`h-2 w-16 ${item.status === "critical" ? "[&>div]:bg-destructive" : item.status === "low" ? "[&>div]:bg-amber-500" : ""}`} />
                        <span className="text-xs text-muted-foreground">{Math.round((item.stock / item.maxStock) * 100)}%</span>
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
                {recentTransactions.map((tx, index) => (
                  <TableRow key={index}>
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
