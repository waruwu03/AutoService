'use client'

import { Edit, AlertTriangle } from 'lucide-react'
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
import { formatCurrency } from '@/lib/api-client'
import type { Sparepart } from '@/types'

interface StokTableProps {
  data: Sparepart[]
  onEdit: (item: Sparepart) => void
}

export function getStockBadge(stock: number, minStock: number) {
  if (stock === 0) {
    return <Badge variant="destructive">Habis</Badge>
  }
  if (stock <= minStock) {
    return <Badge className="bg-yellow-100 text-yellow-800">Stok Rendah</Badge>
  }
  return <Badge className="bg-green-100 text-green-800">Tersedia</Badge>
}

export function StokTable({ data, onEdit }: StokTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Stok</TableHead>
            <TableHead className="text-right">Min. Stok</TableHead>
            <TableHead className="text-right">Harga Beli</TableHead>
            <TableHead className="text-right">Harga Jual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className={item.stok <= item.stok_minimum ? 'bg-yellow-50' : ''}>
              <TableCell className="font-mono font-medium">
                {item.kode}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.stok <= item.stok_minimum && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  {item.nama}
                </div>
              </TableCell>
              <TableCell>{item.category?.nama}</TableCell>
              <TableCell className="text-right font-medium">
                {item.stok} {item.satuan}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {item.stok_minimum} {item.satuan}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.harga_beli)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.harga_jual)}
              </TableCell>
              <TableCell>{getStockBadge(item.stok, item.stok_minimum)}</TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
