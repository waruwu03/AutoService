'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/admin/CustomerForm'
import { useApiMutation, invalidateCache } from '@/hooks/useApi'
import type { CustomerFormData, Customer } from '@/types'

export default function CreateCustomerPage() {
  const router = useRouter()
  const { post, isLoading } = useApiMutation<CustomerFormData, Customer>()

  const handleSubmit = async (data: CustomerFormData) => {
    await post('/customers', data, {
      onSuccess: () => {
        toast.success('Pelanggan berhasil ditambahkan')
        invalidateCache('/customers')
        router.push('/admin/customers')
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
          <h2 className="text-2xl font-bold tracking-tight">Tambah Pelanggan</h2>
          <p className="text-muted-foreground">
            Tambahkan pelanggan baru ke sistem
          </p>
        </div>
      </div>

      <CustomerForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  )
}
