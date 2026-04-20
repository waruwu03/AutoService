"use client"

import { 
  Package, 
  AlertTriangle, 
  ClipboardCheck, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Boxes,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardStats, inventoryItems, stockMovements, approvalNotes, formatCurrency, formatDate } from '@/lib/gudang-data'
import { DashboardCharts } from '@/components/gudang/dashboard-charts'
import { GudangHeader } from '@/components/gudang/gudang-header'
import { CriticalStockAlert } from '@/components/gudang/critical-stock-alert'

export default function GudangDashboard() {
  const criticalItems = inventoryItems.filter(item => item.status === 'critical')
  const minimumItems = inventoryItems.filter(item => item.status === 'minimum')
  const pendingApprovals = approvalNotes.filter(note => note.status === 'pending')
  const recentMovements = stockMovements.slice(0, 5)

  return (
    <>
      <GudangHeader title="Dashboard" description="Ringkasan status inventori dan aktivitas gudang" />
      <CriticalStockAlert />

      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Parts</CardTitle>
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Package className="size-4 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalParts.toLocaleString()}</div>
                <p className="text-xs text-slate-400 mt-1">Jenis suku cadang dalam stok</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-red-100 bg-red-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-600">Stok Kritis</CardTitle>
                <div className="size-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="size-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardStats.criticalStock}</div>
                <p className="text-xs text-red-500/80 mt-1">Perlu restock segera!</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-amber-100 bg-amber-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-600">Stok Minimum</CardTitle>
                <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingDown className="size-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{dashboardStats.minimumStock}</div>
                <p className="text-xs text-amber-500/80 mt-1">Mendekati batas minimum</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-100 bg-blue-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Pending Approval</CardTitle>
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ClipboardCheck className="size-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.pendingApprovals}</div>
                <p className="text-xs text-blue-500/80 mt-1">Nota menunggu validasi</p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
             <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <ArrowDownRight className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Inbound Hari Ini</p>
                  <h4 className="text-lg font-bold text-slate-900">+{dashboardStats.todayInbound} <span className="text-[10px] font-normal text-slate-400 ml-1">Unit</span></h4>
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                  <ArrowUpRight className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Outbound Hari Ini</p>
                  <h4 className="text-lg font-bold text-slate-900">-{dashboardStats.todayOutbound} <span className="text-[10px] font-normal text-slate-400 ml-1">Unit</span></h4>
                </div>
             </div>

             <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">PO Menunggu</p>
                  <h4 className="text-lg font-bold text-slate-900">{dashboardStats.upcomingPO} <span className="text-[10px] font-normal text-slate-400 ml-1">Pesanan</span></h4>
                </div>
             </div>
          </div>

          {/* Charts Section */}
          <DashboardCharts />

          {/* Lists Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Critical Stock List */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <CardTitle className="text-lg">Stok Perlu Perhatian</CardTitle>
                  <CardDescription className="text-xs">Parts dengan stok kritis dan minimum</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium" asChild>
                  <Link href="/gudang/inventory?status=critical">Lihat Semua <ChevronRight className="ml-1 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                <div className="space-y-2">
                  {[...criticalItems, ...minimumItems].slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-amber-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-2.5 rounded-full ${item.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                        <div>
                          <p className="font-bold text-sm text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.partCode} • {item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${item.status === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                          {item.currentStock} / {item.minStock}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Stok / Min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <CardTitle className="text-lg">Nota Menunggu Validasi</CardTitle>
                  <CardDescription className="text-xs">Permintaan pengeluaran barang pending</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium" asChild>
                  <Link href="/gudang/approvals">Semua Nota <ChevronRight className="ml-1 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                <div className="space-y-2">
                  {pendingApprovals.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-lg ${note.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          <ClipboardCheck className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900">{note.noteNumber}</p>
                            {note.priority === 'urgent' && (
                              <Badge className="bg-red-500 text-white border-none text-[9px] h-4 px-1.5 font-bold uppercase tracking-wider">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {note.requestedBy} • {note.totalItems} item
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="capitalize text-[10px] font-semibold border-slate-200">
                          {note.type}
                        </Badge>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDate(note.requestDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Stock Movements */}
          <Card className="shadow-sm border-slate-200 mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-50">
              <div>
                <CardTitle className="text-lg">Pergerakan Stok Terbaru</CardTitle>
                <CardDescription className="text-xs">Riwayat transaksi masuk dan keluar</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium" asChild>
                <Link href="/gudang/stock-movements">Lihat Riwayat <ChevronRight className="ml-1 size-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 px-3">
              <div className="space-y-2">
                {recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg ${
                        movement.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {movement.type === 'in' ? (
                          <ArrowDownRight className="size-5" />
                        ) : (
                          <ArrowUpRight className="size-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{movement.partName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{movement.reference} • {movement.performedBy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${movement.type === 'in' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatDate(movement.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Footer Card */}
          <Card className="bg-slate-900 text-white overflow-hidden relative shadow-lg">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#FFC107] mb-2">Butuh Kelola Data Cepat?</h3>
                  <p className="text-slate-300 text-sm max-w-md">Akses menu utama untuk pengelolaan stok, supplier, dan laporan gudang secara instan.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold px-6 py-5 rounded-xl transition-all hover:scale-105" asChild>
                    <Link href="/gudang/inventory">
                      <Boxes className="mr-2 size-5" />
                      Data Inventori
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold px-6 py-5 rounded-xl transition-all" asChild>
                    <Link href="/gudang/approvals">
                      Validasi Nota
                      <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}
