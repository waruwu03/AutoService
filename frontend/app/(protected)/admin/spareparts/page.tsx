"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher, api, formatCurrency } from "@/lib/api-client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Package,
  Search,
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Trash2,
  TrendingDown,
  ArrowUpDown,
  X,
} from "lucide-react"
import { toast } from "sonner"

// ─── Types ───────────────────────────────────────────────────────────────────
type SparepartCategory =
  | "OLI_PELUMAS" | "FILTER" | "BRAKE" | "SUSPENSION" | "ENGINE"
  | "TRANSMISSION" | "ELECTRICAL" | "BODY" | "AC" | "TIRE_WHEEL"
  | "ACCESSORIES" | "CONSUMABLE" | "LAINNYA"

interface Sparepart {
  id: string
  code: string
  name: string
  description?: string | null
  category: SparepartCategory
  brand?: string | null
  unit: string
  buyPrice: number
  sellPrice: number
  stockQuantity: number
  minStock: number
  maxStock?: number | null
  location?: string | null
  isActive: boolean
  supplier?: { id: string; name: string } | null
}

const categoryLabels: Record<SparepartCategory, string> = {
  OLI_PELUMAS:  "Oli & Pelumas",
  FILTER:       "Filter",
  BRAKE:        "Rem",
  SUSPENSION:   "Suspensi",
  ENGINE:       "Mesin",
  TRANSMISSION: "Transmisi",
  ELECTRICAL:   "Elektrikal",
  BODY:         "Body",
  AC:           "AC",
  TIRE_WHEEL:   "Ban & Velg",
  ACCESSORIES:  "Aksesori",
  CONSUMABLE:   "Consumable",
  LAINNYA:      "Lainnya",
}

const EMPTY_FORM = {
  code: "", name: "", description: "", category: "LAINNYA" as SparepartCategory,
  brand: "", unit: "PCS", buyPrice: 0, sellPrice: 0,
  stockQuantity: 0, minStock: 5, maxStock: null as number | null, location: "",
}

// ─── Sparepart Form ───────────────────────────────────────────────────────────
function SparepartForm({
  initial,
  onClose,
  onSuccess,
}: {
  initial?: Sparepart | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState(
    initial
      ? {
          code: initial.code,
          name: initial.name,
          description: initial.description ?? "",
          category: initial.category,
          brand: initial.brand ?? "",
          unit: initial.unit,
          buyPrice: initial.buyPrice,
          sellPrice: initial.sellPrice,
          stockQuantity: initial.stockQuantity,
          minStock: initial.minStock,
          maxStock: initial.maxStock,
          location: initial.location ?? "",
        }
      : { ...EMPTY_FORM }
  )
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.name) {
      toast.error("Kode dan nama wajib diisi")
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        stockQuantity: Number(form.stockQuantity),
        minStock: Number(form.minStock),
        maxStock: form.maxStock ? Number(form.maxStock) : null,
        description: form.description || null,
        brand: form.brand || null,
        location: form.location || null,
      }
      if (initial) {
        await api.put(`/inventory/spareparts/${initial.id}`, payload)
        toast.success("Sparepart berhasil diperbarui")
      } else {
        await api.post("/inventory/spareparts", payload)
        toast.success("Sparepart berhasil ditambahkan")
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menyimpan sparepart")
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: string, props: any = {}) => (
    <div className="space-y-1">
      <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">{label}</label>
      <Input 
        value={(form as any)[key]} 
        onChange={(e) => set(key, e.target.value)} 
        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
        {...props} 
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {field("Kode *", "code", { placeholder: "SP-001" })}
        {field("Nama Sparepart *", "name", { placeholder: "Oli Mesin Shell Helix" })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Kategori *</label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {field("Merk / Brand", "brand", { placeholder: "Shell, Denso, NGK..." })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("Harga Beli (Rp)", "buyPrice",  { type: "number", min: 0 })}
        {field("Harga Jual (Rp)", "sellPrice", { type: "number", min: 0 })}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {field("Stok Awal", "stockQuantity", { type: "number", min: 0 })}
        {field("Stok Min", "minStock",       { type: "number", min: 0 })}
        {field("Satuan",   "unit",           { placeholder: "PCS, LTR, SET..." })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("Lokasi Rak", "location", { placeholder: "A1, B2..." })}
        {field("Deskripsi", "description", { placeholder: "Keterangan tambahan" })}
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={loading}>Batal</Button>
        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Menyimpan...</> : "Simpan"}
        </Button>
      </div>
    </form>
  )
}

// ─── Adjust Stock Form ────────────────────────────────────────────────────────
function AdjustStockForm({
  sparepart,
  onClose,
  onSuccess,
}: {
  sparepart: Sparepart
  onClose: () => void
  onSuccess: () => void
}) {
  const [qty, setQty] = useState(1)
  const [type, setType] = useState<"in" | "out">("in")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) { toast.error("Alasan wajib diisi"); return }
    setLoading(true)
    try {
      await api.post(`/inventory/spareparts/${sparepart.id}/adjust`, {
        quantity: Number(qty),
        type,
        reason,
      })
      toast.success("Stok berhasil diperbarui")
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal adjust stok")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Sparepart</span><span className="font-semibold">{sparepart.name}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Stok Saat Ini</span><span className="font-bold text-lg">{sparepart.stockQuantity} {sparepart.unit}</span></div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Tipe Penyesuaian</label>
        <Select value={type} onValueChange={(v) => setType(v as "in" | "out")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="in">➕ Stok Masuk</SelectItem>
            <SelectItem value="out">➖ Stok Keluar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Jumlah</label>
        <Input type="number" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Alasan / Keterangan *</label>
        <Input placeholder="Pembelian baru, koreksi stok..." value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Batal</Button>
        <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 size-4 animate-spin" />Memproses...</> : "Konfirmasi"}
        </Button>
      </div>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SparePartsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<SparepartCategory | "all">("all")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [selected, setSelected] = useState<Sparepart | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    "/inventory/spareparts?limit=500&sortBy=name&sortOrder=asc",
    fetcher
  )

  const spareparts: Sparepart[] = Array.isArray(data?.data)
    ? data.data : Array.isArray(data) ? data : []

  const filtered = spareparts.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase()) ||
      s.brand?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === "all" || s.category === categoryFilter
    const matchStock =
      stockFilter === "all"
        ? true
        : stockFilter === "low"
        ? s.stockQuantity <= s.minStock
        : s.stockQuantity > s.minStock
    return matchSearch && matchCat && matchStock
  })

  const lowStockCount = spareparts.filter((s) => s.stockQuantity <= s.minStock).length
  const totalValue = spareparts.reduce((acc, s) => acc + s.stockQuantity * s.sellPrice, 0)

  const handleDelete = async (s: Sparepart) => {
    if (!confirm(`Nonaktifkan sparepart "${s.name}"?`)) return
    try {
      await api.delete(`/inventory/spareparts/${s.id}`)
      toast.success("Sparepart dinonaktifkan")
      mutate()
    } catch {
      toast.error("Gagal menghapus sparepart")
    }
  }

  const openEdit = (s: Sparepart) => { setSelected(s); setFormOpen(true) }
  const openAdjust = (s: Sparepart) => { setSelected(s); setAdjustOpen(true) }
  const openCreate = () => { setSelected(null); setFormOpen(true) }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setFormOpen(false)
      setIsClosing(false)
      setSelected(null)
    }, 450)
  }

  return (
    <>
      <AdminHeader title="Manajemen Sparepart" description="Kelola stok dan data sparepart bengkel" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total Sparepart"
              value={isLoading ? "..." : `${spareparts.length} item`}
              icon={Package}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Stok Kritis"
              value={isLoading ? "..." : `${lowStockCount} item`}
              icon={AlertTriangle}
              colorTheme="red"
              criticalAlert={lowStockCount > 0}
            />
            <PremiumStatCard
              title="Stok Normal"
              value={isLoading ? "..." : `${spareparts.length - lowStockCount} item`}
              icon={CheckCircle2}
              colorTheme="emerald"
            />
            <PremiumStatCard
              title="Nilai Stok"
              value={isLoading ? "..." : formatCurrency(totalValue)}
              icon={TrendingDown}
              colorTheme="purple"
            />
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Sparepart</CardTitle>
                  <CardDescription>{filtered.length} sparepart ditemukan</CardDescription>
                </div>
                <Button id="add-sparepart-btn" className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm rounded-xl" onClick={openCreate}>
                  <Plus className="mr-2 size-4" /> Tambah Sparepart
                </Button>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="sparepart-search" placeholder="Cari nama, kode, atau merk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white rounded-xl" />
                </div>
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
                  <SelectTrigger className="w-full sm:w-44 bg-white rounded-xl"><SelectValue placeholder="Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {Object.entries(categoryLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as any)}>
                  <SelectTrigger className="w-full sm:w-36 bg-white rounded-xl"><SelectValue placeholder="Stok" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Stok</SelectItem>
                    <SelectItem value="low">⚠ Stok Kritis</SelectItem>
                    <SelectItem value="ok">✅ Stok Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Package className="size-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">Tidak ada sparepart ditemukan</p>
                  <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl" onClick={openCreate}><Plus className="mr-2 size-4" />Tambah Sparepart</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Sparepart</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Merk</TableHead>
                        <TableHead className="text-right">Harga Jual</TableHead>
                        <TableHead className="text-center">Stok</TableHead>
                        <TableHead className="text-center">Min</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((s) => {
                        const isLow = s.stockQuantity <= s.minStock
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="font-mono text-xs font-semibold">{s.code}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{s.name}</p>
                                {s.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{s.description}</p>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs rounded-full">{categoryLabels[s.category] ?? s.category}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{s.brand ?? "-"}</TableCell>
                            <TableCell className="text-right text-sm font-medium">{formatCurrency(s.sellPrice)}</TableCell>
                            <TableCell className="text-center">
                              <span className={`font-bold text-sm ${isLow ? "text-red-600" : "text-green-600"}`}>
                                {isLow && <AlertTriangle className="inline size-3 mr-1" />}
                                {s.stockQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">{s.minStock}</TableCell>
                            <TableCell className="text-sm">{s.unit}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{s.location ?? "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button size="icon" variant="ghost" className="size-7 rounded-full" onClick={() => openAdjust(s)} title="Adjust Stok">
                                  <ArrowUpDown className="size-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="size-7 rounded-full" onClick={() => openEdit(s)} title="Edit">
                                  <Pencil className="size-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="size-7 text-destructive hover:text-destructive rounded-full" onClick={() => handleDelete(s)} title="Hapus">
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Drawer Implementation */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-slate-950/20 backdrop-blur-md transition-opacity duration-500 ${isClosing ? "opacity-0" : "animate-in fade-in"}`}
            onClick={handleClose}
          />
          
          {/* Drawer Content */}
          <div className={`relative w-full max-w-xl bg-white dark:bg-zinc-900 h-full shadow-2xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-in-out ${isClosing ? "translate-x-full" : "animate-in slide-in-from-right"}`}>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                      {selected ? "Edit" : "Tambah"} <span className="text-primary">Sparepart</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {selected ? `Perbarui data untuk ${selected.name}` : "Tambahkan sparepart baru ke inventori."}
                    </p>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-red-500/10 hover:text-red-500 border-slate-200 dark:border-white/10" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <SparepartForm 
                    initial={selected} 
                    onClose={handleClose} 
                    onSuccess={() => mutate()} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ArrowUpDown className="size-5" />Adjust Stok</DialogTitle>
            <DialogDescription>Sesuaikan jumlah stok sparepart</DialogDescription>
          </DialogHeader>
          {selected && <AdjustStockForm sparepart={selected} onClose={() => setAdjustOpen(false)} onSuccess={() => mutate()} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
