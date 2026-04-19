'use client'

import {
  DollarSign,
  FileText,
  Users,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/api-client'

interface ExecDashboardStatsProps {
  revenue: {
    current_month: number
    last_month: number
    growth_percent: number
  }
  spk: {
    total: number
    completed: number
    in_progress: number
  }
  customers: {
    total: number
    new_this_month: number
  }
  invoices: {
    paid: number
    unpaid: number
    total_unpaid_amount: number
  }
}

export function ExecDashboardStats({ revenue, spk, customers, invoices }: ExecDashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(revenue.current_month)}
          </div>
          <div className="flex items-center text-xs">
            {revenue.growth_percent >= 0 ? (
              <>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-600">+{revenue.growth_percent}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span className="text-red-600">{revenue.growth_percent}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">dari bulan lalu</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total SPK</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{spk.total}</div>
          <div className="flex gap-2 text-xs">
            <Badge variant="outline" className="text-green-600">
              {spk.completed} selesai
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              {spk.in_progress} proses
            </Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customers.total}</div>
          <p className="text-xs text-muted-foreground">
            +{customers.new_this_month} pelanggan baru bulan ini
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Piutang</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(invoices.total_unpaid_amount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {invoices.unpaid} invoice belum lunas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
