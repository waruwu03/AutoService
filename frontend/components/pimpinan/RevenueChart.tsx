'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/api-client'

interface RevenueData {
  date: string
  revenue: number
  expenses: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Tren Pendapatan</CardTitle>
        <CardDescription>Pendapatan harian 30 hari terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'dd MMM')}
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.3}
                name="Pendapatan"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
