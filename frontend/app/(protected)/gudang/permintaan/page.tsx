'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  ClipboardList,
  Search,
  Check,
  X,
  Clock,
  Loader2,
  Car,
  Package,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { Pagination } from '@/components/shared/Pagination'
import { fetcher, apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { PaginatedResponse } from '@/types'

interface PartRequest {
  id: number
  spk_number: string
  vehicle_plate: string
  vehicle_info: string
  mekanik_name: string
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  created_at: string
  items: {
    id: number
    sparepart_name: string
    sparepart_code: string
    quantity: number
    available_stock: number
  }[]
}

export default function GudangPermintaanPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, mutate } = useSWR<PaginatedResponse<PartRequest>>(
    `/gudang/part-requests?page=${page}&search=${search}`,
    fetcher
  )

  const pendingCount = data?.data.filter(r => r.status === 'pending').length || 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><Check className="mr-1 h-3 w-3" />Disetujui</Badge>
      case 'rejected':
        return <Badge variant="destructive"><X className="mr-1 h-3 w-3" />Ditolak</Badge>
      case 'fulfilled':
        return <Badge className="bg-blue-100 text-blue-800"><Package className="mr-1 h-3 w-3" />Dikeluarkan</Badge>
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Menunggu</Badge>
    }
  }

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return
    if (actionType === 'view') {
      setActionType(null)
      setSelectedRequest(null)
      return
    }

    setIsSubmitting(true)
    try {
      if (actionType === 'approve') {
        await apiClient.post(`/gudang/part-requests/${selectedRequest.id}/approve`)
        toast.success('Permintaan disetujui')
      } else {
        await apiClient.post(`/gudang/part-requests/${selectedRequest.id}/reject`, {
          reason: rejectReason,
        })
        toast.success('Permintaan ditolak')
      }
      mutate()
      setSelectedRequest(null)
      setActionType(null)
      setRejectReason('')
    } catch (error) {
      toast.error('Gagal memproses permintaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permintaan Sparepart SPK</h1>
        <p className="text-muted-foreground">
          Kelola permintaan sparepart dari mekanik
        </p>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {pendingCount} permintaan menunggu persetujuan
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Daftar Permintaan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <InputGroup className="max-w-md">
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari SPK atau kendaraan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </InputGroup>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !data?.data.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada permintaan sparepart
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. SPK</TableHead>
                      <TableHead>Kendaraan</TableHead>
                      <TableHead>Mekanik</TableHead>
                      <TableHead>Jumlah Item</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono font-medium">
                          {request.spk_number}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-mono">{request.vehicle_plate}</div>
                              <div className="text-xs text-muted-foreground">
                                {request.vehicle_info}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.mekanik_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.items.length} item</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(request.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedRequest(request)
                                setActionType('view')
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setActionType('approve')
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setActionType('reject')
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.meta && (
                <Pagination
                  currentPage={data.meta.current_page}
                  totalPages={data.meta.last_page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail/Action Dialog */}
      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => {
        setSelectedRequest(null)
        setActionType(null)
        setRejectReason('')
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'view' && 'Detail Permintaan'}
              {actionType === 'approve' && 'Setujui Permintaan'}
              {actionType === 'reject' && 'Tolak Permintaan'}
            </DialogTitle>
            <DialogDescription>
              SPK: {selectedRequest?.spk_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Kendaraan:</span>
                <p className="font-medium">{selectedRequest?.vehicle_plate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Mekanik:</span>
                <p className="font-medium">{selectedRequest?.mekanik_name}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-sm font-medium mb-2">Item yang Diminta:</h4>
              <div className="space-y-2">
                {selectedRequest?.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <div className="font-medium">{item.sparepart_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Kode: {item.sparepart_code}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge>x{item.quantity}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Stok: {item.available_stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reject Reason */}
            {actionType === 'reject' && (
              <FieldGroup>
                <Field>
                  <FieldLabel>Alasan Penolakan</FieldLabel>
                  <Textarea
                    placeholder="Masukkan alasan penolakan..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    required
                  />
                </Field>
              </FieldGroup>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null)
                setActionType(null)
                setRejectReason('')
              }}
            >
              {actionType === 'view' ? 'Tutup' : 'Batal'}
            </Button>
            {actionType !== 'view' && (
              <Button
                onClick={handleAction}
                disabled={isSubmitting || (actionType === 'reject' && !rejectReason)}
                variant={actionType === 'reject' ? 'destructive' : 'default'}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {actionType === 'approve' ? 'Setujui' : 'Tolak'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
