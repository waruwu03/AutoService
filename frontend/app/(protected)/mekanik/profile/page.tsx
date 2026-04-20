"use client"

import { User, Mail, Phone, Calendar, Star, Award, Settings, LogOut, ChevronRight, Wrench, Clock, CheckCircle2, ShieldCheck, MapPin, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"

const mockProfile = {
  name: "Budi Santoso",
  email: "budi.santoso@autoservis.com",
  phone: "0812-3456-7890",
  employeeId: "MK-001",
  joinDate: new Date("2020-03-15"),
  specialization: ["Mesin", "AC", "Kelistrikan"],
  certifications: [
    { name: "Toyota Certified Technician", year: 2021 },
    { name: "AC System Specialist", year: 2022 },
  ],
  stats: {
    totalJobs: 1250,
    rating: 4.8,
    totalReviews: 320,
    avgCompletionTime: 95,
    completionRate: 98.5,
  },
}

export default function ProfilePage() {
  return (
    <>
      <MekanikHeader title="Profil Saya" description="Informasi personal dan pencapaian profesional Anda" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Main Profile Card */}
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="h-32 bg-slate-900 relative">
              <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="size-32 rounded-3xl bg-white p-2 shadow-xl border border-slate-100">
                  <div className="size-full rounded-2xl bg-amber-500 flex items-center justify-center text-white">
                    <User className="size-16" />
                  </div>
                </div>
                <div className="pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">{mockProfile.name}</h2>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                      Mekanik Level 3
                    </Badge>
                    <span>ID: {mockProfile.employeeId}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="pt-20 pb-8 px-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Kontak</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Mail className="size-4" />
                      </div>
                      {mockProfile.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Phone className="size-4" />
                      </div>
                      {mockProfile.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <MapPin className="size-4" />
                      </div>
                      AutoService Workshop Center
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Spesialisasi</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockProfile.specialization.map((spec) => (
                      <Badge key={spec} className="bg-amber-500 text-slate-900 border-none px-3 py-1 font-bold">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="size-4" /> 
                    <span>Bergabung Sejak {mockProfile.joinDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pencapaian</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-lg font-bold text-slate-900">{mockProfile.stats.totalJobs}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total SPK</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <p className="text-lg font-bold text-amber-600">{mockProfile.stats.rating}</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Certifications Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Sertifikasi Profesional</CardTitle>
                  <CardDescription>Keahlian yang telah terverifikasi</CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Award className="size-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProfile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-amber-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm border border-slate-100">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Berlaku Dari {cert.year}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-600 border-none font-bold">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Analysis Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Analisa Performa</CardTitle>
                  <CardDescription>Data statistik 12 bulan terakhir</CardDescription>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                  <TrendingUp className="size-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600">Kecepatan Pengerjaan</span>
                    <span className="font-bold text-slate-900">{mockProfile.stats.avgCompletionTime} menit</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%]"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600">Kepuasan Pelanggan (CSAT)</span>
                    <span className="font-bold text-slate-900">{(mockProfile.stats.rating * 20).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[96%]"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-600">Tingkat Penyelesaian SPK</span>
                    <span className="font-bold text-slate-900">{mockProfile.stats.completionRate}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.5%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold h-12 rounded-xl">
              <Settings className="size-4 mr-2" />
              Pengaturan Akun
            </Button>
            <Button variant="outline" className="flex-1 border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-12 rounded-xl">
              <LogOut className="size-4 mr-2" />
              Keluar Sesi
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
