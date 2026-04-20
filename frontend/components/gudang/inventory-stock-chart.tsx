'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const stockHistoryData = [
  { date: '20 Mar', stock: 48 },
  { date: '22 Mar', stock: 45 },
  { date: '24 Mar', stock: 42 },
  { date: '26 Mar', stock: 55 },
  { date: '28 Mar', stock: 52 },
  { date: '30 Mar', stock: 48 },
  { date: '01 Apr', stock: 45 },
  { date: '03 Apr', stock: 42 },
  { date: '05 Apr', stock: 38 },
  { date: '07 Apr', stock: 35 },
  { date: '09 Apr', stock: 50 },
  { date: '11 Apr', stock: 47 },
  { date: '13 Apr', stock: 44 },
  { date: '15 Apr', stock: 41 },
  { date: '17 Apr', stock: 38 },
  { date: '19 Apr', stock: 45 },
]

export function InventoryStockChart() {
  const minStock = 20

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Stok 30 Hari Terakhir</CardTitle>
        <CardDescription>Pergerakan level stok dalam satu bulan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-foreground)'
                }}
              />
              <ReferenceLine 
                y={minStock} 
                stroke="var(--color-critical)" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Min Stock', 
                  fill: 'var(--color-critical)',
                  fontSize: 11
                }}
              />
              <Line 
                type="monotone" 
                dataKey="stock" 
                name="Stok"
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-primary" />
            <span className="text-sm text-muted-foreground">Level Stok</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 border-t-2 border-dashed border-critical" />
            <span className="text-sm text-muted-foreground">Stok Minimum (20)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
