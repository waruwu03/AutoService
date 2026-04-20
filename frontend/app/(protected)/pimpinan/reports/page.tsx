"use client"

import Link from "next/link"
import { Package, Users, TrendingUp, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

const reportLinks = [
  {
    title: "Laporan Inventory",
    description: "Monitor stok dan pergerakan barang",
    icon: Package,
    href: "/pimpinan/reports/inventory",
    color: "bg-blue-500",
  },
  {
    title: "Laporan Mekanik",
    description: "Performa dan produktivitas mekanik",
    icon: Users,
    href: "/pimpinan/reports/mekanik",
    color: "bg-emerald-500",
  },
  {
    title: "Laporan Pendapatan",
    description: "Analisis pendapatan dan keuangan",
    icon: TrendingUp,
    href: "/pimpinan/reports/pendapatan",
    color: "bg-amber-500",
  },
]

export default function ReportsPage() {
  return (
    <>
      <PimpinanHeader title="Laporan" description="Pilih jenis laporan" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground mt-1">Pilih jenis laporan yang ingin Anda lihat</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reportLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
                  <div className={`h-16 w-16 rounded-2xl ${link.color} flex items-center justify-center`}>
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{link.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    Lihat Laporan <ChevronRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
