'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Printer, Receipt, Play, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SPKDetailView } from '@/components/admin/SPKDetailView'
import { useApiGet, useApiMutation, invalidateCache } from '@/hooks/useApi'
import type { SPK } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SPKDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: spk, isLoading, error } = useApiGet<SPK>(`/spk/${id}`)
  const { patch, isLoading: isUpdating } = useApiMutation()

  const updateStatus = async (status: string) => {
    await patch(`/spk/${id}/status`, { status }, {
      onSuccess: () => {
        toast.success('Status SPK berhasil diubah')
        invalidateCache('/spk')
      },
      onError: (error) => {
        toast.error(error)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !spk) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">SPK tidak ditemukan</p>
        <Button asChild variant="outline">
          <Link href="/admin/spk">Kembali ke Daftar SPK</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="flex flex-wrap gap-2">
          {spk.status === 'draft' && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/spk/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button 
                size="sm" 
                onClick={() => updateStatus('pending')}
                disabled={isUpdating}
              >
                <Play className="mr-2 h-4 w-4" />
                Mulai Proses
              </Button>
            </>
          )}

          {spk.status === 'pending' && (
            <Button 
              size="sm"
              onClick={() => updateStatus('dikerjakan')}
              disabled={isUpdating}
            >
              <Play className="mr-2 h-4 w-4" />
              Mulai Pengerjaan
            </Button>
          )}

          {spk.status === 'dikerjakan' && (
            <>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => updateStatus('menunggu_part')}
                disabled={isUpdating}
              >
                Menunggu Part
              </Button>
              <Button 
                size="sm"
                onClick={() => updateStatus('selesai')}
                disabled={isUpdating}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Selesaikan
              </Button>
            </>
          )}

          {spk.status === 'menunggu_part' && (
            <Button 
              size="sm"
              onClick={() => updateStatus('dikerjakan')}
              disabled={isUpdating}
            >
              <Play className="mr-2 h-4 w-4" />
              Lanjutkan Pengerjaan
            </Button>
          )}

          {spk.status === 'selesai' && (
            <Button asChild size="sm">
              <Link href={`/admin/invoices/create?spk_id=${id}`}>
                <Receipt className="mr-2 h-4 w-4" />
                Buat Invoice
              </Link>
            </Button>
          )}

          {['draft', 'pending'].includes(spk.status) && (
            <Button 
              size="sm"
              variant="destructive"
              onClick={() => updateStatus('dibatalkan')}
              disabled={isUpdating}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Batalkan
            </Button>
          )}

          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
      </div>

      {/* SPK Detail */}
      <SPKDetailView spk={spk} />
    </div>
  )
}
