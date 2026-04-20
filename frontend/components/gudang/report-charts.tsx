'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const inventoryTrendData = [
  { month: 'Jan', value: 125000000 },
  { month: 'Feb', value: 132000000 },
  { month: 'Mar', value: 128000000 },
  { month: 'Apr', value: 145000000 },
  { month: 'Mei', value: 152000000 },
  { month: 'Jun', value: 148000000 },
]

const categoryPerformanceData = [
  { category: 'Brake', inbound: 145, outbound: 132 },
  { category: 'Fluids', inbound: 198, outbound: 187 },
  { category: 'Filters', inbound: 87, outbound: 92 },
  { category: 'Electrical', inbound: 65, outbound: 58 },
  { category: 'Suspension', inbound: 78, outbound: 71 },
  { category: 'Engine', inbound: 54, outbound: 48 },
]

export function ReportCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Inventory Value Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Nilai Inventori</CardTitle>
          <CardDescription>Perkembangan nilai inventori 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryTrendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-foreground)'
                  }}
                  formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(1)} Juta`, 'Nilai']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performa per Kategori</CardTitle>
          <CardDescription>Perbandingan inbound vs outbound per kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="category" 
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
                <Bar dataKey="inbound" name="Masuk" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" name="Keluar" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-success" />
              <span className="text-sm text-muted-foreground">Barang Masuk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-primary" />
              <span className="text-sm text-muted-foreground">Barang Keluar</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
