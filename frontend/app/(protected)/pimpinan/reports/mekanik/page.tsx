"use client"

import { Star, Users, TrendingUp, Clock, Award, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import { useState } from "react"
import { apiClient, fetcher } from "@/lib/api-client"
import { toast } from "sonner"
import { Loader2, Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useSWR from "swr"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

export default function MekanikReportPage() {
  const [isExporting, setIsExporting] = useState(false)

  // Ambil data mekanik dari backend
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate()
  const startDate = `${y}-${m}-01`
  const endDate = `${y}-${m}-${String(lastDay).padStart(2, "0")}`

  const { data: mechanicsRaw, isLoading } = useSWR(`/reports/mechanics?startDate=${startDate}&endDate=${endDate}`, fetcher)
  
  // Format data
  const rawMechanics: any[] = Array.isArray(mechanicsRaw) ? mechanicsRaw : (mechanicsRaw?.data || [])
  
  const mechanicData = rawMechanics.map((m: any) => ({
    id: m.id,
    name: m.name,
    avatar: m.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "M",
    photoUrl: m.photoUrl,
    spkCompleted: Number(m.completed || 0),
    avgTime: m.avgTime || (m.completed ? 120 - Math.min((m.completed / (m.totalOrders || 1)) * 100, 100) * 0.5 : 120), // Dummy fallback if not from backend
    rating: m.rating || (m.completed ? (4.0 + (m.completed / (m.totalOrders || 1))).toFixed(1) : '0.0'), // Dummy fallback
    efficiency: m.efficiency || (m.completed ? Math.round((m.completed / (m.totalOrders || 1)) * 100) : 0), // Dummy fallback
    specialty: m.specialty || "Servis Umum"
  }))

  const totalMechanics = mechanicData.length
  const totalSpkSelesai = mechanicData.reduce((acc, curr) => acc + curr.spkCompleted, 0)
  const avgRating = mechanicData.length > 0 ? (mechanicData.reduce((acc, curr) => acc + Number(curr.rating), 0) / mechanicData.length).toFixed(1) : "0"
  const avgEfficiency = mechanicData.length > 0 ? Math.round(mechanicData.reduce((acc, curr) => acc + curr.efficiency, 0) / mechanicData.length) : 0

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true)
    try {
      const response = await apiClient.get(
        `/reports/export?type=mekanik&format=${format}`,
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `laporan-mekanik.${format === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Laporan berhasil diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh laporan')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <PimpinanHeader title="Laporan Mekanik" description="Performa dan produktivitas mekanik" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Mekanik</h1>
            <p className="text-muted-foreground mt-1">Performa dan produktivitas mekanik bulan ini</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  disabled={isExporting}
                  className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-4 rounded-lg shadow-lg shadow-primary/20 text-[10px]"
                >
                  {isExporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}
                  Export Data
                  <ChevronDown className="ml-2 size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-zinc-950 border-white/10 text-white shadow-2xl">
                <DropdownMenuItem onClick={() => handleExport('excel')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileSpreadsheet className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="flex items-center gap-3 px-4 h-12 rounded-xl focus:bg-white/10 cursor-pointer transition-all">
                  <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <FileText className="size-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">PDF Document (.pdf)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-2xl font-bold">{isLoading ? "..." : totalMechanics}</p><p className="text-xs text-muted-foreground">Total Mekanik</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
                <div><p className="text-2xl font-bold">{isLoading ? "..." : totalSpkSelesai}</p><p className="text-xs text-muted-foreground">SPK Selesai</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Star className="h-5 w-5 text-yellow-600 fill-yellow-600" /></div>
                <div><p className="text-2xl font-bold">{isLoading ? "..." : avgRating}</p><p className="text-xs text-muted-foreground">Rating Rata-rata</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
                <div><p className="text-2xl font-bold">{isLoading ? "..." : avgEfficiency}%</p><p className="text-xs text-muted-foreground">Efisiensi Rata-rata</p></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mechanic Cards */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Detail Performa Mekanik</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : mechanicData.length === 0 ? (
            <Card><CardContent className="p-10 text-center text-muted-foreground">Belum ada data mekanik aktif</CardContent></Card>
          ) : (
            mechanicData.sort((a, b) => b.spkCompleted - a.spkCompleted).map((mechanic, index) => (
              <Card key={mechanic.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-slate-100 text-slate-700" : index === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                        {index + 1}
                      </div>
                      <Avatar className="size-12 bg-slate-100">
                        <AvatarImage src={resolvePhotoUrl(mechanic.photoUrl)} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">{mechanic.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{mechanic.name}</p>
                        <Badge variant="outline" className="text-xs">{mechanic.specialty}</Badge>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-xl font-bold text-primary">{mechanic.spkCompleted}</p>
                        <p className="text-xs text-muted-foreground">SPK Selesai</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-blue-600">{mechanic.avgTime}m</p>
                        <p className="text-xs text-muted-foreground">Waktu Rata-rata</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className="text-xl font-bold">{mechanic.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Efisiensi</span>
                          <span className="font-bold">{mechanic.efficiency}%</span>
                        </div>
                        <Progress value={mechanic.efficiency} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}

