"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Plus, Search, Filter, Wrench, Star, MoreVertical, Edit, Trash2, Eye, Loader2, Phone, Mail, MapPin, Calendar, CheckCircle2, Users, TrendingUp } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import { toast } from "sonner"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

export default function MechanicsPage() {
  const [search, setSearch] = useState("")
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 1. Get all MEKANIK users from the users API
  const { data: usersRaw, isLoading: loadingUsers, mutate } = useSWR(
    "/users?role=MEKANIK&limit=100",
    fetcher
  )

  // 2. Get performance data from the reports API
  const { data: perfRaw, isLoading: loadingPerf } = useSWR(
    "/reports/mechanics?startDate=2024-01-01&endDate=2026-12-31",
    fetcher
  )

  const isLoading = loadingUsers || loadingPerf

  // Normalize users data
  const users: any[] = useMemo(() => {
    const list = Array.isArray(usersRaw?.data) ? usersRaw.data : Array.isArray(usersRaw) ? usersRaw : []
    const perf: any[] = Array.isArray(perfRaw) ? perfRaw : []
    
    // Create a map of mechanic ID -> performance data
    const perfMap = new Map<string, any>()
    perf.forEach((p: any) => perfMap.set(p.id, p))

    // Merge user data with performance data
    return list.map((u: any) => {
      const p = perfMap.get(u.id) || {}
      return {
        ...u,
        totalOrders: p.totalOrders || 0,
        completed: p.completed || 0,
        inProgress: p.inProgress || 0,
        totalRevenue: p.totalRevenue || 0,
      }
    })
  }, [usersRaw, perfRaw])

  // KPI Stats
  const activeCount = users.filter((m: any) => m.isActive !== false).length
  const totalSPK = users.reduce((sum: number, m: any) => sum + (m.totalOrders || 0), 0)
  const totalCompleted = users.reduce((sum: number, m: any) => sum + (m.completed || 0), 0)

  // Filtered list
  const filtered = users.filter((m: any) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selectedMechanic) return
    setIsDeleting(true)
    try {
      await api.delete(`/users/${selectedMechanic.id}`)
      toast.success("Mekanik berhasil dihapus")
      mutate()
      setIsDeleteOpen(false)
      setSelectedMechanic(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus mekanik")
    } finally {
      setIsDeleting(false)
    }
  }

  const openDetail = async (mekanik: any) => {
    // Fetch full detail to get address, phone etc.
    try {
      const res = await api.get(`/users/${mekanik.id}`) as any
      const fullData = res.data?.data || res.data || mekanik
      setSelectedMechanic({ ...mekanik, ...fullData })
    } catch {
      setSelectedMechanic(mekanik)
    }
    setIsDetailOpen(true)
  }

  const openDelete = (mekanik: any) => {
    setSelectedMechanic(mekanik)
    setIsDeleteOpen(true)
  }

  return (
    <>
      <AdminHeader title="Manajemen Mekanik" description="Kelola tim mekanik dan pantau performa mereka." />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <PremiumStatCard
            title="Total Mekanik Aktif"
            value={isLoading ? "..." : activeCount.toString()}
            icon={Users}
            colorTheme="blue"
          />
          <PremiumStatCard
            title="Total SPK Ditangani"
            value={isLoading ? "..." : totalSPK.toString()}
            icon={Wrench}
            colorTheme="amber"
          />
          <PremiumStatCard
            title="SPK Selesai"
            value={isLoading ? "..." : totalCompleted.toString()}
            icon={CheckCircle2}
            colorTheme="emerald"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input
                placeholder="Cari mekanik..."
                className="pl-9 bg-white dark:bg-zinc-900"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto shadow-sm">
            <Link href="/admin/mechanics/create">
              <Plus className="size-4 mr-2" /> Tambah Mekanik Baru
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead>Nama Mekanik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Total SPK</TableHead>
                  <TableHead className="text-center">Selesai</TableHead>
                  <TableHead className="text-center">Sedang Dikerjakan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data mekanik...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada mekanik ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((mekanik: any, i: number) => {
                    const name = mekanik.name || "-"
                    const isActive = mekanik.isActive !== false
                    return (
                      <TableRow key={mekanik.id || i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="text-center font-medium">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-slate-200 dark:border-white/10">
                              <AvatarImage src={resolvePhotoUrl(mekanik.photoUrl)} />
                              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{name}</span>
                              {mekanik.email && <p className="text-xs text-muted-foreground">{mekanik.email}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              isActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none dark:bg-emerald-500/20 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-none shadow-none dark:bg-slate-500/20 dark:text-slate-400"
                            }
                          >
                            {isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-700 dark:text-slate-300">{mekanik.totalOrders}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{mekanik.completed}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{mekanik.inProgress}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-white/10">
                                <MoreVertical className="size-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-slate-600 dark:text-slate-300"
                                onClick={() => openDetail(mekanik)}
                              >
                                <Eye className="size-4 mr-2" /> Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-amber-600"
                                asChild
                              >
                                <Link href={`/admin/mechanics/${mekanik.id}/edit`}>
                                  <Edit className="size-4 mr-2" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-red-600 focus:text-red-600"
                                onClick={() => openDelete(mekanik)}
                              >
                                <Trash2 className="size-4 mr-2" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Mekanik</DialogTitle>
              <DialogDescription>
                Informasi lengkap dan performa mekanik.
              </DialogDescription>
            </DialogHeader>
            {selectedMechanic && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <Avatar className="size-24 border-4 border-slate-100 dark:border-white/10 shadow-sm">
                    <AvatarImage src={resolvePhotoUrl(selectedMechanic.photoUrl)} />
                    <AvatarFallback className="text-2xl font-bold">{(selectedMechanic.name || "?").substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedMechanic.name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="size-4" /> {selectedMechanic.email || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="size-4" /> {selectedMechanic.phone || "-"}
                      </div>
                    </div>
                    <Badge className={selectedMechanic.isActive !== false ? "bg-emerald-500" : "bg-slate-400"}>
                      {selectedMechanic.isActive !== false ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-50 dark:bg-zinc-900/60 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <CheckCircle2 className="size-6 text-emerald-500 mb-2" />
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedMechanic.totalOrders || 0}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Total SPK</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-zinc-900/60 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <TrendingUp className="size-6 text-blue-500 mb-2" />
                      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedMechanic.completed || 0}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Selesai</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-zinc-900/60 border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Calendar className="size-6 text-blue-500 mb-2" />
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                        {selectedMechanic.createdAt ? new Date(selectedMechanic.createdAt).toLocaleDateString('id-ID') : "-"}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Bergabung</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MapPin className="size-4" /> Alamat
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                    {selectedMechanic.address || "Alamat tidak tersedia."}
                  </p>
                </div>

                {selectedMechanic.totalRevenue > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-500/10 p-4 rounded-xl border border-orange-100 dark:border-orange-500/20">
                    <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider mb-1">Total Pendapatan Jasa</p>
                    <p className="text-xl font-black text-orange-700 dark:text-orange-300">
                      Rp {Number(selectedMechanic.totalRevenue || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailOpen(false)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus mekanik <strong>{selectedMechanic?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                Jika mekanik memiliki riwayat pekerjaan, statusnya hanya akan diubah menjadi tidak aktif.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ya, Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
