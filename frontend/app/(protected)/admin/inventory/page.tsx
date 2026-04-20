"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
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
import { AlertTriangle, Info, Plus, Search, Filter, Pencil, Trash2, Package, Receipt } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"

const inventoryData = [
  { id: "PRT-001", name: "Oli Mesin Shell AX7", category: "Oli", price: 55000, stock: 45, status: "Aman" },
  { id: "PRT-002", name: "Kampas Rem Depan NMAX", category: "Sparepart", price: 85000, stock: 2, status: "Kritis" },
  { id: "PRT-003", name: "Filter Udara Beat", category: "Sparepart", price: 45000, stock: 6, status: "Mendekati Minimum" },
  { id: "PRT-004", name: "Busi NGK CPR7EA-9", category: "Sparepart", price: 25000, stock: 120, status: "Aman" },
  { id: "PRT-005", name: "V-Belt PCX 150", category: "Sparepart", price: 150000, stock: 1, status: "Kritis" },
]

export default function InventoryPage() {
  const [search, setSearch] = useState("")

  const getStockBadge = (status: string, stock: number) => {
    if (status === "Aman") return <Badge className="bg-emerald-100 text-emerald-800 border-none px-3 font-semibold shadow-none">{stock} Pcs (Aman)</Badge>;
    if (status === "Mendekati Minimum") return <Badge className="bg-amber-100 text-amber-800 border-none px-3 font-semibold shadow-none">{stock} Pcs (Warning)</Badge>;
    return <Badge className="bg-red-100 text-red-800 border-none animate-pulse px-3 font-bold shadow-none">{stock} Pcs (Kritis)</Badge>;
  }

  const criticalCount = inventoryData.filter(i => i.status === "Kritis").length

  return (
    <>
      <AdminHeader title="Stok Barang" description="Manajemen inventori suku cadang dan sparepart bengkel." />
      <div className="p-6 space-y-6">
        
        {/* Critical Stock Alert */}
        {criticalCount > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 shadow-sm flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full self-start">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertTitle className="text-red-800 font-bold text-base mb-1">Peringatan Stok Kritis!</AlertTitle>
              <AlertDescription className="text-red-700">
                Terdapat <strong>{criticalCount}</strong> jenis barang yang stoknya habis atau di bawah batas. Segera lakukan restock agar tidak mengganggu operasional bengkel.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard title="Total Kemasan (Item)" value="5 Macam" icon={Package} />
          <StatsCard title="Parts Status Kritis" value={criticalCount.toString()} icon={AlertTriangle} />
          <StatsCard title="Total Nilai Kapital" value="Rp 8.540.000" icon={Receipt} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input 
                placeholder="Cari kode atau nama part..." 
                className="pl-9 bg-white" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white font-medium">
              <Filter className="size-4 mr-2" /> Kategori
            </Button>
          </div>
          <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 w-full sm:w-auto font-bold shadow-sm">
            <Plus className="size-4 mr-2 stroke-[3px]" /> Tambah Part
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-900 pl-4">Kode Part</TableHead>
                  <TableHead className="font-semibold text-slate-900">Nama Part</TableHead>
                  <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Harga Jual</TableHead>
                  <TableHead className="font-semibold px-6 text-slate-900">Stok Terkini</TableHead>
                  <TableHead className="text-center font-semibold text-slate-900 pr-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.filter(item => 
                  item.name.toLowerCase().includes(search.toLowerCase()) || 
                  item.id.toLowerCase().includes(search.toLowerCase())
                ).map((item) => (
                  <TableRow key={item.id} className={item.status === 'Kritis' ? "bg-red-50/50" : ""}>
                    <TableCell className="font-semibold text-slate-700 pl-4">{item.id}</TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-slate-100">{item.name}</TableCell>
                    <TableCell className="font-medium text-slate-600">{item.category}</TableCell>
                    <TableCell className="text-right font-bold text-slate-800">Rp {item.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="px-6">{getStockBadge(item.status, item.stock)}</TableCell>
                    <TableCell className="text-center pr-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
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
