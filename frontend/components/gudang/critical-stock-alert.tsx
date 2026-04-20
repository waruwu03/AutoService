'use client'

import { AlertTriangle, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { inventoryItems } from '@/lib/gudang-data'

export function CriticalStockAlert() {
  const [isVisible, setIsVisible] = useState(true)
  
  const criticalItems = inventoryItems.filter(item => item.status === 'critical')
  
  if (!isVisible || criticalItems.length === 0) {
    return null
  }

  return (
    <div className="sticky top-14 z-20 bg-critical/10 border-b border-critical/30 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-critical/20">
          <AlertTriangle className="size-4 text-critical" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-critical">Peringatan Stok Kritis!</h3>
            <span className="rounded-full bg-critical px-2 py-0.5 text-xs font-medium text-critical-foreground">
              {criticalItems.length} Item
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 text-sm">
            {criticalItems.map((item, index) => (
              <span key={item.id} className="text-foreground/80">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground"> (Sisa: {item.currentStock})</span>
                {index < criticalItems.length - 1 && <span className="text-muted-foreground">, </span>}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-critical hover:text-critical hover:bg-critical/20"
            asChild
          >
            <Link href="/gudang/inventory?status=critical">
              Lihat Detail
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => setIsVisible(false)}
          >
            <X className="size-4" />
            <span className="sr-only">Tutup</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
