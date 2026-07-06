"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus, Search, Filter, ShieldCheck, MoreVertical, Edit, Trash2, Eye, Loader2, Phone, Mail, MapPin, Calendar, Users, Shield } from "lucide-react"
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
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export default function TeamPage() {
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { user: currentUser } = useAuth()

  // Get all users
  const { data: usersRaw, isLoading, mutate } = useSWR(
    "/users?limit=100",
    fetcher
  )

  const users: any[] = Array.isArray(usersRaw?.data) ? usersRaw.data : Array.isArray(usersRaw) ? usersRaw : []

  // Stats
  const activeCount = users.filter((u: any) => u.isActive !== false).length
  const adminCount = users.filter((u: any) => u.role === "ADMIN").length
  const mechanicCount = users.filter((u: any) => u.role === "MEKANIK").length

  // Filtered list
  const filtered = users.filter((u: any) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selectedUser) return
    if (selectedUser.id === currentUser?.id) {
      toast.error("Anda tidak dapat menghapus akun Anda sendiri")
      return
    }
    
    setIsDeleting(true)
    try {
      await api.delete(`/users/${selectedUser.id}`)
      toast.success("Anggota tim berhasil dihapus")
      mutate()
      setIsDeleteOpen(false)
      setSelectedUser(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus anggota tim")
    } finally {
      setIsDeleting(false)
    }
  }

  const openDetail = async (user: any) => {
    try {
      const res = await api.get(`/users/${user.id}`) as any
      const fullData = res.data?.data || res.data || user
      setSelectedUser({ ...user, ...fullData })
    } catch {
      setSelectedUser(user)
    }
    setIsDetailOpen(true)
  }

  const openDelete = (user: any) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'PIMPINAN': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
      case 'GUDANG': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
      case 'MEKANIK': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  return (
    <>
      <AdminHeader title="Manajemen Tim" description="Kelola akses dan peran seluruh anggota tim AutoService." />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <PremiumStatCard
            title="Total Anggota Aktif"
            value={isLoading ? "..." : activeCount.toString()}
            icon={Users}
            colorTheme="blue"
          />
          <PremiumStatCard
            title="Total Admin"
            value={isLoading ? "..." : adminCount.toString()}
            icon={ShieldCheck}
            colorTheme="emerald"
          />
          <PremiumStatCard
            title="Total Mekanik"
            value={isLoading ? "..." : mechanicCount.toString()}
            icon={Shield}
            colorTheme="amber"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input
                placeholder="Cari anggota tim..."
                className="pl-9 bg-white dark:bg-zinc-900 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto shadow-sm rounded-xl">
            <Link href="/admin/team/create">
              <Plus className="size-4 mr-2" /> Tambah Anggota Tim
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-zinc-900/50">
                <TableRow>
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead>Anggota Tim</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data tim...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada anggota tim ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user: any, i: number) => {
                    const name = user.name || "-"
                    const isActive = user.isActive !== false
                    return (
                      <TableRow key={user.id || i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="text-center font-medium">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-slate-200 dark:border-white/10">
                              <AvatarImage src={resolvePhotoUrl(user.photoUrl)} />
                              <AvatarFallback className="font-bold text-xs bg-slate-800 text-primary">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{name}</span>
                              {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border-none shadow-none text-[10px] font-black uppercase tracking-widest", getRoleBadgeColor(user.role))}>
                            {user.role}
                          </Badge>
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
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                                <MoreVertical className="size-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-2xl">
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-slate-600 dark:text-slate-300 rounded-xl"
                                onClick={() => openDetail(user)}
                              >
                                <Eye className="size-4 mr-2" /> Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-amber-600 rounded-xl"
                                asChild
                              >
                                <Link href={`/admin/team/${user.id}/edit`}>
                                  <Edit className="size-4 mr-2" /> Edit Peran
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer font-medium text-red-600 focus:text-red-600 rounded-xl"
                                onClick={() => openDelete(user)}
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
          <DialogContent className="max-w-2xl rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Detail Anggota Tim</DialogTitle>
              <DialogDescription>
                Informasi akses dan identitas.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <Avatar className="size-24 border-4 border-slate-100 dark:border-white/10 shadow-sm">
                    <AvatarImage src={resolvePhotoUrl(selectedUser.photoUrl)} />
                    <AvatarFallback className="text-2xl font-bold bg-slate-800 text-primary">{(selectedUser.name || "?").substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedUser.name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="size-4" /> {selectedUser.email || "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="size-4" /> {selectedUser.phone || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start mt-2">
                      <Badge className={cn("border-none text-[10px] uppercase font-black", getRoleBadgeColor(selectedUser.role))}>
                        {selectedUser.role}
                      </Badge>
                      <Badge className={selectedUser.isActive !== false ? "bg-emerald-500 border-none text-[10px] uppercase font-black" : "bg-slate-400 border-none text-[10px] uppercase font-black"}>
                        {selectedUser.isActive !== false ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MapPin className="size-4" /> Alamat
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    {selectedUser.address || "Alamat tidak tersedia."}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button className="rounded-xl" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-red-600">Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus <strong>{selectedUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
                Batal
              </Button>
              <Button variant="destructive" className="rounded-xl" onClick={handleDelete} disabled={isDeleting}>
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
