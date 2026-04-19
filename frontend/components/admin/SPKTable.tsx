'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Printer,
  FileText,
  Receipt,
} from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import type { SPK, SPKStatus } from '@/types'

interface SPKTableProps {
  data: SPK[]
  isLoading: boolean
  onDelete: (id: number) => void
  isDeleting?: boolean
}

const statusConfig: Record<SPKStatus, { 
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}> = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  dikerjakan: { label: 'Dikerjakan', variant: 'default', className: 'bg-blue-500' },
  selesai: { label: 'Selesai', variant: 'default', className: 'bg-green-500' },
  dibatalkan: { label: 'Dibatalkan', variant: 'destructive' },
  menunggu_part: { label: 'Menunggu Part', variant: 'secondary', className: 'bg-orange-500 text-white' },
}

export function SPKTable({ data, isLoading, onDelete, isDeleting }: SPKTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. SPK</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Kendaraan</TableHead>
              <TableHead>Mekanik</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Belum ada data SPK
                </TableCell>
              </TableRow>
            ) : (
              data.map((spk) => {
                const status = statusConfig[spk.status]
                return (
                  <TableRow key={spk.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-medium">{spk.nomor_spk}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(spk.tanggal), 'dd MMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell>
                      {spk.customer ? (
                        <Link 
                          href={`/admin/customers/${spk.customer_id}`}
                          className="text-primary hover:underline"
                        >
                          {spk.customer.nama}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
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
                      {spk.mekanik?.nama || (
                        <span className="text-muted-foreground">Belum ditugaskan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
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
                          {spk.status === 'draft' && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/spk/${spk.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak SPK
                          </DropdownMenuItem>
                          {spk.status === 'selesai' && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/invoices/create?spk_id=${spk.id}`}>
                                <Receipt className="mr-2 h-4 w-4" />
                                Buat Invoice
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {spk.status === 'draft' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteId(spk.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </>
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus SPK</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus SPK ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
