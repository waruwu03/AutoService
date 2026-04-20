'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { inventoryItems, categories, formatCurrency, getStockStatusColor, getStockStatusLabel } from '@/lib/gudang-data'
import { GudangHeader } from '@/components/gudang/gudang-header'

const ITEMS_PER_PAGE = 10

function InventoryContent() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get('status') || 'all'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const uniqueSuppliers = useMemo(() => {
    const supplierNames = [...new Set(inventoryItems.map(item => item.supplier.name))]
    return supplierNames
  }, [])

  const filteredItems = useMemo(() => {
    let items = [...inventoryItems]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.partCode.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter)
    }

    // Supplier filter
    if (supplierFilter !== 'all') {
      items = items.filter(item => item.supplier.name === supplierFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      items = items.filter(item => item.status === statusFilter)
    }

    // Sorting
    items.sort((a, b) => {
      let compareA: string | number
      let compareB: string | number

      switch (sortBy) {
        case 'name':
          compareA = a.name
          compareB = b.name
          break
        case 'stock':
          compareA = a.currentStock
          compareB = b.currentStock
          break
        case 'price':
          compareA = a.sellPrice
          compareB = b.sellPrice
          break
        default:
          compareA = a.name
          compareB = b.name
      }

      if (sortOrder === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0
      }
    })

    return items
  }, [searchQuery, categoryFilter, supplierFilter, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (column: 'name' | 'stock' | 'price') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setSupplierFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Page Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Inventori</h2>
          <p className="text-sm text-slate-500">Total {inventoryItems.length} jenis suku cadang tersedia</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold">
            <Plus className="mr-2 size-4" />
            Tambah Part
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Cari nama part, kode part..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Supplier</SelectItem>
                {uniqueSuppliers.map((sup) => (
                  <SelectItem key={sup} value={sup}>{sup}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status Stok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ok">Stok OK</SelectItem>
                <SelectItem value="minimum">Stok Minimum</SelectItem>
                <SelectItem value="critical">Stok Kritis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || categoryFilter !== 'all' || supplierFilter !== 'all' || statusFilter !== 'all') && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Menampilkan <span className="text-slate-900">{filteredItems.length}</span> dari {inventoryItems.length} item
              </span>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
                Reset Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] font-bold text-slate-700">Kode Part</TableHead>
                  <TableHead className="font-bold text-slate-700">
                    <button
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      Nama Part
                      <ArrowUpDown className="size-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">Kategori</TableHead>
                  <TableHead className="font-bold text-slate-700">
                    <button
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                      onClick={() => handleSort('stock')}
                    >
                      Stok
                      <ArrowUpDown className="size-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    <button
                      className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      Harga Jual
                      <ArrowUpDown className="size-3" />
                    </button>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">Supplier</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs font-semibold text-slate-600">{item.partCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tight">Lokasi: {item.location.rack}-{item.location.row}-{item.location.column}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px]">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          item.status === 'critical' ? 'text-red-500' : 
                          item.status === 'minimum' ? 'text-amber-500' : 
                          'text-emerald-600'
                        }`}>
                          {item.currentStock}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">/ {item.maxStock}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-700">
                      {formatCurrency(item.sellPrice)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{item.supplier.name}</TableCell>
                    <TableCell>
                      <Badge className={`${getStockStatusColor(item.status)} border-none text-[10px] font-bold px-2 py-0.5`}>
                        {getStockStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                            <span className="sr-only">Buka Menu</span>
                            <Filter className="size-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link href={`/gudang/inventory/${item.id}/detail`} className="cursor-pointer">
                              <Eye className="mr-2 size-4 text-slate-500" />
                              Lihat Detail
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 size-4 text-slate-500" />
                            Edit Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
                            <Trash2 className="mr-2 size-4" />
                            Hapus Part
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/30">
            <p className="text-xs font-medium text-slate-500">
              Halaman <span className="text-slate-900">{currentPage}</span> dari <span className="text-slate-900">{totalPages}</span> ({filteredItems.length} item)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-white border-slate-200"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-1 size-3" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs bg-white border-slate-200"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="ml-1 size-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <>
      <GudangHeader title="Inventori" description="Manajemen stok dan data suku cadang" />
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<div>Memuat data...</div>}>
            <InventoryContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
