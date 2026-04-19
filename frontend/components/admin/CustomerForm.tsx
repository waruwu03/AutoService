'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Customer, CustomerFormData } from '@/types'

const customerSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  telepon: z.string().min(1, 'Telepon wajib diisi').max(20, 'Telepon maksimal 20 karakter'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  nik: z.string().length(16, 'NIK harus 16 digit').optional().or(z.literal('')),
  tipe: z.enum(['individu', 'perusahaan']),
  nama_perusahaan: z.string().optional(),
  npwp: z.string().optional(),
}).refine((data) => {
  if (data.tipe === 'perusahaan' && !data.nama_perusahaan) {
    return false
  }
  return true
}, {
  message: 'Nama perusahaan wajib diisi untuk tipe perusahaan',
  path: ['nama_perusahaan'],
})

interface CustomerFormProps {
  initialData?: Customer
  onSubmit: (data: CustomerFormData) => Promise<void>
  isSubmitting?: boolean
}

export function CustomerForm({ initialData, onSubmit, isSubmitting }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      alamat: initialData?.alamat || '',
      telepon: initialData?.telepon || '',
      email: initialData?.email || '',
      nik: initialData?.nik || '',
      tipe: initialData?.tipe || 'individu',
      nama_perusahaan: initialData?.nama_perusahaan || '',
      npwp: initialData?.npwp || '',
    },
  })

  const tipe = watch('tipe')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informasi Dasar */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>Data identitas pelanggan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="tipe">Tipe Pelanggan</FieldLabel>
                <Select
                  value={tipe}
                  onValueChange={(value: 'individu' | 'perusahaan') => setValue('tipe', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individu">Individu</SelectItem>
                    <SelectItem value="perusahaan">Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipe && <FieldError>{errors.tipe.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="nama">Nama {tipe === 'perusahaan' ? 'PIC' : 'Lengkap'}</FieldLabel>
                <Input
                  id="nama"
                  placeholder={tipe === 'perusahaan' ? 'Nama PIC/Contact Person' : 'Nama lengkap pelanggan'}
                  {...register('nama')}
                />
                {errors.nama && <FieldError>{errors.nama.message}</FieldError>}
              </Field>

              {tipe === 'perusahaan' && (
                <Field>
                  <FieldLabel htmlFor="nama_perusahaan">Nama Perusahaan</FieldLabel>
                  <Input
                    id="nama_perusahaan"
                    placeholder="Nama perusahaan"
                    {...register('nama_perusahaan')}
                  />
                  {errors.nama_perusahaan && (
                    <FieldError>{errors.nama_perusahaan.message}</FieldError>
                  )}
                </Field>
              )}

              {tipe === 'individu' ? (
                <Field>
                  <FieldLabel htmlFor="nik">NIK (opsional)</FieldLabel>
                  <Input
                    id="nik"
                    placeholder="Nomor Induk Kependudukan"
                    maxLength={16}
                    {...register('nik')}
                  />
                  {errors.nik && <FieldError>{errors.nik.message}</FieldError>}
                </Field>
              ) : (
                <Field>
                  <FieldLabel htmlFor="npwp">NPWP (opsional)</FieldLabel>
                  <Input
                    id="npwp"
                    placeholder="Nomor NPWP Perusahaan"
                    {...register('npwp')}
                  />
                  {errors.npwp && <FieldError>{errors.npwp.message}</FieldError>}
                </Field>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Kontak */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
            <CardDescription>Nomor telepon dan alamat pelanggan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="telepon">Nomor Telepon</FieldLabel>
                <Input
                  id="telepon"
                  type="tel"
                  placeholder="08xx-xxxx-xxxx"
                  {...register('telepon')}
                />
                {errors.telepon && <FieldError>{errors.telepon.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email (opsional)</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
                <Textarea
                  id="alamat"
                  placeholder="Alamat lengkap pelanggan"
                  rows={4}
                  {...register('alamat')}
                />
                {errors.alamat && <FieldError>{errors.alamat.message}</FieldError>}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </div>
    </form>
  )
}
