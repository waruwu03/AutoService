'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RecentMovement {
  id: number
  type: 'in' | 'out'
  item_name: string
  quantity: number
  date: string
  reference: string
}

interface RecentMovementListProps {
  movements: RecentMovement[]
}

export function RecentMovementList({ movements }: RecentMovementListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Pergerakan Terbaru
        </CardTitle>
        <CardDescription>Transaksi masuk dan keluar terkini</CardDescription>
      </CardHeader>
      <CardContent>
        {!movements?.length ? (
          <div className="text-center py-4 text-muted-foreground">
            Belum ada pergerakan stok
          </div>
        ) : (
          <div className="space-y-3">
            {movements.slice(0, 6).map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {movement.type === 'in' ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{movement.item_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {movement.reference}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={movement.type === 'in' ? 'default' : 'secondary'}>
                    {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(movement.date), 'dd MMM HH:mm', { locale: id })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
