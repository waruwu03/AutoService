'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Eye, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import type { SPK, SPKStatus } from '@/types'

interface RecentSPKTableProps {
  data: SPK[]
  isLoading: boolean
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Draft', variant: 'outline' },
  PENDING: { label: 'Pending', variant: 'secondary' },
  IN_PROGRESS: { label: 'Dikerjakan', variant: 'default' },
  WAITING_PARTS: { label: 'Tunggu Parts', variant: 'secondary' },
  QUALITY_CHECK: { label: 'Cek Kualitas', variant: 'secondary' },
  COMPLETED: { label: 'Selesai', variant: 'default' },
  INVOICED: { label: 'Ditagihkan', variant: 'outline' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
}

export function RecentSPKTable({ data, isLoading }: RecentSPKTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SPK Terbaru</CardTitle>
          <CardDescription>Daftar Surat Perintah Kerja terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>SPK Terbaru</CardTitle>
          <CardDescription>Daftar Surat Perintah Kerja terbaru</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/spk">Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. SPK</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Kendaraan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Belum ada data SPK
                </TableCell>
              </TableRow>
            ) : (
              data.map((rawSpk) => {
                const spk = rawSpk as any
                const isPaid = spk.invoices?.some((inv: any) => inv.status === 'PAID') || 
                               (spk.status === 'INVOICED' && Number(spk.grandTotal || spk.estimatedCost || 0) === 0)
                const status = isPaid 
                  ? { label: 'Lunas', variant: 'default' as any }
                  : statusConfig[spk.status] || { label: spk.status, variant: 'outline' as any }
                return (
                  <TableRow key={spk.id}>
                    <TableCell className="font-medium">{spk.nomor_spk ?? spk.orderNumber ?? '-'}</TableCell>
                    <TableCell>
                      {format(new Date(spk.tanggal ?? spk.receivedAt ?? new Date()), 'dd MMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell>{spk.customer?.nama ?? spk.customer?.name ?? '-'}</TableCell>
                    <TableCell>
                      {spk.vehicle ? (
                        <div>
                          <div className="font-medium">{spk.vehicle.nomor_polisi ?? spk.vehicle.licensePlate}</div>
                          <div className="text-xs text-muted-foreground">
                            {spk.vehicle.merk ?? spk.vehicle.brand} {spk.vehicle.model}
                          </div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(spk.grand_total ?? spk.grandTotal ?? 0))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/spk/${spk.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </Link>
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
  )
}
