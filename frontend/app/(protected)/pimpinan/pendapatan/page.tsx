'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format, subMonths } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
} from 'recharts'
import { fetcher, formatCurrency } from '@/lib/api-client'

interface RevenueStats {
  current_month: number
  last_month: number
  growth_percent: number
  total_year: number
  avg_daily: number
  highest_day: {
    date: string
    amount: number
  }
}

interface MonthlyData {
  month: string
  revenue: number
  services: number
  parts: number
}

interface DailyData {
  date: string
  revenue: number
  target: number
}

export default function PimpinanPendapatanPage() {
  const [year, setYear] = useState(new Date().getFullYear().toString())

  const { data: stats, isLoading: statsLoading } = useSWR<RevenueStats>(
    '/pimpinan/revenue-stats',
    fetcher
  )

  const { data: monthlyData } = useSWR<MonthlyData[]>(
    `/pimpinan/revenue-monthly?year=${year}`,
    fetcher
  )

  const { data: dailyData } = useSWR<DailyData[]>(
    '/pimpinan/revenue-daily',
    fetcher
  )

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pendapatan</h1>
          <p className="text-muted-foreground">Analisis pendapatan dan tren bisnis</p>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.current_month || 0)}
            </div>
            <div className="flex items-center text-xs mt-1">
              {(stats?.growth_percent || 0) >= 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">+{stats?.growth_percent}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">{stats?.growth_percent}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bulan Lalu</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.last_month || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(subMonths(new Date(), 1), 'MMMM yyyy', { locale: id })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tahun Ini</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.total_year || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Januari - sekarang</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Harian</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.avg_daily || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per hari kerja</p>
          </CardContent>
        </Card>
      </div>

      {/* Highest Day Card */}
      {stats?.highest_day && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Pendapatan Tertinggi</p>
                  <p className="text-xs text-green-600">
                    {format(new Date(stats.highest_day.date), 'EEEE, dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(stats.highest_day.amount)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pendapatan Harian</CardTitle>
            <CardDescription>Pendapatan vs target 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'dd')}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: id })}
                  />
                  <Bar dataKey="revenue" fill="#0088FE" name="Pendapatan" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="target" stroke="#FF8042" strokeDasharray="5 5" name="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Bulanan</CardTitle>
            <CardDescription>Tren pendapatan tahun {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                    fontSize={12}
                  />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0088FE"
                    fill="#0088FE"
                    fillOpacity={0.3}
                    name="Total"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Pendapatan</CardTitle>
            <CardDescription>Jasa vs Sparepart per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                    fontSize={12}
                  />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="services" stackId="a" fill="#0088FE" name="Jasa" />
                  <Bar dataKey="parts" stackId="a" fill="#00C49F" name="Sparepart" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#0088FE]" />
                <span className="text-sm text-muted-foreground">Jasa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-[#00C49F]" />
                <span className="text-sm text-muted-foreground">Sparepart</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
