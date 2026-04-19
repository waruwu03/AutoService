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
import { VehicleTable } from '@/components/admin/VehicleTable'
import { Pagination } from '@/components/shared/Pagination'
import { useApiPaginated, useApiMutation, invalidateCache } from '@/hooks/useApi'
import type { Vehicle } from '@/types'

export default function VehiclesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [transmisi, setTransmisi] = useState<string>('all')
  
  const { data, meta, isLoading } = useApiPaginated<Vehicle>(
    '/vehicles',
    page,
    10,
    { 
      search: search || undefined,
      transmisi: transmisi !== 'all' ? transmisi : undefined,
    }
  )

  const { delete: deleteVehicle, isLoading: isDeleting } = useApiMutation()

  const handleDelete = async (id: number) => {
    await deleteVehicle(`/vehicles/${id}`, {
      onSuccess: () => {
        toast.success('Kendaraan berhasil dihapus')
        invalidateCache('/vehicles')
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
          <h2 className="text-2xl font-bold tracking-tight">Kendaraan</h2>
          <p className="text-muted-foreground">
            Kelola data kendaraan pelanggan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/vehicles/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kendaraan
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kendaraan</CardTitle>
          <CardDescription>
            Total {meta?.total || 0} kendaraan terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nomor polisi, merk, model..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={transmisi}
              onValueChange={(value) => {
                setTransmisi(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Semua Transmisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Transmisi</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <VehicleTable
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
