"use client"

import { useState } from "react"
import { Plus, Search, Eye, Calendar, MoreHorizontal, Play, CheckCircle, XCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { SPKForm } from "@/components/admin/spk-form"
import { SPKDetailModal } from "@/components/admin/spk-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  mockSPKs,
  mockMechanics,
  getCustomerById,
  getVehicleById,
  getMechanicById,
  formatCurrency,
  formatDate,
  generateSPKNumber,
} from "@/lib/mock-data"
import type { SPK, SPKStatus, SPKFormData } from "@/lib/types"

const statusConfig: Record<SPKStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_progress: { label: "Dikerjakan", variant: "default" },
  completed: { label: "Selesai", variant: "outline" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
}

export default function SPKPage() {
  const [spkList, setSPKList] = useState<SPK[]>(mockSPKs)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<SPKStatus | "all">("all")
  const [mechanicFilter, setMechanicFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSPK, setSelectedSPK] = useState<SPK | null>(null)

  const filteredSPKs = spkList.filter((spk) => {
    const customer = getCustomerById(spk.customerId)
    const vehicle = getVehicleById(spk.vehicleId)
    const matchesSearch =
      spk.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle?.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || spk.status === statusFilter
    const matchesMechanic =
      mechanicFilter === "all" ||
      (mechanicFilter === "unassigned" && !spk.mechanicId) ||
      spk.mechanicId === mechanicFilter
    return matchesSearch && matchesStatus && matchesMechanic
  })

  const handleCreateSPK = async (data: SPKFormData) => {
    const servicesTotal = data.services.reduce((sum, s) => sum + s.price * s.quantity, 0)
    const partsTotal = data.parts.reduce((sum, p) => sum + p.price * p.quantity, 0)

    const newSPK: SPK = {
      id: `spk-${Date.now()}`,
      spkNumber: generateSPKNumber(),
      customerId: data.customerId,
      vehicleId: data.vehicleId,
      mechanicId: data.mechanicId || undefined,
      status: "draft",
      services: data.services,
      parts: data.parts,
      notes: data.notes,
      estimatedCost: servicesTotal + partsTotal,
      startDate: new Date(),
      estimatedEndDate: data.estimatedEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSPKList([newSPK, ...spkList])
  }

  const handleUpdateStatus = (spkId: string, newStatus: SPKStatus) => {
    setSPKList(
      spkList.map((spk) => {
        if (spk.id === spkId) {
          return {
            ...spk,
            status: newStatus,
            completedDate: newStatus === "completed" ? new Date() : spk.completedDate,
            actualCost: newStatus === "completed" ? spk.estimatedCost : spk.actualCost,
            updatedAt: new Date(),
          }
        }
        return spk
      })
    )
    setDetailModalOpen(false)
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
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total SPK</p>
                <p className="text-2xl font-bold">{spkList.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {spkList.filter((s) => s.status === "draft").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Dikerjakan</p>
                <p className="text-2xl font-bold">
                  {spkList.filter((s) => s.status === "in_progress").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="text-2xl font-bold">
                  {spkList.filter((s) => s.status === "completed").length}
                </p>
              </CardContent>
            </Card>
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
                <Button onClick={() => setFormOpen(true)}>
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">Dikerjakan</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={mechanicFilter} onValueChange={setMechanicFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Mekanik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mekanik</SelectItem>
                    <SelectItem value="unassigned">Belum Ditugaskan</SelectItem>
                    {mockMechanics.map((mechanic) => (
                      <SelectItem key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
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
                  {filteredSPKs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada SPK ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSPKs.map((spk) => {
                      const customer = getCustomerById(spk.customerId)
                      const vehicle = getVehicleById(spk.vehicleId)
                      const mechanic = spk.mechanicId ? getMechanicById(spk.mechanicId) : null
                      const status = statusConfig[spk.status]

                      return (
                        <TableRow key={spk.id}>
                          <TableCell>
                            <button
                              onClick={() => viewSPKDetail(spk)}
                              className="font-medium text-primary hover:underline"
                            >
                              {spk.spkNumber}
                            </button>
                          </TableCell>
                          <TableCell>{customer?.name || "-"}</TableCell>
                          <TableCell>
                            {vehicle ? (
                              <div>
                                <p className="font-mono text-sm">{vehicle.plateNumber}</p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.brand} {vehicle.model}
                                </p>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {mechanic ? mechanic.name : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(spk.estimatedCost)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(spk.startDate)}
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
                                {spk.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(spk.id, "in_progress")}
                                  >
                                    <Play className="mr-2 size-4" />
                                    Mulai Kerjakan
                                  </DropdownMenuItem>
                                )}
                                {spk.status === "in_progress" && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(spk.id, "completed")}
                                  >
                                    <CheckCircle className="mr-2 size-4" />
                                    Tandai Selesai
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {spk.status !== "cancelled" && spk.status !== "completed" && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleUpdateStatus(spk.id, "cancelled")}
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

      {/* SPK Form Dialog */}
      <SPKForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreateSPK} />

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
