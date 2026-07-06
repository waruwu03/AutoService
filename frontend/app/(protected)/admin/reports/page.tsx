"use client"

import { useState } from "react"
import { Download, TrendingUp, DollarSign, ClipboardList, Users, Car, Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

export default function ReportsPage() {
  const [period, setPeriod] = useState("6months")

  // Date range helpers
  const now = new Date()
  const periodMap: Record<string, { startDate: string; endDate: string }> = {
    "7days":   (() => { const d = new Date(now); d.setDate(d.getDate() - 7);  return { startDate: d.toISOString().slice(0,10), endDate: now.toISOString().slice(0,10) }})(),
    "30days":  (() => { const d = new Date(now); d.setDate(d.getDate() - 30); return { startDate: d.toISOString().slice(0,10), endDate: now.toISOString().slice(0,10) }})(),
    "3months": (() => { const d = new Date(now); d.setMonth(d.getMonth() - 3); return { startDate: d.toISOString().slice(0,10), endDate: now.toISOString().slice(0,10) }})(),
    "6months": (() => { const d = new Date(now); d.setMonth(d.getMonth() - 6); return { startDate: d.toISOString().slice(0,10), endDate: now.toISOString().slice(0,10) }})(),
    "1year":   (() => { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return { startDate: d.toISOString().slice(0,10), endDate: now.toISOString().slice(0,10) }})(),
  }
  const { startDate, endDate } = periodMap[period] || periodMap["6months"]

  // API calls
  const { data: dashRaw, isLoading } = useSWR(`/reports/dashboard?startDate=${startDate}&endDate=${endDate}`, fetcher)
  const { data: mechanicsRaw }       = useSWR(`/reports/mechanics?startDate=${startDate}&endDate=${endDate}`, fetcher)
  const { data: customersRaw }       = useSWR("/customers?limit=200", fetcher)
  const { data: vehiclesRaw }        = useSWR("/vehicles?limit=1", fetcher)

  const dash      = dashRaw?.data || dashRaw || {}
  const mechanics: any[] = Array.isArray(mechanicsRaw) ? mechanicsRaw : []
  const customers: any[] = Array.isArray(customersRaw?.data) ? customersRaw.data : []
  const totalVehicles = vehiclesRaw?.meta?.total || vehiclesRaw?.total || 0

  const totalRevenue    = Number(dash.totalRevenue    || 0)
  const totalSPK        = Number(dash.totalOrders     || dash.totalSPK     || 0)
  const completedSPK    = Number(dash.completedOrders || dash.totalCompleted || 0)
  const avgOrderValue   = totalRevenue / Math.max(completedSPK, 1)

  // Build monthly chart data from dashboard
  const monthlyData = Array.isArray(dash.monthlyRevenue)
    ? dash.monthlyRevenue.map((m: any) => ({
        month:    m.month || m.label || "-",
        revenue:  Number(m.realisasi || m.revenue || 0),
        spkCount: Number(m.orderCount || m.count || 0),
      }))
    : [
        { month: "Jan", revenue: 0, spkCount: 0 },
        { month: "Feb", revenue: 0, spkCount: 0 },
        { month: "Mar", revenue: 0, spkCount: 0 },
        { month: "Apr", revenue: 0, spkCount: 0 },
        { month: "Mei", revenue: 0, spkCount: 0 },
        { month: "Jun", revenue: 0, spkCount: 0 },
      ]

  // Top customers by work-order count (from customers API)
  const topCustomers = customers
    .filter((c: any) => (c._count?.workOrders || 0) > 0 || (c.workOrderCount || 0) > 0)
    .sort((a: any, b: any) => (b._count?.workOrders || b.workOrderCount || 0) - (a._count?.workOrders || a.workOrderCount || 0))
    .slice(0, 5)

  // Service popularity from dashboard
  const popularServices: any[] = Array.isArray(dash.popularServices) ? dash.popularServices : []

  return (
    <>
      <AdminHeader title="Laporan" description="Analisis performa dan statistik bisnis" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Period Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                  <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="1year">1 Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 size-4" />Export PDF
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total Pendapatan"
              value={isLoading ? "..." : formatCurrency(totalRevenue)}
              icon={DollarSign}
              colorTheme="blue"
              trend={
                <div className="flex items-center gap-0.5 text-emerald-500 mt-1">
                  <TrendingUp className="size-3" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              }
            />
            <PremiumStatCard
              title="Total SPK"
              value={isLoading ? "..." : totalSPK}
              description={`${completedSPK} selesai`}
              icon={ClipboardList}
              colorTheme="emerald"
              trend={
                <div className="flex items-center gap-0.5 text-emerald-500 mt-1">
                  <TrendingUp className="size-3" />
                  <span className="text-xs font-medium">+8%</span>
                </div>
              }
            />
            <PremiumStatCard
              title="Rata-rata Transaksi"
              value={isLoading ? "..." : formatCurrency(avgOrderValue)}
              icon={TrendingUp}
              colorTheme="purple"
              trend={
                <div className="flex items-center gap-0.5 text-emerald-500 mt-1">
                  <TrendingUp className="size-3" />
                  <span className="text-xs font-medium">+5%</span>
                </div>
              }
            />
            <PremiumStatCard
              title="Total Pelanggan"
              value={isLoading ? "..." : customers.length}
              description={`${totalVehicles} kendaraan`}
              icon={Users}
              colorTheme="orange"
            />
          </div>

          {/* Charts */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
              <TabsTrigger value="spk">Volume SPK</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Pendapatan</CardTitle>
                  <CardDescription>Pendapatan per bulan dalam periode terpilih</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <RevenueChart data={monthlyData} type="area" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="spk">
              <Card>
                <CardHeader>
                  <CardTitle>Volume SPK</CardTitle>
                  <CardDescription>Jumlah SPK per bulan dalam periode terpilih</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <RevenueChart data={monthlyData} type="bar" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Detailed Reports */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Popular Services */}
            <Card>
              <CardHeader>
                <CardTitle>Layanan Terpopuler</CardTitle>
                <CardDescription>Berdasarkan jumlah transaksi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Layanan</TableHead>
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                    ) : popularServices.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Belum ada data layanan</TableCell></TableRow>
                    ) : popularServices.map((service: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{service.name || service.serviceName}</TableCell>
                        <TableCell className="text-center">{service.count || service.orderCount}x</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(service.revenue || 0))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Pelanggan Teratas</CardTitle>
                <CardDescription>Berdasarkan frekuensi kunjungan</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead className="text-center">Kunjungan</TableHead>
                      <TableHead className="text-right">Tipe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                    ) : topCustomers.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Belum ada data pelanggan</TableCell></TableRow>
                    ) : topCustomers.map((customer: any) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email || customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {customer._count?.workOrders || customer.workOrderCount || 0}x
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={customer.customerType === "KORPORAT" ? "default" : "secondary"}>
                            {customer.customerType === "KORPORAT" ? "Korporat" : "Pribadi"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mechanic Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performa Mekanik</CardTitle>
              <CardDescription>Statistik pekerjaan mekanik dalam periode terpilih</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mekanik</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead className="text-center">Total SPK</TableHead>
                    <TableHead className="text-center">SPK Selesai</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : mechanics.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Belum ada data mekanik</TableCell></TableRow>
                  ) : mechanics.map((mechanic: any) => {
                    const name = mechanic.mechanicName || mechanic.name || "-"
                    const spk  = mechanic.totalOrders   || mechanic.spkCompleted || 0
                    const done = mechanic.completedOrders || spk
                    const rating = Number(mechanic.avgRating || mechanic.rating || 0)
                    return (
                      <TableRow key={mechanic.id || mechanic.mechanicId}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell className="text-muted-foreground">{mechanic.specialization || "Umum"}</TableCell>
                        <TableCell className="text-center">{spk}</TableCell>
                        <TableCell className="text-center">{done}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-amber-500 font-semibold">{rating > 0 ? `⭐ ${rating.toFixed(1)}` : "-"}</span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}
