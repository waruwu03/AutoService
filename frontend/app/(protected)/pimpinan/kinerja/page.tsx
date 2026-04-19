'use client'

import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Users,
  Wrench,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { fetcher } from '@/lib/api-client'

interface MekanikPerformance {
  id: number
  name: string
  avatar?: string
  completed_tasks: number
  avg_completion_time: number // in minutes
  rating: number
  efficiency_score: number
  monthly_trend: number // percentage
}

interface TeamStats {
  total_mechanics: number
  total_completed: number
  avg_completion_time: number
  top_performer: string
}

export default function PimpinanKinerjaPage() {
  const { data: teamStats, isLoading: statsLoading } = useSWR<TeamStats>(
    '/pimpinan/team-stats',
    fetcher
  )

  const { data: mechanics, isLoading: mechanicsLoading } = useSWR<MekanikPerformance[]>(
    '/pimpinan/mechanics-performance',
    fetcher
  )

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}j ${mins}m`
    }
    return `${mins}m`
  }

  // Chart data
  const completionData = mechanics?.map(m => ({
    name: m.name.split(' ')[0],
    tasks: m.completed_tasks,
  })) || []

  const radarData = mechanics?.slice(0, 5).map(m => ({
    subject: m.name.split(' ')[0],
    efficiency: m.efficiency_score,
    speed: 100 - (m.avg_completion_time / 180 * 100), // Normalized to 100
    rating: m.rating * 20, // Convert 5-star to 100
  })) || []

  const isLoading = statsLoading || mechanicsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kinerja Tim</h1>
        <p className="text-muted-foreground">
          Pantau performa dan efisiensi tim mekanik
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Mekanik</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.total_mechanics || 0}</div>
            <p className="text-xs text-muted-foreground">Aktif bekerja</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pekerjaan Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats?.total_completed || 0}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Waktu</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(teamStats?.avg_completion_time || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per pekerjaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{teamStats?.top_performer || '-'}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completion Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pekerjaan Selesai per Mekanik</CardTitle>
            <CardDescription>Jumlah pekerjaan yang diselesaikan bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#0088FE" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Performa</CardTitle>
            <CardDescription>Efisiensi, kecepatan, dan rating (Top 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Efisiensi"
                    dataKey="efficiency"
                    stroke="#0088FE"
                    fill="#0088FE"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Kecepatan"
                    dataKey="speed"
                    stroke="#00C49F"
                    fill="#00C49F"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Rating"
                    dataKey="rating"
                    stroke="#FFBB28"
                    fill="#FFBB28"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mechanics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Kinerja Mekanik</CardTitle>
          <CardDescription>Performa individual setiap mekanik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mekanik</TableHead>
                  <TableHead className="text-right">Selesai</TableHead>
                  <TableHead className="text-right">Rata-rata Waktu</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead>Efisiensi</TableHead>
                  <TableHead className="text-right">Tren</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanics?.map((mechanic, index) => (
                  <TableRow key={mechanic.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {index === 0 && (
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        )}
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {mechanic.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{mechanic.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {mechanic.completed_tasks}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTime(mechanic.avg_completion_time)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{mechanic.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={mechanic.efficiency_score} className="h-2 w-20" />
                        <span className="text-sm text-muted-foreground">
                          {mechanic.efficiency_score}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          mechanic.monthly_trend >= 0
                            ? 'text-green-600 border-green-200'
                            : 'text-red-600 border-red-200'
                        }
                      >
                        <TrendingUp className={`mr-1 h-3 w-3 ${mechanic.monthly_trend < 0 ? 'rotate-180' : ''}`} />
                        {mechanic.monthly_trend >= 0 ? '+' : ''}{mechanic.monthly_trend}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
