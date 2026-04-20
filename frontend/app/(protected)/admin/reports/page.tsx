"use client"

import { useState } from "react"
import { Download, TrendingUp, TrendingDown, Calendar, DollarSign, ClipboardList, Users, Car } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { StatsCard } from "@/components/admin/stats-card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockSPKs,
  mockInvoices,
  mockCustomers,
  mockVehicles,
  mockMechanics,
  getCustomerById,
  formatCurrency,
} from "@/lib/mock-data"

// Generate mock monthly data
const monthlyData = [
  { month: "Jan", revenue: 15500000, spkCount: 12 },
  { month: "Feb", revenue: 18200000, spkCount: 15 },
  { month: "Mar", revenue: 22100000, spkCount: 18 },
  { month: "Apr", revenue: 19800000, spkCount: 16 },
  { month: "Mei", revenue: 24500000, spkCount: 20 },
  { month: "Jun", revenue: 21300000, spkCount: 17 },
]

// Service popularity
const popularServices = [
  { name: "Ganti Oli Mesin", count: 45, revenue: 6750000 },
  { name: "Tune Up", count: 32, revenue: 11200000 },
  { name: "Servis AC", count: 28, revenue: 7000000 },
  { name: "Ganti Kampas Rem", count: 24, revenue: 4800000 },
  { name: "Spooring & Balancing", count: 18, revenue: 5400000 },
]

// Top customers
const topCustomers = mockCustomers
  .map((customer) => {
    const customerInvoices = mockInvoices.filter((inv) => inv.customerId === customer.id)
    const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.total, 0)
    return { ...customer, totalSpent, invoiceCount: customerInvoices.length }
  })
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 5)

export default function ReportsPage() {
  const [period, setPeriod] = useState("6months")

  const totalRevenue = mockInvoices
    .filter((inv) => inv.paymentStatus === "paid")
    .reduce((sum, inv) => sum + inv.total, 0)
  const totalSPK = mockSPKs.length
  const completedSPK = mockSPKs.filter((s) => s.status === "completed").length
  const averageOrderValue = totalRevenue / (completedSPK || 1)

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
              <Download className="mr-2 size-4" />
              Export PDF
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Pendapatan"
              value={formatCurrency(totalRevenue)}
              icon={DollarSign}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total SPK"
              value={totalSPK}
              description={`${completedSPK} selesai`}
              icon={ClipboardList}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Rata-rata Transaksi"
              value={formatCurrency(averageOrderValue)}
              icon={TrendingUp}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Total Pelanggan"
              value={mockCustomers.length}
              description={`${mockVehicles.length} kendaraan`}
              icon={Users}
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
                  <CardDescription>Pendapatan bulanan dalam 6 bulan terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={monthlyData} type="area" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spk">
              <Card>
                <CardHeader>
                  <CardTitle>Volume SPK</CardTitle>
                  <CardDescription>Jumlah SPK per bulan dalam 6 bulan terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={monthlyData} type="bar" />
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
                    {popularServices.map((service, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-center">{service.count}x</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(service.revenue)}
                        </TableCell>
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
                <CardDescription>Berdasarkan total transaksi</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead className="text-center">Transaksi</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.type === "korporat" ? "Korporat" : "Pribadi"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{customer.invoiceCount}x</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(customer.totalSpent)}
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
              <CardDescription>Statistik pekerjaan mekanik</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mekanik</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead className="text-center">SPK Dikerjakan</TableHead>
                    <TableHead className="text-center">SPK Selesai</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMechanics.map((mechanic) => {
                    const assignedSPK = mockSPKs.filter((s) => s.mechanicId === mechanic.id).length
                    const completedSPK = mockSPKs.filter(
                      (s) => s.mechanicId === mechanic.id && s.status === "completed"
                    ).length

                    return (
                      <TableRow key={mechanic.id}>
                        <TableCell className="font-medium">{mechanic.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {mechanic.specialization}
                        </TableCell>
                        <TableCell className="text-center">{assignedSPK}</TableCell>
                        <TableCell className="text-center">{completedSPK}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              mechanic.status === "available"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : mechanic.status === "busy"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {mechanic.status === "available"
                              ? "Tersedia"
                              : mechanic.status === "busy"
                              ? "Sibuk"
                              : "Tidak Aktif"}
                          </span>
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
