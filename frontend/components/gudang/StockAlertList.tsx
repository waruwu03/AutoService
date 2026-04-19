'use client'

import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StockAlert {
  id: number
  code: string
  name: string
  stock: number
  min_stock: number
  unit: string
}

interface StockAlertListProps {
  alerts: StockAlert[]
  lowStockCount: number
  outOfStockCount: number
}

export function StockAlertList({ alerts, lowStockCount, outOfStockCount }: StockAlertListProps) {
  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <AlertTriangle className="h-5 w-5" />
          Peringatan Stok
        </CardTitle>
        <CardDescription>
          {lowStockCount + outOfStockCount} item perlu perhatian
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!alerts?.length ? (
          <div className="text-center py-4 text-muted-foreground">
            Tidak ada peringatan stok
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Kode: {item.code}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={item.stock === 0 ? 'destructive' : 'outline'}
                    className={item.stock > 0 ? 'border-yellow-500 text-yellow-700' : ''}
                  >
                    {item.stock === 0 ? 'Habis' : `Sisa ${item.stock} ${item.unit}`}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    Min: {item.min_stock} {item.unit}
                  </div>
                </div>
              </div>
            ))}
            {alerts.length > 5 && (
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/gudang/stok?filter=low">
                  Lihat {alerts.length - 5} item lainnya
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
