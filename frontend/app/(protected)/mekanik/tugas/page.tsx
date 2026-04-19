'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Wrench,
  Clock,
  CheckCircle,
  Car,
  Play,
  Loader2,
  FileText,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { fetcher } from '@/lib/api-client'
import type { SPK } from '@/types'

interface TaskWithDetails extends Omit<SPK, 'items'> {
  work_status: 'pending' | 'in_progress' | 'completed'
  items: {
    id: number
    type: 'service' | 'part'
    name: string
    quantity: number
    completed: boolean
  }[]
}

export default function MekanikTugasPage() {
  const [expandedTask, setExpandedTask] = useState<number | null>(null)

  const { data: tasks, isLoading } = useSWR<TaskWithDetails[]>(
    `/mekanik/tasks`,
    fetcher
  )

  const pendingTasks = tasks?.filter(t => t.work_status === 'pending') || []
  const inProgressTasks = tasks?.filter(t => t.work_status === 'in_progress') || []
  const completedTasks = tasks?.filter(t => t.work_status === 'completed') || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Play className="mr-1 h-3 w-3" />Dikerjakan</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Selesai</Badge>
      default:
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Menunggu</Badge>
    }
  }

  const TaskCard = ({ task }: { task: TaskWithDetails }) => {
    const isExpanded = expandedTask === task.id

    return (
      <Collapsible open={isExpanded} onOpenChange={() => setExpandedTask(isExpanded ? null : task.id)}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{task.nomor_spk}</span>
                  {getStatusBadge(task.work_status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {task.vehicle?.nomor_polisi} - {task.vehicle?.merk} {task.vehicle?.model}
                  </span>
                </div>
                <p className="text-sm">{task.keluhan}</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-4 space-y-4">
              {/* Services */}
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Wrench className="h-4 w-4" />
                  Jasa Perbaikan
                </h4>
                <div className="space-y-2">
                  {task.items?.filter(i => i.type === 'service').map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                        {item.name}
                      </span>
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parts */}
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4" />
                  Sparepart
                </h4>
                <div className="space-y-2">
                  {task.items?.filter(i => i.type === 'part').map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <span>
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      {item.completed ? (
                        <Badge variant="outline" className="text-green-600">Terpasang</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">Belum</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {task.catatan && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    Catatan
                  </h4>
                  <p className="text-sm text-muted-foreground p-2 rounded-md bg-muted/50">
                    {task.catatan}
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    )
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
        <h1 className="text-3xl font-bold tracking-tight">Tugas Saya</h1>
        <p className="text-muted-foreground">Daftar tugas perbaikan yang ditugaskan kepada Anda</p>
      </div>

      <Tabs defaultValue="in_progress">
        <TabsList>
          <TabsTrigger value="in_progress" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Dikerjakan ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Menunggu ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Selesai ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in_progress" className="mt-4 space-y-4">
          {inProgressTasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Tidak ada tugas yang sedang dikerjakan
              </CardContent>
            </Card>
          ) : (
            inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Tidak ada tugas menunggu
              </CardContent>
            </Card>
          ) : (
            pendingTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Belum ada tugas selesai
              </CardContent>
            </Card>
          ) : (
            completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
