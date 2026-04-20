"use client"

import * as React from "react"
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, ArrowUpRight } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

const monthlyRevenue = [
  { month: "Jan", pendapatan: 95000000, pengeluaran: 45000000, profit: 50000000 },
  { month: "Feb", pendapatan: 105000000, pengeluaran: 48000000, profit: 57000000 },
  { month: "Mar", pendapatan: 112000000, pengeluaran: 52000000, profit: 60000000 },
  { month: "Apr", pendapatan: 108000000, pengeluaran: 50000000, profit: 58000000 },
  { month: "Mei", pendapatan: 118000000, pengeluaran: 55000000, profit: 63000000 },
  { month: "Jun", pendapatan: 125000000, pengeluaran: 58000000, profit: 67000000 },
  { month: "Jul", pendapatan: 122000000, pengeluaran: 56000000, profit: 66000000 },
  { month: "Agu", pendapatan: 135000000, pengeluaran: 62000000, profit: 73000000 },
  { month: "Sep", pendapatan: 128000000, pengeluaran: 59000000, profit: 69000000 },
  { month: "Okt", pendapatan: 130000000, pengeluaran: 60000000, profit: 70000000 },
  { month: "Nov", pendapatan: 125400000, pengeluaran: 57000000, profit: 68400000 },
]

const revenueByService = [
  { name: "Servis Berkala", amount: 45000000, percentage: 36, trend: "up" },
  { name: "Perbaikan Major", amount: 35000000, percentage: 28, trend: "up" },
  { name: "Detailing", amount: 20000000, percentage: 16, trend: "down" },
  { name: "Sparepart", amount: 15400000, percentage: 12, trend: "up" },
  { name: "Lainnya", amount: 10000000, percentage: 8, trend: "stable" },
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatShort(amount: number): string {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)}jt`
  return formatRupiah(amount)
}

export default function PendapatanReportPage() {
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
            <Button><Download className="mr-2 size-4" /> Export</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Pendapatan Bulan Ini</p>
                  <p className="text-2xl font-bold">Rp 125.4M</p>
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
                  <p className="text-2xl font-bold">Rp 57M</p>
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
                  <p className="text-2xl font-bold">Rp 68.4M</p>
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
                  <p className="text-2xl font-bold">Rp 1.3B</p>
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
