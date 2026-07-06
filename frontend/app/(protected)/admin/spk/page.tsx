"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { SPKDetailModal } from "@/components/admin/spk-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/api-client"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const formatDate = (date: string | Date | number) => {
  if (!date) return '-'
  return format(new Date(date), 'dd MMMM yyyy', { locale: id })
}
import type { SPK, SPKStatus } from "@/types"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import { Loader2, Plus, Search, MoreHorizontal, Eye, Play, CheckCircle, XCircle } from "lucide-react"

const statusConfig: Record<SPKStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PENDING: { label: "Pending", variant: "secondary" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  WAITING_PARTS: { label: "Tunggu Parts", variant: "outline" },
  QUALITY_CHECK: { label: "Cek Kualitas", variant: "secondary" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  INVOICED: { label: "Ditagihkan", variant: "outline" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
}

export default function SPKPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<SPKStatus | "all">("all")
  const [mechanicFilter, setMechanicFilter] = useState<string>("all")
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSPK, setSelectedSPK] = useState<SPK | null>(null)

  const { data: woData, mutate: mutateWO, isLoading } = useSWR('/work-orders?limit=100&sortBy=createdAt&sortOrder=desc', fetcher)
  const spkList = Array.isArray(woData?.data) ? woData.data : []
  
  const { data: mechanicsData } = useSWR('/reports/mechanics?startDate=2024-01-01&endDate=2025-12-31', fetcher)
  const mechanics = Array.isArray(mechanicsData) ? mechanicsData : []

  const filteredSPKs = spkList.filter((spk: any) => {
    const customerName = spk.customer?.name || ""
    const plateNumber = spk.vehicle?.licensePlate || spk.vehicle?.plateNumber || ""
    const matchesSearch =
      (spk.orderNumber || spk.spkNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || spk.status === statusFilter
    const matchesMechanic =
      mechanicFilter === "all" ||
      (mechanicFilter === "unassigned" && !spk.assignedMechanicId) ||
      spk.assignedMechanicId === mechanicFilter
    return matchesSearch && matchesStatus && matchesMechanic
  })

  const handleCreateSPK = async (data: any) => {
    try {
      await api.post("/work-orders", data)
      await mutateWO()
    } catch (error) {
      console.error("Gagal membuat SPK:", error)
    }
  }

  const handleUpdateStatus = async (spkId: string, newStatus: SPKStatus) => {
    try {
      await api.put(`/work-orders/${spkId}/status`, { status: newStatus })
      await mutateWO()
      setDetailModalOpen(false)
    } catch (error) {
      console.error("Gagal update status SPK:", error)
    }
  }

  const viewSPKDetail = (spk: SPK) => {
    setSelectedSPK(spk)
    setDetailModalOpen(true)
  }

  return (
    <>
      <AdminHeader
        title="Surat Perintah Kerja (SPK)"
        description="Kelola semua SPK dan status pekerjaan"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total SPK"
              value={isLoading ? "..." : spkList.length}
              icon={FileText}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Pending"
              value={isLoading ? "..." : spkList.filter((s: any) => s.status === "PENDING").length}
              icon={Clock}
              colorTheme="amber"
            />
            <PremiumStatCard
              title="Dikerjakan"
              value={isLoading ? "..." : spkList.filter((s: any) => s.status === "IN_PROGRESS").length}
              icon={Wrench}
              colorTheme="orange"
            />
            <PremiumStatCard
              title="Selesai"
              value={isLoading ? "..." : spkList.filter((s: any) => s.status === "COMPLETED" || s.status === "INVOICED").length}
              icon={CheckCircle}
              colorTheme="emerald"
            />
          </div>

          {/* SPK Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar SPK</CardTitle>
                  <CardDescription>
                    {filteredSPKs.length} SPK ditemukan
                  </CardDescription>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm" onClick={() => router.push('/admin/spk/create')}>
                  <Plus className="mr-2 size-4" />
                  Buat SPK Baru
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. SPK, pelanggan, atau plat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: SPKStatus | "all") => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">Dikerjakan</SelectItem>
                    <SelectItem value="WAITING_PARTS">Tunggu Parts</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={mechanicFilter} onValueChange={setMechanicFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Mekanik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mekanik</SelectItem>
                    <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
                    {mechanics.map((mechanic: any) => (
                      <SelectItem key={mechanic.id} value={mechanic.id}>
                        {mechanic.name || mechanic.mechanicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. SPK</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Mekanik</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Estimasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data SPK...
                      </TableCell>
                    </TableRow>
                  ) : filteredSPKs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada SPK ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSPKs.map((spk: any) => {
                      const customerName = spk.customer?.name || "-"
                      const vehicle = spk.vehicle
                      const mechanicName = spk.assignedMechanic?.name || "-"
                      
                      // Check if any invoice is paid OR if it's invoiced with Rp 0
                      const isPaid = spk.invoices?.some((inv: any) => inv.status === 'PAID') || 
                                     (spk.status === 'INVOICED' && Number(spk.grandTotal || spk.estimatedCost || 0) === 0)
                                     
                      const status = isPaid 
                        ? { label: "Lunas", variant: "default" as any }
                        : statusConfig[spk.status as SPKStatus] || { label: spk.status, variant: "outline" as any }

                      return (
                        <TableRow key={spk.id}>
                          <TableCell>
                            <button
                              onClick={() => viewSPKDetail(spk)}
                              className="font-medium text-primary hover:underline"
                            >
                              {spk.orderNumber || spk.spkNumber}
                            </button>
                          </TableCell>
                          <TableCell>{customerName}</TableCell>
                          <TableCell>
                            {vehicle ? (
                              <div>
                                <p className="font-mono text-sm">{vehicle.licensePlate || vehicle.plateNumber}</p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.brand} {vehicle.model}
                                </p>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {mechanicName !== "-" ? mechanicName : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant as any}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(spk.grandTotal || spk.estimatedCost || 0)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(new Date(spk.createdAt || spk.startDate))}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => viewSPKDetail(spk)}>
                                  <Eye className="mr-2 size-4" />
                                  Lihat Detail
                                </DropdownMenuItem>
                                {spk.status === "PENDING" && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(spk.id, "IN_PROGRESS")}
                                  >
                                    <Play className="mr-2 size-4" />
                                    Mulai Kerjakan
                                  </DropdownMenuItem>
                                )}
                                {(spk.status === "IN_PROGRESS" || spk.status === "QUALITY_CHECK") && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(spk.id, "COMPLETED")}
                                  >
                                    <CheckCircle className="mr-2 size-4" />
                                    Tandai Selesai
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {spk.status !== "CANCELLED" && spk.status !== "COMPLETED" && spk.status !== "INVOICED" && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleUpdateStatus(spk.id, "CANCELLED")}
                                  >
                                    <XCircle className="mr-2 size-4" />
                                    Batalkan
                                  </DropdownMenuItem>
                                )}
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
        </div>
      </div>



      {/* SPK Detail Modal */}
      <SPKDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        spk={selectedSPK}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  )
}
