'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  CheckCircle,
  Car,
  Calendar,
  Loader2,
  Search,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/shared/Pagination'
import { fetcher } from '@/lib/api-client'
import type { SPK, PaginatedResponse } from '@/types'

interface CompletedTask extends SPK {
  started_at: string
  completed_at: string
  duration_minutes: number
}

export default function MekanikRiwayatPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useSWR<PaginatedResponse<CompletedTask>>(
    `/mekanik/history?page=${page}&search=${search}`,
    fetcher
  )

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}j ${mins}m`
    }
    return `${mins}m`
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Pekerjaan</h1>
        <p className="text-muted-foreground">Histori pekerjaan yang telah Anda selesaikan</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.meta?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Pekerjaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data.filter(t => 
                new Date(t.completed_at).getMonth() === new Date().getMonth()
              ).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pekerjaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Waktu</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(
                Math.round(
                  (data?.data.reduce((sum, t) => sum + t.duration_minutes, 0) || 0) / 
                  (data?.data.length || 1)
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per pekerjaan</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Riwayat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Cari SPK atau kendaraan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </InputGroup>
          </div>

          {!data?.data.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada riwayat pekerjaan
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. SPK</TableHead>
                      <TableHead>Kendaraan</TableHead>
                      <TableHead>Keluhan</TableHead>
                      <TableHead>Mulai</TableHead>
                      <TableHead>Selesai</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-mono font-medium">
                          {task.nomor_spk}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-mono">{task.vehicle?.nomor_polisi}</div>
                              <div className="text-xs text-muted-foreground">
                                {task.vehicle?.merk} {task.vehicle?.model}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {task.keluhan}
                        </TableCell>
                        <TableCell>
                          {format(new Date(task.started_at), 'dd MMM yyyy HH:mm', { locale: id })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(task.completed_at), 'dd MMM yyyy HH:mm', { locale: id })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDuration(task.duration_minutes)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Selesai
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.meta && (
                <Pagination
                  currentPage={data.meta.current_page}
                  totalPages={data.meta.last_page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
