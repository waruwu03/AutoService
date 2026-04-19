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

const statusConfig: Record<SPKStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  dikerjakan: { label: 'Dikerjakan', variant: 'default' },
  selesai: { label: 'Selesai', variant: 'default' },
  dibatalkan: { label: 'Dibatalkan', variant: 'destructive' },
  menunggu_part: { label: 'Menunggu Part', variant: 'secondary' },
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
              data.map((spk) => {
                const status = statusConfig[spk.status]
                return (
                  <TableRow key={spk.id}>
                    <TableCell className="font-medium">{spk.nomor_spk}</TableCell>
                    <TableCell>
                      {format(new Date(spk.tanggal), 'dd MMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell>{spk.customer?.nama || '-'}</TableCell>
                    <TableCell>
                      {spk.vehicle ? (
                        <div>
                          <div className="font-medium">{spk.vehicle.nomor_polisi}</div>
                          <div className="text-xs text-muted-foreground">
                            {spk.vehicle.merk} {spk.vehicle.model}
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
                      {formatCurrency(spk.grand_total)}
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
