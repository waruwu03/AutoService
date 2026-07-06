"use client"

import * as React from "react"
import Link from "next/link"
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
import { RealtimeStockWidget } from "@/components/admin/RealtimeStockWidget"
import useSWR from "swr"
import { fetcher, apiClient } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001"

function resolvePhotoUrl(photoUrl?: string | null): string | undefined {
  if (!photoUrl) return undefined
  if (photoUrl.startsWith("http")) return photoUrl
  if (photoUrl.startsWith("local:")) {
    const key = photoUrl.replace("local:", "")
    return `${BACKEND_URL}/api/v1/uploads/${key}`
  }
  try {
    const url = new URL(BACKEND_URL || "http://localhost:3001")
    return `http://${url.hostname}:9000/autoservis/${photoUrl}`
  } catch {
    return `http://localhost:9000/autoservis/${photoUrl}`
  }
}

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

export default function PimpinanPage() {
  const { user } = useAuth()
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
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await apiClient.get(
        `/reports/export?type=dashboard&format=${format}`,
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `dashboard-summary-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Laporan dashboard berhasil diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh laporan')
    } finally {
      setIsExporting(false)
    }
  }

  const recentTransactions: any[] = Array.isArray(recentWO?.data) ? recentWO.data : []
  const mechanicPerformance: any[] = Array.isArray(mechanicsRaw) ? mechanicsRaw : []

  const totalRevenue = Number(dash.totalRevenue || dash.monthlyRevenue || 0)
  const completedOrders = Number(dash.completedOrders || dash.totalCompleted || 0)
  const activeOrders = Number(dash.activeWorkOrders || 0)
  const lowStock = Number(dash.lowStockCount || 0)
  const pendingInvoices = Number(dash.pendingInvoices || 0)
  const avgRating = Number(dash.avgRating || 4.8)

  const kpiData = [
    { title: "Pendapatan Bulan Ini", value: isLoading ? "..." : `Rp ${(totalRevenue / 1_000_000).toFixed(1)}jt`, changeType: "positive" as const, icon: DollarSign, color: "bg-blue-500" },
    { title: "SPK Aktif", value: isLoading ? "..." : activeOrders.toString(), changeType: "positive" as const, icon: FileText, color: "bg-emerald-500" },
    { title: "Invoice Pending", value: isLoading ? "..." : pendingInvoices.toString(), changeType: "negative" as const, icon: Clock, color: "bg-amber-500" },
    { title: "Stok Menipis", value: isLoading ? "..." : lowStock.toString(), changeType: "negative" as const, icon: AlertCircle, color: "bg-red-500" },
    { title: "Rating Bengkel", value: isLoading ? "..." : avgRating.toFixed(1), changeType: "positive" as const, icon: Star, color: "bg-purple-500" },
  ]

  const revenueChartData = Array.isArray(dash.monthlyRevenueStats) ? dash.monthlyRevenueStats : [
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
      <PimpinanHeader title="Dashboard Pimpinan" description="Monitor performa operasional bengkel" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-background/50 transition-colors duration-300">

        {/* Welcome Card */}
        <Card className="bg-slate-900 text-white border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="size-32" />
          </div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-orange-400 font-bold uppercase tracking-widest text-[10px] mb-2">Pimpinan Overview</p>
                <h2 className="text-4xl font-extrabold tracking-tighter text-white">Selamat Datang, {user?.name || "Pimpinan"}</h2>
                <p className="text-slate-300 text-sm mt-2 max-w-md">Ringkasan performa bengkel Anda secara real-time dan terintegrasi.</p>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="thismonth">
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                    <Calendar className="mr-2 size-4 text-orange-400" />
                    <SelectValue placeholder="Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thismonth">Bulan Ini</SelectItem>
                    <SelectItem value="lastmonth">Bulan Lalu</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      disabled={isExporting}
                    >
                      {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-slate-900 border-white/10 text-white shadow-2xl">
                    <DropdownMenuItem onClick={() => handleExport('excel')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/20 cursor-pointer transition-all">
                      <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <FileText className="size-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Excel (.xlsx)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/20 cursor-pointer transition-all">
                      <div className="size-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                        <FileText className="size-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">PDF Document (.pdf)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} className="border-none shadow-sm hover:shadow-md transition-all bg-card">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl text-white shadow-lg", kpi.color)}>
                    <kpi.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
                    <p className="text-2xl font-black text-foreground">{kpi.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Revenue Chart */}
          <Card className="lg:col-span-8 border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <BarChart3 className="size-5 text-orange-500" />
                  Analisis Pendapatan
                </CardTitle>
                <CardDescription>Perbandingan Target vs Realisasi (jt)</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-500 font-bold hover:bg-orange-500/10">
                Detail <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={revenueChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                  <XAxis dataKey="month" className="text-[10px] font-bold" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5 }} />
                  <YAxis tickFormatter={(v) => `${v}jt`} className="text-[10px] font-bold" axisLine={false} tickLine={false} tick={{ fill: "currentColor", opacity: 0.5 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="rounded-xl border-none bg-slate-900 p-4 shadow-xl text-white">
                            <p className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">{label}</p>
                            {payload.map((entry, i) => (
                              <p key={i} className="text-sm flex items-center gap-3">
                                <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="font-medium text-slate-200">{entry.name}:</span>
                                <span className="font-black">Rp {entry.value}jt</span>
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} formatter={(v) => <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{v}</span>} />
                  <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realisasi" name="Realisasi" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Service Pie Chart */}
          <Card className="lg:col-span-4 border-none shadow-sm bg-card">
            <CardHeader className="pb-2 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <PieChartIcon className="size-5 text-orange-500" />
                Layanan Populer
              </CardTitle>
              <CardDescription>Distribusi Layanan Bengkel</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {serviceTypeData.length > 0 ? (
                <>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={serviceTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {serviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload?.length) {
                              const d = payload[0].payload
                              return (
                                <div className="rounded-xl border-none bg-slate-900 p-3 shadow-xl text-white">
                                  <p className="font-bold text-xs">{d.name}</p>
                                  <p className="text-xs text-orange-400 font-black">{d.value}%</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 space-y-2">
                    {serviceTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                  {isLoading ? <Loader2 className="size-6 animate-spin" /> : "Belum Ada Data"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Recent SPK */}
          <Card className="lg:col-span-7 border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
              <div>
                <CardTitle className="text-lg font-bold">Aktivitas Terakhir</CardTitle>
                <CardDescription>5 SPK terbaru hari ini</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-border" asChild>
                <Link href="/pimpinan/approvals">Monitor Approval</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor SPK</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pelanggan</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nominal</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="size-6 animate-spin mx-auto text-muted" /></TableCell></TableRow>
                  ) : recentTransactions.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Tidak Ada Aktivitas</TableCell></TableRow>
                  ) : recentTransactions.map((wo: any) => (
                    <TableRow key={wo.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-[11px] font-bold text-muted-foreground">{wo.orderNumber}</TableCell>
                      <TableCell>
                        <p className="text-xs font-bold text-foreground">{wo.customer?.name}</p>
                        <p className="text-[10px] text-muted-foreground italic">{wo.vehicle?.brand} {wo.vehicle?.model}</p>
                      </TableCell>
                      <TableCell className="text-xs font-black text-foreground">{formatRupiah(wo.grandTotal)}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-black uppercase italic border-none shadow-none px-2",
                          wo.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" :
                            wo.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-500" :
                              "bg-muted text-muted-foreground"
                        )}>
                          {wo.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mechanic List */}
          <Card className="lg:col-span-5 border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
              <div>
                <CardTitle className="text-lg font-bold">Top Mekanik</CardTitle>
                <CardDescription>Produktifitas Bulan Ini</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-orange-500 hover:bg-orange-500/10">Detail</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {mechanicPerformance.slice(0, 5).map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-xs font-black shadow-sm group-hover:scale-110 transition-transform",
                      idx === 0 ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"
                    )}>{idx + 1}</div>
                    <Avatar className="size-10 border-2 border-white shadow-sm">
                      <AvatarImage src={resolvePhotoUrl(m.photoUrl)} alt={m.name} className="object-cover" />
                      <AvatarFallback className="bg-slate-200 text-slate-500 font-bold text-xs">{m.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{m.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={(m.completed / Math.max(m.totalOrders, 1)) * 100} className="h-1 flex-1" />
                        <span className="text-[10px] font-black text-orange-500">{m.completed} SPK</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Realtime Stock Widget */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
          <RealtimeStockWidget />
        </div>
      </div>
    </>
  )
}
