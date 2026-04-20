"use client"

import Link from "next/link"
import { BarChart3, CheckSquare, TrendingUp, Settings, FileText, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

const quickLinks = [
  {
    title: "Dashboard Analytics",
    description: "Lihat performa bengkel secara detail",
    icon: TrendingUp,
    href: "/pimpinan/dashboard",
    color: "bg-blue-500",
  },
  {
    title: "Approval Quotation",
    description: "Kelola persetujuan SPK",
    icon: CheckSquare,
    href: "/pimpinan/approvals",
    color: "bg-emerald-500",
  },
  {
    title: "Laporan",
    description: "Laporan inventory, mekanik, pendapatan",
    icon: BarChart3,
    href: "/pimpinan/reports",
    color: "bg-purple-500",
  },
  {
    title: "Pengaturan",
    description: "Konfigurasi sistem bengkel",
    icon: Settings,
    href: "/pimpinan/settings",
    color: "bg-amber-500",
  },
]

export default function PimpinanPage() {
  return (
    <>
      <PimpinanHeader title="Dashboard Pimpinan" description="Selamat datang, Kepala Bengkel" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
          <CardContent className="pt-6">
            <p className="text-white/70 text-sm">Selamat Datang,</p>
            <h2 className="text-2xl font-bold mt-1">Kepala Bengkel</h2>
            <p className="text-white/60 text-sm mt-2">Kelola bengkel Anda dengan mudah melalui dashboard ini</p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Menu Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                  <CardContent className="pt-6 pb-6 flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl ${link.color} flex items-center justify-center shrink-0`}>
                      <link.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-3xl font-bold text-blue-600">Rp 125M</p>
              <p className="text-xs text-muted-foreground mt-1">Pendapatan Bulan Ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">45</p>
              <p className="text-xs text-muted-foreground mt-1">SPK Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-3xl font-bold text-amber-600">5</p>
              <p className="text-xs text-muted-foreground mt-1">Menunggu Approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-3xl font-bold text-purple-600">4.8</p>
              <p className="text-xs text-muted-foreground mt-1">Rating Bengkel</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
