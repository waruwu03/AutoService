'use client'

import { Download, FileText, TrendingUp, TrendingDown, Package, Truck, Calendar, BarChart3, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inventoryItems, stockMovements, formatCurrency } from '@/lib/gudang-data'
import { ReportCharts } from '@/components/gudang/report-charts'
import { GudangHeader } from '@/components/gudang/gudang-header'

export default function ReportsPage() {
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0)
  const criticalItemsCount = inventoryItems.filter(i => i.status === 'critical').length

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Laporan Inventori',
      description: 'Daftar lengkap stok dan nilai inventori',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'movement',
      title: 'Laporan Pergerakan',
      description: 'Riwayat transaksi masuk dan keluar',
      icon: TrendingUp,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'supplier',
      title: 'Laporan Supplier',
      description: 'Performa dan data supplier',
      icon: Truck,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'critical',
      title: 'Laporan Stok Kritis',
      description: 'Parts dengan stok di bawah minimum',
      icon: TrendingDown,
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <>
      <GudangHeader title="Laporan Gudang" description="Analisis dan laporan operasional gudang" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Action */}
          <div className="flex justify-end">
            <Select defaultValue="month">
              <SelectTrigger className="w-[200px] h-10 bg-white border-slate-200 font-bold text-xs shadow-sm">
                <Calendar className="mr-2 size-3 text-slate-400" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
                <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
                <SelectItem value="year">1 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nilai Inventori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-slate-900">{formatCurrency(totalInventoryValue)}</div>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600">
                  <TrendingUp className="size-3" />
                  +5.2% VS BULAN LALU
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-slate-900">{stockMovements.length}</div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Bulan April</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turnover Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-slate-900">4.2x</div>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-600 uppercase">
                  <TrendingUp className="size-3" />
                  Status Baik
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-red-100 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Stok Kritis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-red-600">{criticalItemsCount}</div>
                <p className="text-[10px] text-red-500/80 font-bold uppercase mt-1">Perlu restock</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <ReportCharts />

          {/* Quick Download Reports */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="shadow-sm border-slate-200 hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-2.5 rounded-xl ${report.color}`}>
                      <report.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{report.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9 bg-white border-slate-200 text-[10px] font-black group-hover:border-slate-300">
                      <FileText className="mr-1.5 size-3 text-slate-400" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-9 bg-white border-slate-200 text-[10px] font-black group-hover:border-slate-300">
                      <Download className="mr-1.5 size-3 text-slate-400" />
                      EXCEL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Data for Reporting */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Moving Items */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Parts Paling Aktif</CardTitle>
                <CardDescription className="text-xs">Berdasarkan volume transaksi bulan ini</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {[
                    { name: 'Engine Oil 5W-30', code: 'OIL-002', transactions: 45, trend: 'up' },
                    { name: 'Brake Pad Set - Front', code: 'BRK-001', transactions: 38, trend: 'up' },
                    { name: 'Air Filter Universal', code: 'FLT-003', transactions: 32, trend: 'down' },
                    { name: 'Spark Plug NGK Iridium', code: 'SPK-004', transactions: 28, trend: 'up' },
                    { name: 'Radiator Coolant 5L', code: 'RAD-008', transactions: 24, trend: 'same' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{item.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">{item.transactions}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Transaksi</p>
                        </div>
                        {item.trend === 'up' && <TrendingUp className="size-4 text-emerald-500" />}
                        {item.trend === 'down' && <TrendingDown className="size-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supplier Scores */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Performa Supplier</CardTitle>
                <CardDescription className="text-xs">Ketepatan waktu pengiriman barang (On-Time)</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                {[
                  { name: 'Shell Indonesia', onTime: 98, orders: 24 },
                  { name: 'PT Auto Parts Indonesia', onTime: 95, orders: 45 },
                  { name: 'Denso Indonesia', onTime: 92, orders: 18 },
                  { name: 'NGK Indonesia', onTime: 88, orders: 12 },
                  { name: 'Bosch Indonesia', onTime: 85, orders: 8 },
                ].map((supplier, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">{supplier.name}</span>
                      <span className="text-slate-400 uppercase tracking-tighter">{supplier.orders} ORDERS</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            supplier.onTime >= 95 ? 'bg-emerald-500' : 
                            supplier.onTime >= 85 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${supplier.onTime}%` }}
                        />
                      </div>
                      <span className={`text-xs font-black min-w-[32px] text-right ${
                        supplier.onTime >= 95 ? 'text-emerald-500' : 
                        supplier.onTime >= 85 ? 'text-amber-500' : 
                        'text-red-500'
                      }`}>
                        {supplier.onTime}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  )
}
