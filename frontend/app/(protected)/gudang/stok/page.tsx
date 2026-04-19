'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Package,
  Search,
  Plus,
  Edit,
  AlertTriangle,
  Loader2,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Pagination } from '@/components/shared/Pagination'
import { fetcher, formatCurrency, apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Sparepart, PaginatedResponse } from '@/types'

export default function GudangStokPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [editItem, setEditItem] = useState<Sparepart | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, mutate } = useSWR<PaginatedResponse<Sparepart>>(
    `/spareparts?page=${page}&search=${search}&category=${category !== 'all' ? category : ''}&stock_filter=${stockFilter !== 'all' ? stockFilter : ''}`,
    fetcher
  )

  const { data: categories } = useSWR<string[]>('/spareparts/categories', fetcher)

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Habis</Badge>
    }
    if (stock <= minStock) {
      return <Badge className="bg-yellow-100 text-yellow-800">Stok Rendah</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Tersedia</Badge>
  }

  const handleUpdateStock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editItem) return

    const formData = new FormData(e.currentTarget)
    setIsSubmitting(true)

    try {
      await apiClient.put(`/spareparts/${editItem.id}`, {
        stock: Number(formData.get('stock')),
        min_stock: Number(formData.get('min_stock')),
        buy_price: Number(formData.get('buy_price')),
        sell_price: Number(formData.get('sell_price')),
      })
      toast.success('Stok berhasil diperbarui')
      mutate()
      setEditItem(null)
    } catch (error) {
      toast.error('Gagal memperbarui stok')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stok Barang</h1>
          <p className="text-muted-foreground">Kelola inventori sparepart</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Daftar Sparepart
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <InputGroup className="flex-1">
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari kode atau nama sparepart..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </InputGroup>
            <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(val) => { setStockFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Stok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="low">Stok Rendah</SelectItem>
                <SelectItem value="empty">Habis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !data?.data.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada sparepart ditemukan
            </div>
          ) : (
            <>
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
                    {data.data.map((item) => (
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
                              onClick={() => setEditItem(item)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stok - {editItem?.nama}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStock}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Stok Saat Ini</FieldLabel>
                  <Input
                    name="stock"
                    type="number"
                    defaultValue={editItem?.stok}
                    min={0}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Stok Minimum</FieldLabel>
                  <Input
                    name="min_stock"
                    type="number"
                    defaultValue={editItem?.stok_minimum}
                    min={0}
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Harga Beli</FieldLabel>
                  <Input
                    name="buy_price"
                    type="number"
                    defaultValue={editItem?.harga_beli}
                    min={0}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Harga Jual</FieldLabel>
                  <Input
                    name="sell_price"
                    type="number"
                    defaultValue={editItem?.harga_jual}
                    min={0}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
