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
  Car,
  Fuel,
  Settings2,
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
import type { Vehicle } from '@/types'

interface VehicleTableProps {
  data: Vehicle[]
  isLoading: boolean
  onDelete: (id: number) => void
  isDeleting?: boolean
}

const transmisiLabels = {
  manual: 'Manual',
  automatic: 'Automatic',
}

const bahanBakarLabels = {
  bensin: 'Bensin',
  diesel: 'Diesel',
  listrik: 'Listrik',
  hybrid: 'Hybrid',
}

export function VehicleTable({ data, isLoading, onDelete, isDeleting }: VehicleTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

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
              <TableHead>Nomor Polisi</TableHead>
              <TableHead>Kendaraan</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Transmisi</TableHead>
              <TableHead>Bahan Bakar</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Belum ada data kendaraan
                </TableCell>
              </TableRow>
            ) : (
              data.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-mono font-bold">{vehicle.nomor_polisi}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {vehicle.merk} {vehicle.model}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tahun {vehicle.tahun} - {vehicle.warna}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle.customer ? (
                      <Link 
                        href={`/admin/customers/${vehicle.customer_id}`}
                        className="text-primary hover:underline"
                      >
                        {vehicle.customer.nama}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Settings2 className="mr-1 h-3 w-3" />
                      {transmisiLabels[vehicle.transmisi]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Fuel className="mr-1 h-3 w-3" />
                      {bahanBakarLabels[vehicle.bahan_bakar]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(vehicle.created_at), 'dd MMM yyyy', { locale: id })}
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
                          <Link href={`/admin/vehicles/${vehicle.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(vehicle.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kendaraan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kendaraan ini? Tindakan ini tidak dapat dibatalkan.
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
