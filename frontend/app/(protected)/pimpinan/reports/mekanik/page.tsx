"use client"

import { Star, Users, TrendingUp, Clock, Award, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

const mechanicData = [
  { name: "Andi Susanto", avatar: "AS", spkCompleted: 48, avgTime: 85, rating: 4.9, efficiency: 98, specialty: "Mesin & AC" },
  { name: "Beni Kurniawan", avatar: "BK", spkCompleted: 42, avgTime: 95, rating: 4.7, efficiency: 92, specialty: "Kelistrikan" },
  { name: "Cahyo Wibowo", avatar: "CW", spkCompleted: 39, avgTime: 90, rating: 4.8, efficiency: 95, specialty: "Transmisi" },
  { name: "Dedi Prasetyo", avatar: "DP", spkCompleted: 35, avgTime: 100, rating: 4.6, efficiency: 88, specialty: "Body & Cat" },
  { name: "Eko Saputra", avatar: "ES", spkCompleted: 28, avgTime: 110, rating: 4.5, efficiency: 82, specialty: "Rem & Suspensi" },
]

export default function MekanikReportPage() {
  return (
    <>
      <PimpinanHeader title="Laporan Mekanik" description="Performa dan produktivitas mekanik" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Mekanik</h1>
          <p className="text-muted-foreground mt-1">Performa dan produktivitas mekanik</p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600" /></div>
                <div><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Total Mekanik</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
                <div><p className="text-2xl font-bold">192</p><p className="text-xs text-muted-foreground">SPK Selesai</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center"><Star className="h-5 w-5 text-yellow-600 fill-yellow-600" /></div>
                <div><p className="text-2xl font-bold">4.7</p><p className="text-xs text-muted-foreground">Rating Rata-rata</p></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
                <div><p className="text-2xl font-bold">91%</p><p className="text-xs text-muted-foreground">Efisiensi Rata-rata</p></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mechanic Cards */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Detail Performa Mekanik</h3>
          {mechanicData.map((mechanic, index) => (
            <Card key={mechanic.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-amber-100 text-amber-700" : index === 1 ? "bg-slate-100 text-slate-700" : index === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}>
                      {index + 1}
                    </div>
                    <Avatar className="size-12">
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
          ))}
        </div>
      </div>
    </>
  )
}
