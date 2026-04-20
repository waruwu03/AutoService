"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Filter, ChevronLeft, ChevronRight, UserCircle, Car, Wrench } from "lucide-react"

const scheduleData = [
  { id: "SPK-001", time: "09:00", customer: "Budi Santoso", vehicle: "Honda Brio 2020", mechanic: "Andi Wijaya", status: "On Progress" },
  { id: "SPK-002", time: "10:30", customer: "Dewi Lestari", vehicle: "Yamaha NMAX 2021", mechanic: "Rudi Santoso", status: "Done" },
  { id: "SPK-003", time: "13:00", customer: "Arif Setiawan", vehicle: "Toyota Avanza 2018", mechanic: "Doni Pratama", status: "Waiting Parts" },
  { id: "SPK-004", time: "15:00", customer: "Fajar Nugroho", vehicle: "Honda Vario 2019", mechanic: "Bagus Setiawan", status: "Draft" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "On Progress": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none shadow-none font-semibold">On Progress</Badge>;
    case "Done": return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none font-semibold">Done</Badge>;
    case "Waiting Parts": return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none shadow-none font-semibold">Waiting Parts</Badge>;
    default: return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none shadow-none font-semibold">Draft</Badge>;
  }
}

export default function SchedulePage() {
  return (
    <>
      <AdminHeader title="Jadwal Servis" description="Pantau jadwal Surat Perintah Kerja (SPK) bengkel." />
      <div className="p-6 space-y-6">
        
        {/* Toolbar & Date Navigation */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white"><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" className="bg-white w-[200px] justify-start font-medium text-left">
              <CalendarIcon className="size-4 mr-2 text-slate-500" />
              24 Mei 2024
            </Button>
            <Button variant="outline" size="icon" className="bg-white"><ChevronRight className="size-4" /></Button>
            <Button variant="ghost" className="text-[#FFC107] font-bold hover:bg-[#FFC107]/10 bg-slate-900 border border-slate-900 ml-2">Hari Ini</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white"><Filter className="size-4 mr-2" /> Filter Mekanik</Button>
            <Button variant="outline" className="bg-white"><Filter className="size-4 mr-2" /> Filter Status</Button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4">
            <div className="font-bold text-slate-500 text-sm pl-2">Waktu</div>
            <div className="font-bold text-slate-500 text-sm">Target Pengerjaan SPK</div>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scheduleData.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] p-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="text-base font-extrabold text-slate-700 dark:text-slate-300 pt-3 pl-2">{item.time}</div>
                <div>
                  <Card className="shadow-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{item.id}</span>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                            <span className="flex items-center gap-1.5"><UserCircle className="size-4 text-slate-400" /> {item.customer}</span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5"><Car className="size-4 text-slate-400" /> {item.vehicle}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/50 mt-2 sm:mt-0 shadow-sm">
                          <div className="bg-[#FFC107] text-slate-900 p-1.5 rounded-md shadow-sm">
                            <Wrench className="size-4" />
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-amber-100 tracking-wide">{item.mechanic}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
