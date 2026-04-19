'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/api-client'

interface SummaryCardsProps {
  spk: {
    total: number
    completed: number
    in_progress: number
  }
  invoices: {
    paid: number
    unpaid: number
    total_unpaid_amount: number
  }
  revenue: {
    current_month: number
    last_month: number
    growth_percent: number
  }
}

export function SummaryCards({ spk, invoices, revenue }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan SPK</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selesai</span>
              <span className="font-medium text-green-600">{spk.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dalam Proses</span>
              <span className="font-medium text-blue-600">{spk.in_progress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{spk.total}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lunas</span>
              <span className="font-medium text-green-600">{invoices.paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Belum Lunas</span>
              <span className="font-medium text-red-600">{invoices.unpaid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Piutang</span>
              <span className="font-medium">{formatCurrency(invoices.total_unpaid_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pertumbuhan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bulan Lalu</span>
              <span className="font-medium">{formatCurrency(revenue.last_month)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bulan Ini</span>
              <span className="font-medium">{formatCurrency(revenue.current_month)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pertumbuhan</span>
              <span className={`font-medium ${revenue.growth_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenue.growth_percent >= 0 ? '+' : ''}{revenue.growth_percent}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
