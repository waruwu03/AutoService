"use client"

import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Suspense } from "react"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Hasil Pencarian untuk: &quot;{query}&quot;</h2>
        <p className="text-muted-foreground">Tidak ditemukan hasil kecocokan untuk simulasi UI ini.</p>
      </CardContent>
    </Card>
  )
}

export default function SearchPage() {
  return (
    <>
      <AdminHeader title="Cari Data" description="Fasilitas pencarian AutoServis." />
      <div className="p-6">
        <Suspense fallback={<p>Memuat hasil...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </>
  )
}
