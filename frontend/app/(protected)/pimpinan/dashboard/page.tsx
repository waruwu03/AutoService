"use client"

import * as React from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  Star,
  Users,
  Download,
  Printer,
  Calendar,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

// Mock Data
const kpiData = [
  {
    title: "Total Pendapatan",
    value: "Rp 125.4M",
    change: "+15.2%",
    changeType: "positive" as const,
    subtext: "vs bulan lalu",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "SPK Selesai",
    value: "45",
    change: "+8",
    changeType: "positive" as const,
    subtext: "completed",
    icon: FileText,
    color: "bg-emerald-500",
  },
  {
    title: "SPK Pending",
    value: "12",
    change: "-3",
    changeType: "negative" as const,
    subtext: "menunggu",
    icon: Clock,
    color: "bg-amber-500",
  },
  {
    title: "Rating",
    value: "4.8",
    change: "+0.2",
    changeType: "positive" as const,
    subtext: "dari 5.0",
    icon: Star,
    color: "bg-purple-500",
  },
  {
    title: "Mekanik Aktif",
    value: "5",
    change: "0",
    changeType: "neutral" as const,
    subtext: "on duty",
    icon: Users,
    color: "bg-slate-500",
  },
]

const revenueChartData = [
  { month: "Jan", target: 100, realisasi: 95 },
  { month: "Feb", target: 100, realisasi: 105 },
  { month: "Mar", target: 110, realisasi: 112 },
  { month: "Apr", target: 110, realisasi: 108 },
  { month: "Mei", target: 120, realisasi: 118 },
  { month: "Jun", target: 120, realisasi: 125 },
  { month: "Jul", target: 130, realisasi: 122 },
  { month: "Agu", target: 130, realisasi: 135 },
  { month: "Sep", target: 125, realisasi: 128 },
  { month: "Okt", target: 125, realisasi: 130 },
  { month: "Nov", target: 130, realisasi: 125 },
  { month: "Des", target: 140, realisasi: 0 },
]

const serviceTypeData = [
  { name: "Servis Berkala", value: 45, color: "#3b82f6" },
  { name: "Perbaikan Major", value: 28, color: "#10b981" },
  { name: "Detailing", value: 16, color: "#f59e0b" },
  { name: "Konsultasi", value: 11, color: "#8b5cf6" },
]

const recentTransactions = [
  {
    spkNumber: "SPK-2024-0145",
    customer: "Ahmad Wijaya",
    vehicle: "Toyota Avanza",
    service: "Servis Berkala 20.000 KM",
    amount: 2500000,
    date: "15 Nov 2024",
    status: "completed",
  },
  {
    spkNumber: "SPK-2024-0144",
    customer: "Siti Rahayu",
    vehicle: "Honda Jazz",
    service: "Ganti Kampas Rem + Tune Up",
    amount: 3750000,
    date: "15 Nov 2024",
    status: "in_progress",
  },
  {
    spkNumber: "SPK-2024-0143",
    customer: "Budi Pratama",
    vehicle: "Mitsubishi Pajero",
    service: "Perbaikan AC Mobil",
    amount: 4200000,
    date: "14 Nov 2024",
    status: "pending",
  },
  {
    spkNumber: "SPK-2024-0142",
    customer: "Dewi Lestari",
    vehicle: "BMW X3",
    service: "Detailing Premium",
    amount: 1500000,
    date: "14 Nov 2024",
    status: "completed",
  },
  {
    spkNumber: "SPK-2024-0141",
    customer: "Riko Santoso",
    vehicle: "Toyota Fortuner",
    service: "Overhaul Mesin",
    amount: 15000000,
    date: "13 Nov 2024",
    status: "in_progress",
  },
]

const mechanicPerformance = [
  { name: "Andi Susanto", spkCompleted: 12, rating: 4.9, efficiency: 98, avatar: "AS" },
  { name: "Beni Kurniawan", spkCompleted: 10, rating: 4.7, efficiency: 92, avatar: "BK" },
  { name: "Cahyo Wibowo", spkCompleted: 9, rating: 4.8, efficiency: 95, avatar: "CW" },
  { name: "Dedi Prasetyo", spkCompleted: 8, rating: 4.6, efficiency: 88, avatar: "DP" },
  { name: "Eko Saputra", spkCompleted: 6, rating: 4.5, efficiency: 82, avatar: "ES" },
]

const chartConfig = {
  target: {
    label: "Target",
    color: "#94a3b8",
  },
  realisasi: {
    label: "Realisasi",
    color: "#3b82f6",
  },
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DashboardPage() {
  return (
    <>
      <PimpinanHeader title="Dashboard Analytics" description="Ringkasan performa bengkel" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang, Kepala Bengkel! Berikut ringkasan performa bengkel Anda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="november">
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="november">November 2024</SelectItem>
                <SelectItem value="oktober">Oktober 2024</SelectItem>
                <SelectItem value="september">September 2024</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" />
                  Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 size-4" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {kpiData.map((kpi) => (
            <Card key={kpi.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className="flex items-center gap-1">
                      {kpi.changeType === "positive" && (
                        <div className="flex items-center gap-0.5 text-emerald-500">
                          <TrendingUp className="size-3" />
                          <span className="text-xs font-medium">{kpi.change}</span>
                        </div>
                      )}
                      {kpi.changeType === "negative" && (
                        <div className="flex items-center gap-0.5 text-red-500">
                          <TrendingDown className="size-3" />
                          <span className="text-xs font-medium">{kpi.change}</span>
                        </div>
                      )}
                      {kpi.changeType === "neutral" && (
                        <span className="text-xs font-medium text-muted-foreground">{kpi.change}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{kpi.subtext}</span>
                    </div>
                  </div>
                  <div className={cn("flex size-10 items-center justify-center rounded-lg text-white", kpi.color)}>
                    <kpi.icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-blue-500" />
                  Pendapatan Bulanan
                </CardTitle>
                <CardDescription>
                  Target vs Realisasi (dalam juta Rupiah)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpRight className="size-4" />
                Detail
              </Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={revenueChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis
                    tickFormatter={(value) => `${value}jt`}
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-lg">
                            <p className="font-semibold">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm flex items-center gap-2 mt-1">
                                <span 
                                  className="size-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-muted-foreground">{entry.name}:</span>
                                <span className="font-medium">Rp {entry.value}jt</span>
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '16px' }}
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                  <Bar dataKey="target" name="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realisasi" name="Realisasi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChartIcon className="size-5 text-blue-500" />
                Layanan Populer
              </CardTitle>
              <CardDescription>Breakdown pendapatan bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[200px] w-full">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-lg">
                            <p className="font-semibold">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value}% dari total
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ChartContainer>
              <div className="mt-4 space-y-3">
                {serviceTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
                <CardDescription>5 transaksi terakhir</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="size-4" />
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SPK</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.spkNumber}>
                      <TableCell className="font-medium">
                        {transaction.spkNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.customer}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.vehicle} - {transaction.service}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatRupiah(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                          className={cn(
                            transaction.status === "completed" && "bg-emerald-500 hover:bg-emerald-600",
                            transaction.status === "in_progress" && "bg-amber-500 hover:bg-amber-600 text-white"
                          )}
                        >
                          {transaction.status === "completed" && (
                            <>
                              <CheckCircle className="mr-1 size-3" />
                              Selesai
                            </>
                          )}
                          {transaction.status === "in_progress" && (
                            <>
                              <Clock className="mr-1 size-3" />
                              Dikerjakan
                            </>
                          )}
                          {transaction.status === "pending" && (
                            <>
                              <AlertCircle className="mr-1 size-3" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Top Mekanik</CardTitle>
                <CardDescription>Performa bulan ini</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Users className="size-4" />
                Detail
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mechanicPerformance.map((mechanic, index) => (
                  <div key={mechanic.name} className="flex items-center gap-4">
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                      index === 0 && "bg-amber-100 text-amber-700",
                      index === 1 && "bg-slate-100 text-slate-700",
                      index === 2 && "bg-orange-100 text-orange-700",
                      index > 2 && "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    <Avatar className="size-10">
                      <AvatarImage src={`/avatars/${mechanic.name.toLowerCase().replace(' ', '-')}.jpg`} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {mechanic.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{mechanic.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{mechanic.spkCompleted} SPK</span>
                        <span>-</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {mechanic.rating}
                        </span>
                      </div>
                    </div>
                    <div className="w-20">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Efisiensi</span>
                        <span className="font-medium">{mechanic.efficiency}%</span>
                      </div>
                      <Progress value={mechanic.efficiency} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
