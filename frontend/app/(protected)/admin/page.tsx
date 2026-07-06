"use client"

import {
  ClipboardList,
  Wrench,
  CheckCircle,
  Pencil,
  ChevronRight,
  AlertTriangle,
  CalendarClock,
  Receipt,
  Calendar,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react"
import { PromoCarousel } from "@/components/admin/PromoCarousel"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatsCard } from "@/components/admin/stats-card"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import useSWR from 'swr'
import { fetcher, formatCurrency } from '@/lib/api-client'
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

export default function AdminDashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useSWR('/reports/dashboard', fetcher)
  const { data: recentOrdersData, isLoading: isOrdersLoading } = useSWR('/work-orders?limit=5&sortBy=createdAt&sortOrder=desc', fetcher)
  const { data: lowStockData, isLoading: isLowStockLoading } = useSWR('/inventory/spareparts/low-stock', fetcher)
  const { data: mechanicsData, isLoading: isMechanicsLoading } = useSWR('/reports/mechanics?startDate=2024-01-01&endDate=2025-12-31', fetcher)
  const { data: revenueTimeSeries, isLoading: isRevenueLoading } = useSWR('/reports/revenue-timeseries', fetcher)

  const chartData = revenueTimeSeries || []

  const stats = dashboardData ? {
    todayWorkOrders: dashboardData.completedOrders || 0,
    activeWorkOrders: dashboardData.activeWorkOrders || 0,
    monthlyRevenue: dashboardData.totalRevenue || 0,
    totalCustomers: dashboardData.totalCustomers || 0,
    lowStockCount: dashboardData.lowStockCount || 0,
    pendingInvoices: dashboardData.pendingInvoices || 0
  } : {
    todayWorkOrders: 0,
    activeWorkOrders: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    pendingInvoices: 0
  }

  const recentOrders = recentOrdersData?.data || []
  const topMechanics = mechanicsData ? mechanicsData.slice(0, 3) : []
  const lowStockItems = Array.isArray(lowStockData) ? lowStockData.slice(0, 5) : []

  return (
    <>
      <AdminHeader title="Admin Dashboard" description="Selamat datang kembali di sistem manajemen AutoServis." />

      <div className="flex-1 overflow-auto p-6 bg-slate-50/40 dark:bg-slate-950/40">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Stats Grid - Premium Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total Order"
              value={isDashboardLoading ? "..." : stats.todayWorkOrders}
              trend={
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 mt-1">
                  <TrendingUp className="size-3.5" />
                  <span>+4% dari kemarin</span>
                </div>
              }
              icon={ClipboardList}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Pendapatan"
              value={isDashboardLoading ? "..." : formatCurrency(stats.monthlyRevenue)}
              trend={
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 mt-1">
                  <TrendingUp className="size-3.5" />
                  <span>+12% bulan ini</span>
                </div>
              }
              icon={Receipt}
              colorTheme="emerald"
            />
            <PremiumStatCard
              title="Dalam Proses"
              value={isDashboardLoading ? "..." : stats.activeWorkOrders}
              description="Antrian mekanik"
              icon={Wrench}
              colorTheme="orange"
            />
            <PremiumStatCard
              title="Pelanggan"
              value={isDashboardLoading ? "..." : stats.totalCustomers}
              description="Database aktif"
              icon={Users}
              colorTheme="purple"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Area: Recent Orders and Revenue Chart */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Revenue Chart Section */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg">Analisis Pendapatan</CardTitle>
                    <CardDescription>Tren pendapatan 7 hari terakhir</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">7 Hari</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">30 Hari</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full relative">
                    {isRevenueLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 z-10">
                        <Loader2 className="size-8 animate-spin text-primary" />
                      </div>
                    ) : chartData.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm italic">
                        Belum ada data transaksi untuk periode ini
                      </div>
                    ) : null}
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: "#94a3b8" }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: "#94a3b8" }} 
                          tickFormatter={(val) => `Rp${val / 1000000}jt`} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#0f172a',
                            color: '#fff'
                          }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#F97316" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders Table */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Order Servis Terbaru</CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                    <Link href="/admin/spk" className="flex items-center gap-1">
                      Lihat Semua <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-transparent">
                        <TableHead className="font-semibold text-xs">NO. ORDER</TableHead>
                        <TableHead className="font-semibold text-xs">PELANGGAN</TableHead>
                        <TableHead className="font-semibold text-xs">KENDARAAN</TableHead>
                        <TableHead className="font-semibold text-xs">MEKANIK</TableHead>
                        <TableHead className="font-semibold text-xs text-right">TOTAL</TableHead>
                        <TableHead className="font-semibold text-xs text-center">STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isOrdersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <Loader2 className="h-6 w-6 animate-spin inline mr-2 text-slate-300" />
                          </TableCell>
                        </TableRow>
                      ) : recentOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center text-slate-400">Belum ada order hari ini</TableCell>
                        </TableRow>
                      ) : (
                        recentOrders.map((order: any) => (
                          <TableRow key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{order.orderNumber}</TableCell>
                            <TableCell className="text-sm font-medium">{order.customer?.name || '-'}</TableCell>
                            <TableCell className="text-xs text-slate-500">
                              {order.vehicle?.brand} {order.vehicle?.model}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-6 border border-slate-200">
                                  <AvatarFallback className="text-[10px]">{order.assignedMechanic?.name?.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{order.assignedMechanic?.name || '-'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-sm">
                              {formatCurrency(Number(order.grandTotal))}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn(
                                "border-none shadow-none text-[10px] font-bold px-2 py-0.5",
                                order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                order.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                              )}>
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Side Column: Sidebar Tools, Mechanics, Low Stock */}
            <div className="space-y-8">
              
              {/* Promo Menarik */}
              <PromoCarousel />

              {/* Low Stock Alerts */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Stok Kritis</CardTitle>
                    <CardDescription>Barang perlu segera diorder</CardDescription>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">
                    {stats.lowStockCount} Item
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {isLowStockLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="size-5 animate-spin" /></div>
                  ) : lowStockItems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Semua stok aman</p>
                  ) : (
                    lowStockItems.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex gap-3 items-center">
                          <div className="size-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <Package className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[120px]">{item.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-red-600">{item.stockQuantity ?? item.stock_quantity}</p>
                          <p className="text-[10px] text-slate-400">{item.unit}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="outline" className="w-full mt-2 text-xs border-dashed" asChild>
                    <Link href="/admin/inventory">Lihat Semua Inventori</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Mechanics */}
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Kinerja Mekanik</CardTitle>
                  <CardDescription>3 Mekanik terbaik bulan ini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  {isMechanicsLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="size-5 animate-spin" /></div>
                  ) : topMechanics.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Data tidak tersedia</p>
                  ) : (
                    topMechanics.map((mechanic: any, index: number) => (
                      <div key={mechanic.id} className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="size-12 border-2 border-white shadow-sm bg-slate-100">
                            <AvatarImage src={resolvePhotoUrl(mechanic.photoUrl)} />
                            <AvatarFallback className="font-bold text-slate-600">
                              {mechanic.name?.substring(0, 2).toUpperCase() || 'MK'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 size-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{mechanic.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] py-0 px-1 border-emerald-200 text-emerald-600">
                              {mechanic.completed} Selesai
                            </Badge>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {mechanic.inProgress} Aktif
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">{formatCurrency(mechanic.totalRevenue)}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="ghost" className="w-full mt-2 text-xs text-slate-500 hover:text-primary" asChild>
                    <Link href="/admin/mechanics">Analisis Performa Mekanik</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Reminders */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-none shadow-sm bg-blue-600 text-white p-4">
                  <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                    <Clock className="size-4" />
                  </div>
                  <h4 className="text-xl font-black">{stats.activeWorkOrders}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Sedang Antre</p>
                </Card>
                <Card className="border-none shadow-sm bg-amber-500 text-white p-4">
                  <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                    <AlertTriangle className="size-4" />
                  </div>
                  <h4 className="text-xl font-black">{stats.pendingInvoices}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-100">Belum Lunas</p>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
