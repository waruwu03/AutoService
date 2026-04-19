'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPKForm } from '@/components/admin/SPKForm'
import { useApiMutation, invalidateCache } from '@/hooks/useApi'
import type { SPKFormData, SPK } from '@/types'

export default function CreateSPKPage() {
  const router = useRouter()
  const { post, isLoading } = useApiMutation<SPKFormData, SPK>()

  const handleSubmit = async (data: SPKFormData) => {
    await post('/spk', data, {
      onSuccess: (spk) => {
        toast.success('SPK berhasil dibuat')
        invalidateCache('/spk')
        router.push(`/admin/spk/${spk.id}`)
      },
      onError: (error) => {
        toast.error(error)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Buat SPK Baru</h2>
          <p className="text-muted-foreground">
            Buat Surat Perintah Kerja untuk servis kendaraan
          </p>
        </div>
      </div>

      <SPKForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  )
}
