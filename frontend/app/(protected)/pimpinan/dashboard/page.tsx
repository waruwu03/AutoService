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
  Loader2,
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
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
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
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const chartConfig = {
  target: { label: "Target", color: "#94a3b8" },
  realisasi: { label: "Realisasi", color: "#3b82f6" },
}

export default function DashboardPage() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate()
  const startDate = `${y}-${m}-01`
  const endDate = `${y}-${m}-${String(lastDay).padStart(2, "0")}`

  const { data: dashRaw, isLoading } = useSWR(
    `/reports/dashboard?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  )
  const { data: recentWO } = useSWR("/work-orders?limit=5&sortBy=createdAt&sortOrder=desc", fetcher)
  const { data: mechanicsRaw } = useSWR(`/reports/mechanics?startDate=${startDate}&endDate=${endDate}`, fetcher)

  const dash = dashRaw?.data || dashRaw || {}
  const recentTransactions: any[] = Array.isArray(recentWO?.data) ? recentWO.data : []
  const mechanicPerformance: any[] = Array.isArray(mechanicsRaw) ? mechanicsRaw : []

  const totalRevenue = Number(dash.totalRevenue || dash.revenue || 0)
  const completedOrders = Number(dash.completedOrders || dash.totalCompleted || 0)
  const pendingOrders = Number(dash.pendingOrders || 0)
  const avgRating = Number(dash.avgRating || 4.8)
  const activeMechanics = mechanicPerformance.filter((m: any) => m.isActive !== false).length

  const kpiData = [
    { title: "Total Pendapatan", value: isLoading ? "..." : `Rp ${(totalRevenue / 1_000_000).toFixed(1)}M`, change: "+", changeType: "positive" as const, subtext: "bulan ini", icon: DollarSign, colorTheme: "blue" as const },
    { title: "SPK Selesai", value: isLoading ? "..." : completedOrders.toString(), change: "+", changeType: "positive" as const, subtext: "completed", icon: FileText, colorTheme: "emerald" as const },
    { title: "SPK Pending", value: isLoading ? "..." : pendingOrders.toString(), change: "-", changeType: "negative" as const, subtext: "menunggu", icon: Clock, colorTheme: "amber" as const },
    { title: "Rating", value: isLoading ? "..." : avgRating.toFixed(1), change: "+0.2", changeType: "positive" as const, subtext: "dari 5.0", icon: Star, colorTheme: "purple" as const },
    { title: "Mekanik Aktif", value: isLoading ? "..." : activeMechanics.toString(), change: "0", changeType: "neutral" as const, subtext: "on duty", icon: Users, colorTheme: "orange" as const },
  ]

  const revenueChartData = Array.isArray(dash.monthlyRevenueStats || dash.monthlyRevenue) ? (dash.monthlyRevenueStats || dash.monthlyRevenue) : [
    { month: "Jan", target: 100, realisasi: 0 },
    { month: "Feb", target: 100, realisasi: 0 },
    { month: "Mar", target: 110, realisasi: 0 },
    { month: "Apr", target: 110, realisasi: 0 },
    { month: "Mei", target: 120, realisasi: 0 },
    { month: "Jun", target: 120, realisasi: 0 },
  ]

  const serviceTypeData: { name: string; value: number; color: string }[] = Array.isArray(dash.serviceBreakdown)
    ? dash.serviceBreakdown.map((s: any, i: number) => ({
      name: s.name, value: s.percentage || s.count || 0, color: CHART_COLORS[i % CHART_COLORS.length],
    }))
    : []

  return (
    <>
      <PimpinanHeader title="Dashboard Analytics" description="Ringkasan performa bengkel" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Analytics</h1>
            <p className="text-muted-foreground mt-1">Berikut ringkasan performa bengkel Anda bulan ini.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="thismonth">
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 size-4 text-muted-foreground" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thismonth">Bulan Ini</SelectItem>
                <SelectItem value="lastmonth">Bulan Lalu</SelectItem>
                <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Download className="mr-2 size-4" />Export PDF</DropdownMenuItem>
                <DropdownMenuItem><Download className="mr-2 size-4" />Export Excel</DropdownMenuItem>
                <DropdownMenuItem><Printer className="mr-2 size-4" />Print Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {kpiData.map((kpi) => (
            <PremiumStatCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              description={kpi.subtext}
              icon={kpi.icon}
              colorTheme={kpi.colorTheme}
              trend={
                <div className="flex items-center gap-1 mt-1">
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
                </div>
              }
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-blue-500" />
                  Pendapatan Bulanan
                </CardTitle>
                <CardDescription>Target vs Realisasi (dalam juta Rupiah)</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpRight className="size-4" />Detail
              </Button>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <BarChart data={revenueChartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                  <YAxis tickFormatter={(v) => `${v}jt`} className="text-xs" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-lg">
                            <p className="font-semibold">{label}</p>
                            {payload.map((entry, i) => (
                              <p key={i} className="text-sm flex items-center gap-2 mt-1">
                                <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
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
                  <Legend wrapperStyle={{ paddingTop: "16px" }} formatter={(v) => <span className="text-sm text-muted-foreground">{v}</span>} />
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
              <CardDescription>Breakdown layanan bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              {serviceTypeData.length > 0 ? (
                <>
                  <ChartContainer config={{}} className="h-[200px] w-full">
                    <PieChart>
                      <Pie data={serviceTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {serviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.length) {
                            const d = payload[0].payload
                            return (
                              <div className="rounded-lg border bg-card p-3 shadow-lg">
                                <p className="font-semibold">{d.name}</p>
                                <p className="text-sm text-muted-foreground">{d.value} dari total</p>
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
                          <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Data belum tersedia"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Recent Transactions */}
          <Card className="lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
                <CardDescription>5 transaksi terakhir</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="size-4" />Lihat Semua
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : recentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Tidak ada transaksi</TableCell>
                    </TableRow>
                  ) : recentTransactions.map((wo: any) => {
                    const spkNum = wo.orderNumber || wo.spkNumber || "-"
                    const customerName = wo.customer?.name || "-"
                    const vehicleInfo = `${wo.vehicle?.brand || ""} ${wo.vehicle?.model || ""}`.trim()
                    const serviceName = wo.services?.[0]?.service?.name || "Servis Umum"
                    const amount = Number(wo.grandTotal || 0)
                    const status = wo.status || "PENDING"
                    return (
                      <TableRow key={wo.id}>
                        <TableCell className="font-medium font-mono text-xs">{spkNum}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customerName}</p>
                            <p className="text-xs text-muted-foreground">{vehicleInfo} · {serviceName}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatRupiah(amount)}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-white text-xs",
                            status === "COMPLETED" && "bg-emerald-500",
                            status === "INVOICED" && "bg-blue-500",
                            status === "IN_PROGRESS" && "bg-amber-500",
                            (status === "PENDING" || status === "WAITING_PARTS") && "bg-slate-400",
                            status === "CANCELLED" && "bg-red-500",
                          )}>
                            {status === "COMPLETED" && <><CheckCircle className="mr-1 size-3" />Selesai</>}
                            {status === "INVOICED" && <><CheckCircle className="mr-1 size-3" />Invoiced</>}
                            {status === "IN_PROGRESS" && <><Clock className="mr-1 size-3" />Proses</>}
                            {(status === "PENDING" || status === "WAITING_PARTS") && <><AlertCircle className="mr-1 size-3" />Pending</>}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Mechanics */}
          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Top Mekanik</CardTitle>
                <CardDescription>Performa bulan ini</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Users className="size-4" />Detail
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-6"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
                ) : mechanicPerformance.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">Tidak ada data mekanik</p>
                ) : mechanicPerformance.slice(0, 5).map((mechanic: any, index: number) => {
                  const name = mechanic.mechanicName || mechanic.name || "-"
                  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
                  const spkDone = Number(mechanic.totalOrders || mechanic.spkCompleted || 0)
                  const rating = Number(mechanic.avgRating || mechanic.rating || 4.5).toFixed(1)
                  const maxSpk = Math.max(...mechanicPerformance.map((m: any) => Number(m.totalOrders || m.spkCompleted || 1)))
                  const progress = Math.round((spkDone / Math.max(maxSpk, 1)) * 100)
                  return (
                    <div key={mechanic.id || mechanic.mechanicId || index} className="flex items-center gap-4">
                      <div className={cn(
                        "flex size-8 items-center justify-center rounded-full text-sm font-bold",
                        index === 0 && "bg-amber-100 text-amber-700",
                        index === 1 && "bg-slate-100 text-slate-700",
                        index === 2 && "bg-orange-100 text-orange-700",
                        index > 2 && "bg-muted text-muted-foreground"
                      )}>{index + 1}</div>
                      <Avatar className="size-10 bg-slate-100">
                        <AvatarImage src={resolvePhotoUrl(mechanic.photoUrl)} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{spkDone} SPK</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {rating}
                          </span>
                        </div>
                      </div>
                      <div className="w-20">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">SPK</span>
                          <span className="font-medium">{spkDone}</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
