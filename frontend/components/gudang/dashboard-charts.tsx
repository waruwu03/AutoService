'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const stockMovementData = [
  { name: '13 Apr', inbound: 45, outbound: 32 },
  { name: '14 Apr', inbound: 28, outbound: 41 },
  { name: '15 Apr', inbound: 52, outbound: 28 },
  { name: '16 Apr', inbound: 38, outbound: 35 },
  { name: '17 Apr', inbound: 42, outbound: 29 },
  { name: '18 Apr', inbound: 65, outbound: 38 },
  { name: '19 Apr', inbound: 35, outbound: 12 },
]

const categoryData = [
  { name: 'Brake System', value: 156, fill: 'var(--color-chart-1)' },
  { name: 'Fluids', value: 89, fill: 'var(--color-chart-2)' },
  { name: 'Filters', value: 124, fill: 'var(--color-chart-3)' },
  { name: 'Electrical', value: 78, fill: 'var(--color-chart-4)' },
  { name: 'Suspension', value: 95, fill: 'var(--color-chart-5)' },
]

const mostRequestedParts = [
  { name: 'Engine Oil 5W-30', requests: 156 },
  { name: 'Brake Pad Set', requests: 134 },
  { name: 'Air Filter', requests: 98 },
  { name: 'Spark Plug', requests: 87 },
  { name: 'Coolant', requests: 76 },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Stock Movement Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Pergerakan Stok 7 Hari Terakhir</CardTitle>
          <CardDescription>Perbandingan barang masuk dan keluar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
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

      {/* Most Requested Parts */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Parts Paling Sering Diminta</CardTitle>
          <CardDescription>Berdasarkan jumlah permintaan bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostRequestedParts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  type="number"
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={120}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
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
                <Bar dataKey="requests" name="Permintaan" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribusi Stok per Kategori</CardTitle>
          <CardDescription>Jumlah jenis parts berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      color: 'var(--color-foreground)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-3 rounded-sm" 
                      style={{ backgroundColor: category.fill }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="font-medium">{category.value} items</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
