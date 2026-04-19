'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SPKTable } from '@/components/admin/SPKTable'
import { Pagination } from '@/components/shared/Pagination'
import { useApiPaginated, useApiMutation, invalidateCache } from '@/hooks/useApi'
import type { SPK } from '@/types'

export default function SPKPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  
  const { data, meta, isLoading } = useApiPaginated<SPK>(
    '/spk',
    page,
    10,
    { 
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
    }
  )

  const { delete: deleteSPK, isLoading: isDeleting } = useApiMutation()

  const handleDelete = async (id: number) => {
    await deleteSPK(`/spk/${id}`, {
      onSuccess: () => {
        toast.success('SPK berhasil dihapus')
        invalidateCache('/spk')
      },
      onError: (error) => {
        toast.error(error)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Surat Perintah Kerja</h2>
          <p className="text-muted-foreground">
            Kelola SPK servis kendaraan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/spk/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat SPK Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar SPK</CardTitle>
          <CardDescription>
            Total {meta?.total || 0} SPK tercatat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nomor SPK, pelanggan, kendaraan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="dikerjakan">Dikerjakan</SelectItem>
                <SelectItem value="menunggu_part">Menunggu Part</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <SPKTable
            data={data}
            isLoading={isLoading}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
