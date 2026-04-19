'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  FileText,
  Download,
  Calendar,
  Loader2,
  TrendingUp,
  Car,
  Users,
  Package,
  Printer,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher, formatCurrency, apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface ReportData {
  summary: {
    total_revenue: number
    total_spk: number
    total_customers: number
    total_parts_used: number
  }
  daily_revenue: {
    date: string
    revenue: number
    spk_count: number
  }[]
  top_services: {
    name: string
    count: number
    revenue: number
  }[]
  top_parts: {
    name: string
    quantity: number
    revenue: number
  }[]
}

export default function PimpinanLaporanPage() {
  const [period, setPeriod] = useState('this_month')
  const [reportType, setReportType] = useState('revenue')
  const [isExporting, setIsExporting] = useState(false)

  const { data, isLoading } = useSWR<ReportData>(
    `/pimpinan/reports?period=${period}&type=${reportType}`,
    fetcher
  )

  const handleExport = async (exportFormat: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await apiClient.get(
        `/pimpinan/reports/export?period=${period}&type=${reportType}&format=${exportFormat}`,
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `laporan-${reportType}-${period}.${exportFormat === 'pdf' ? 'pdf' : 'xlsx'}`)
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

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return format(new Date(), 'dd MMMM yyyy', { locale: id })
      case 'this_week':
        return `${format(subDays(new Date(), 7), 'dd MMM')} - ${format(new Date(), 'dd MMM yyyy', { locale: id })}`
      case 'this_month':
        return format(new Date(), 'MMMM yyyy', { locale: id })
      case 'this_year':
        return format(new Date(), 'yyyy', { locale: id })
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">Generate dan download laporan bisnis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={() => handleExport('pdf')} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="this_week">Minggu Ini</SelectItem>
                  <SelectItem value="this_month">Bulan Ini</SelectItem>
                  <SelectItem value="this_year">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="h-9 px-4 flex items-center">
              {getPeriodLabel()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data?.summary.total_revenue || 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total SPK</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.total_spk || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pelanggan Dilayani</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.total_customers || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sparepart Terjual</CardTitle>
                <Package className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.total_parts_used || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Pendapatan Harian</TabsTrigger>
              <TabsTrigger value="services">Top Layanan</TabsTrigger>
              <TabsTrigger value="parts">Top Sparepart</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Pendapatan Harian</CardTitle>
                  <CardDescription>Rincian pendapatan per hari</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead className="text-right">Jumlah SPK</TableHead>
                          <TableHead className="text-right">Pendapatan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.daily_revenue.map((item) => (
                          <TableRow key={item.date}>
                            <TableCell>
                              {format(new Date(item.date), 'EEEE, dd MMMM yyyy', { locale: id })}
                            </TableCell>
                            <TableCell className="text-right">{item.spk_count}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Layanan Terpopuler</CardTitle>
                  <CardDescription>Layanan dengan penjualan tertinggi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Layanan</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                          <TableHead className="text-right">Pendapatan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.top_services.map((item, index) => (
                          <TableRow key={item.name}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{index + 1}</Badge>
                                {item.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.count}x</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parts">
              <Card>
                <CardHeader>
                  <CardTitle>Sparepart Terlaris</CardTitle>
                  <CardDescription>Sparepart dengan penjualan tertinggi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Sparepart</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Pendapatan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.top_parts.map((item, index) => (
                          <TableRow key={item.name}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{index + 1}</Badge>
                                {item.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity} pcs</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
