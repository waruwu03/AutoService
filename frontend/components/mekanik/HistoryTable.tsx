'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { CheckCircle, Car, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SPK } from '@/types'

interface CompletedTask extends SPK {
  started_at: string
  completed_at: string
  duration_minutes: number
}

interface HistoryTableProps {
  data: CompletedTask[]
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}j ${mins}m`
  }
  return `${mins}m`
}

export function HistoryTable({ data }: HistoryTableProps) {
  return (
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
          {data.map((task) => (
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
  )
}
