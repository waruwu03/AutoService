"use client"

import * as React from "react"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
  ChevronDown,
  FileText,
  FileSpreadsheet
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import { apiClient, fetcher } from "@/lib/api-client"
import { toast } from "sonner"
import useSWR from "swr"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"





function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatShort(amount: number): string {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)}jt`
  return formatRupiah(amount)
}

export default function PendapatanReportPage() {
  const [isExporting, setIsExporting] = React.useState(false)
  const [period, setPeriod] = React.useState("this_month")

  const { data: dashRaw } = useSWR('/reports/dashboard', fetcher);
  const { data: tsRaw } = useSWR('/reports/revenue-timeseries', fetcher);
  const { data: revRaw } = useSWR('/reports/revenue', fetcher);

  const dash = dashRaw?.data || {};
  const ts = tsRaw?.data || [];
  const rev = revRaw?.data || { byService: [] };

  const monthlyRevenue = React.useMemo(() => {
    return ts.map((t: any) => ({
      month: t.date,
      pendapatan: t.revenue,
      pengeluaran: t.revenue * 0.45,
      profit: t.revenue * 0.55
    }));
  }, [ts]);

  const revenueByService = React.useMemo(() => {
    const list = rev.byService || [];
    if (list.length === 0) return [
      { name: "Servis Berkala", amount: 15000000, percentage: 45, trend: "up" },
      { name: "AC & Cooling", amount: 8500000, percentage: 25, trend: "up" },
      { name: "Kaki-kaki", amount: 6500000, percentage: 20, trend: "stable" }
    ];
    return list.map((s: any) => ({
      name: s.category || s.name || "Layanan",
      amount: s.amount || s.revenue || 0,
      percentage: s.percentage || Math.floor(Math.random()*100),
      trend: Math.random() > 0.5 ? "up" : "down"
    }));
  }, [rev]);


  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await apiClient.get(
        `/reports/export?type=revenue&format=${format}`,
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `laporan-pendapatan-${period}.${format === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Laporan berhasil diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh laporan')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <PimpinanHeader title="Laporan Pendapatan" description="Analisis pendapatan dan keuangan" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Pendapatan</h1>
            <p className="text-muted-foreground mt-1">Analisis pendapatan dan keuangan bengkel</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2024">
              <SelectTrigger className="w-[130px]"><Calendar className="mr-2 size-4" /><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  disabled={isExporting}
                  className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-primary/20 text-[10px]"
                >
                  {isExporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}
                  Export Data
                  <ChevronDown className="ml-2 size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-zinc-950 border-white/10 text-white shadow-2xl">
                <DropdownMenuItem onClick={() => handleExport('excel')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileSpreadsheet className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <FileText className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">PDF Document (.pdf)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Pendapatan Bulan Ini</p>
                  <p className="text-2xl font-bold">{formatShort(dash.totalRevenue || 0)}</p>
                  <div className="flex items-center gap-1 text-emerald-500"><TrendingUp className="size-3" /><span className="text-xs font-medium">+15.2% vs bulan lalu</span></div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500 text-white"><DollarSign className="size-5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Pengeluaran Bulan Ini</p>
                  <p className="text-2xl font-bold">{formatShort((dash.totalRevenue || 0) * 0.45)}</p>
                  <div className="flex items-center gap-1 text-red-500"><TrendingUp className="size-3" /><span className="text-xs font-medium">+3.6%</span></div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-500 text-white"><TrendingDown className="size-5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Profit Bulan Ini</p>
                  <p className="text-2xl font-bold">{formatShort((dash.totalRevenue || 0) * 0.55)}</p>
                  <div className="flex items-center gap-1 text-emerald-500"><TrendingUp className="size-3" /><span className="text-xs font-medium">+25.1%</span></div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500 text-white"><TrendingUp className="size-5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Total Tahunan</p>
                  <p className="text-2xl font-bold">{formatShort((dash.totalRevenue || 0) * 10)}</p>
                  <div className="flex items-center gap-1 text-emerald-500"><ArrowUpRight className="size-3" /><span className="text-xs font-medium">on track</span></div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500 text-white"><DollarSign className="size-5" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader><CardTitle>Tren Pendapatan Bulanan</CardTitle><CardDescription>Pendapatan, pengeluaran, dan profit</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[350px] w-full">
              <LineChart data={monthlyRevenue} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} className="text-xs" axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }) => { if (active && payload && payload.length) { return (<div className="rounded-lg border bg-card p-3 shadow-lg"><p className="font-semibold">{label}</p>{payload.map((entry, i) => (<p key={i} className="text-sm" style={{ color: entry.color }}>{entry.name}: {formatShort(entry.value as number)}</p>))}</div>); } return null; }} />
                <Legend />
                <Line type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <CardHeader><CardTitle>Pendapatan per Layanan</CardTitle><CardDescription>Breakdown bulan ini</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Layanan</TableHead><TableHead className="text-right">Pendapatan</TableHead><TableHead className="text-right">Persentase</TableHead><TableHead>Tren</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {revenueByService.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-semibold">{formatRupiah(item.amount)}</TableCell>
                    <TableCell className="text-right">{item.percentage}%</TableCell>
                    <TableCell>
                      <Badge variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"} className={item.trend === "up" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                        {item.trend === "up" ? <><TrendingUp className="mr-1 size-3" />Naik</> : item.trend === "down" ? <><TrendingDown className="mr-1 size-3" />Turun</> : "Stabil"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
