'use client'

import { use, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, ShoppingCart, Printer, ArrowLeftRight, MapPin, Truck, Calendar, Package, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight, ChevronRight, Boxes } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { inventoryItems, stockMovements, formatCurrency, formatDate, getStockStatusColor, getStockStatusLabel } from '@/lib/gudang-data'
import { InventoryStockChart } from '@/components/gudang/inventory-stock-chart'
import { GudangHeader } from '@/components/gudang/gudang-header'

interface PageProps {
  params: Promise<{ id: string }>
}

function InventoryDetailContent({ params }: PageProps) {
  const { id } = use(params)
  const item = inventoryItems.find(i => i.id === id)

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center">
            <Boxes className="size-10 text-slate-300" />
        </div>
        <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">Part Tidak Ditemukan</h3>
            <p className="text-sm text-slate-500">ID suku cadang yang Anda cari tidak terdaftar dalam sistem.</p>
        </div>
        <Button className="bg-slate-900 text-white font-bold px-8 mt-2" asChild>
          <Link href="/gudang/inventory">Kembali ke Inventori</Link>
        </Button>
      </div>
    )
  }

  const itemMovements = stockMovements.filter(m => m.partCode === item.partCode)

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 hover:bg-slate-100 rounded-lg group" asChild>
                <Link href="/gudang/inventory">
                    <ArrowLeft className="mr-2 size-3 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">KEMBALI</span>
                </Link>
            </Button>
            <Separator orientation="vertical" className="h-4 bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>INVENTORI</span>
                <ChevronRight className="size-3" />
                <span className="text-slate-900 font-black">{item.partCode}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 bg-white border-slate-200 text-xs font-bold shadow-sm">
                <Printer className="mr-2 size-3.5" />
                LABEL
            </Button>
            <Button className="h-9 bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold px-6 shadow-md shadow-amber-200">
                <Edit className="mr-2 size-3.5" />
                EDIT PART
            </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-inner">
                        <Package className="size-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900">{item.name}</h1>
                            <Badge className={`${getStockStatusColor(item.status)} border-none text-[10px] font-bold px-3 py-1 shadow-sm`}>
                                {getStockStatusLabel(item.status).toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-sm font-mono font-bold text-slate-400 mt-0.5 tracking-wider uppercase">{item.partCode} • {item.category}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                   <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center min-w-[100px]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Beli</p>
                        <p className="text-sm font-bold text-slate-700">{formatCurrency(item.unitPrice)}</p>
                   </div>
                   <div className="bg-slate-900 rounded-xl px-4 py-2 text-center min-w-[100px] border border-slate-800">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Jual</p>
                        <p className="text-sm font-bold text-white">{formatCurrency(item.sellPrice)}</p>
                   </div>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Stats Quick Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stok Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-black ${
              item.status === 'critical' ? 'text-red-600' : 
              item.status === 'minimum' ? 'text-amber-500' : 
              'text-emerald-600'
            }`}>
              {item.currentStock}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Min: {item.minStock} / Max: {item.maxStock}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nilai Inventori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{formatCurrency(item.currentStock * item.unitPrice)}</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total Aktiva</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600">
               +{Math.round(((item.sellPrice - item.unitPrice) / item.unitPrice) * 100)}%
            </div>
            <p className="text-[10px] text-emerald-600/70 font-bold uppercase mt-1">Estimasi Laba</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-blue-600">3.8x</div>
            <p className="text-[10px] text-blue-600/70 font-bold uppercase mt-1">Fast Moving</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">OVERVIEW</TabsTrigger>
          <TabsTrigger value="movements" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">HISTORY LOG</TabsTrigger>
          <TabsTrigger value="supplier" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">SUPPLIER</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Detailed Part Info */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Spesifikasi Unit</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Katalog Produk</p>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serial Code</p>
                    <p className="text-sm font-mono font-bold text-slate-600">{item.partCode}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deskripsi Suku Cadang</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.description}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="size-3 text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titik Koordinat Rak</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 text-white rounded-xl p-3 text-center border-b-2 border-amber-500">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">SECTION</p>
                      <p className="text-xl font-black">{item.location.rack}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ROW</p>
                      <p className="text-xl font-black text-slate-700">{item.location.row}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">COL</p>
                      <p className="text-xl font-black text-slate-700">{item.location.column}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                   <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase">
                            <Calendar className="size-3" />
                            Update Terakhir
                        </div>
                        <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{formatDate(item.lastUpdated)}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <div className="space-y-6">
                <InventoryStockChart />
                <Card className="shadow-sm border-slate-200 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 size-32 bg-amber-500/10 blur-3xl"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <ShoppingCart className="size-6 text-slate-900" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg">Pesan Sekarang?</h4>
                                <p className="text-xs text-slate-400 font-medium">Buat purchase order otomatis ke supplier.</p>
                            </div>
                            <Button className="ml-auto bg-white hover:bg-slate-100 text-slate-900 font-black h-10 px-6 rounded-lg transition-transform active:scale-95 shadow-lg">
                                ORDER
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="mt-0">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Log Transaksi Suku Cadang</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {itemMovements.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {itemMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`flex size-10 items-center justify-center rounded-xl ${
                          movement.type === 'in' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {movement.type === 'in' ? (
                            <ArrowDownRight className="size-5" />
                          ) : (
                            <ArrowUpRight className="size-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <p className="font-bold text-sm text-slate-900">
                                {movement.type === 'in' ? 'BARANG MASUK' : 'BARANG KELUAR'}
                             </p>
                             <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400 px-1.5 py-0">{movement.reference}</Badge>
                          </div>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{movement.notes}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${movement.type === 'in' ? 'text-emerald-600' : 'text-blue-600'}`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <div className="flex items-center gap-2 justify-end text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            <span>{movement.performedBy}</span>
                            <span className="text-slate-200">•</span>
                            <span>{formatDate(movement.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Clock className="size-12 text-slate-200 mb-2" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum Ada Riwayat Pergerakan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier" className="mt-0">
           <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="size-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                <Truck className="size-8 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">{item.supplier.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className="bg-emerald-500 text-white border-none font-bold text-[9px]">PARTNER AKTIF</Badge>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">EST. LEAD TIME: {item.supplier.leadTime} HARI</span>
                                </div>
                            </div>
                        </div>
                        <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold px-8 h-11" asChild>
                            <Link href="/gudang/suppliers">KUNJUNGI PROFIL</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</p>
                                <div className="flex items-center gap-2 mt-4 text-slate-700 font-bold">
                                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <Mail className="size-4 text-slate-400" />
                                    </div>
                                    <span className="text-sm">{item.supplier.email}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-slate-700 font-bold">
                                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                        <Phone className="size-4 text-slate-400" />
                                    </div>
                                    <span className="text-sm">{item.supplier.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">OFFICIAL REPRESENTATIVE</p>
                            <h4 className="text-xl font-black text-slate-900">{item.supplier.contact}</h4>
                            <p className="text-xs text-slate-500 mt-1 font-medium italic">General Manager Accounts</p>
                        </div>
                    </div>
                </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function InventoryDetailPage({ params }: PageProps) {
  return (
    <>
      <GudangHeader title="Detail Suku Cadang" />
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<div>Memuat detail...</div>}>
            <InventoryDetailContent params={params} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
