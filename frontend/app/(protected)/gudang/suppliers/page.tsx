'use client'

import { useState } from 'react'
import { Search, Plus, Truck, Mail, Phone, MapPin, Clock, Package, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { suppliers, type Supplier } from '@/lib/gudang-data'
import { GudangHeader } from '@/components/gudang/gudang-header'

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSuppliersCount = suppliers.filter(s => s.status === 'active').length
  const totalProducts = suppliers.reduce((sum, s) => sum + s.totalProducts, 0)

  return (
    <>
      <GudangHeader title="Kelola Supplier" description="Daftar pemasok suku cadang dan informasi kontak" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{suppliers.length}</div>
                <p className="text-[10px] text-slate-400 font-medium">Mitra terdaftar</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Supplier Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{activeSuppliersCount}</div>
                <p className="text-[10px] text-emerald-600/80 font-bold uppercase">Masih beroperasi</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{totalProducts}</div>
                <p className="text-[10px] text-slate-400 font-medium">SKU Terintegrasi</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Lead Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {Math.round(suppliers.reduce((sum, s) => sum + s.leadTime, 0) / suppliers.length)} <span className="text-sm font-normal text-slate-400">Hari</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Waktu rata-rata</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Cari nama supplier atau kontak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-white border-slate-200 shadow-sm focus:ring-amber-400 rounded-xl"
              />
            </div>
            <Button className="w-full sm:w-auto h-11 px-6 bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-black rounded-xl shadow-lg shadow-amber-200/50 transition-all active:scale-95">
              <Plus className="mr-2 size-5" />
              TAMBAH SUPPLIER
            </Button>
          </div>

          {/* Table */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-slate-700">Nama Supplier</TableHead>
                    <TableHead className="font-bold text-slate-700">Contact Person</TableHead>
                    <TableHead className="font-bold text-slate-700">Kontak</TableHead>
                    <TableHead className="font-bold text-slate-700">Lead Time</TableHead>
                    <TableHead className="font-bold text-slate-700">Produk</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                            <Truck className="size-5 text-slate-500" />
                          </div>
                          <div className="max-w-[200px]">
                            <p className="font-bold text-slate-900 text-sm leading-tight mb-1">{supplier.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <MapPin className="size-2.5" />
                              <span className="truncate">{supplier.address}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-700">{supplier.contact}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <Mail className="size-3" />
                            <span>{supplier.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                            <Phone className="size-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-200">
                          {supplier.leadTime} HARI
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="size-3.5 text-slate-400" />
                          <span className="text-xs font-black text-slate-700">{supplier.totalProducts}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${supplier.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'} border-none text-[10px] font-bold px-2 py-0.5`}>
                          {supplier.status === 'active' ? 'AKTIF' : 'NONAKTIF'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                              <MoreHorizontal className="size-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                              <Eye className="mr-2 size-4 text-slate-500" />
                              Detail Data
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 size-4 text-slate-500" />
                              Edit Supplier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
                              <Trash2 className="mr-2 size-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          {selectedSupplier && (
            <>
              <div className="bg-slate-900 p-8 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Truck className="size-24" />
                </div>
                <Badge className="bg-emerald-500 text-white border-none mb-4 font-bold text-[10px]">AKTIF</Badge>
                <h2 className="text-2xl font-black mb-1">{selectedSupplier.name}</h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                  <MapPin className="size-4" />
                  <span>{selectedSupplier.address}</span>
                </div>
              </div>
              <div className="p-8 bg-white space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Person</p>
                    <p className="font-bold text-slate-900">{selectedSupplier.contact}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Lead Time</p>
                    <p className="font-bold text-slate-900">{selectedSupplier.leadTime} Hari Kerja</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                      <Mail className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                        <p className="font-bold text-slate-900 text-sm">{selectedSupplier.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                      <Phone className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone Number</p>
                        <p className="font-bold text-slate-900 text-sm">{selectedSupplier.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3">
                            <Package className="size-5 text-amber-600" />
                            <span className="font-bold text-amber-900">Total Supply Products</span>
                        </div>
                        <span className="text-xl font-black text-amber-600">{selectedSupplier.totalProducts} Items</span>
                    </div>
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-50 gap-2 border-t border-slate-100">
                <Button variant="ghost" className="font-bold text-slate-500" onClick={() => setSelectedSupplier(null)}>Tutup</Button>
                <Button className="font-bold bg-slate-900 hover:bg-slate-800 text-white px-8">Edit Profil</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
