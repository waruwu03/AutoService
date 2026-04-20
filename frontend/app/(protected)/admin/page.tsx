"use client"

import {
  ClipboardList,
  Wrench,
  CheckCircle,
  Pencil,
  ChevronRight,
  AlertTriangle,
  CalendarClock,
  Receipt,
  Calendar,
  Users,
  Package,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const chartData = [
  { date: "14/05", value: 5000000 },
  { date: "15/05", value: 8000000 },
  { date: "16/05", value: 14000000 },
  { date: "17/05", value: 11000000 },
  { date: "18/05", value: 15500000 },
  { date: "19/05", value: 18000000 },
  { date: "20/05", value: 23000000 },
]

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader title="Dashboard" description="Ringkasan aktivitas bengkel" />

      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Order Servis"
              value="28"
              trend={{ value: 16, isPositive: true }}
              icon={ClipboardList}
            />
            <StatsCard
              title="Pendapatan Hari Ini"
              value="Rp 12.450.000"
              trend={{ value: 10, isPositive: true }}
              icon={Receipt}
            />
            <StatsCard
              title="Order Dalam Proses"
              value="12"
              description="Lihat detail"
              icon={Wrench}
            />
            <StatsCard
              title="Order Selesai"
              value="16"
              description="Lihat detail"
              icon={CheckCircle}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            
            {/* Main Content (Left, takes 3 columns on large screens) */}
            <div className="xl:col-span-3 space-y-6">
              
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Servis Terbaru */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Order Servis Terbaru</CardTitle>
                <Link href="#" className="flex text-sm text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-900">No. Order</TableHead>
                        <TableHead className="font-semibold text-slate-900">Pelanggan</TableHead>
                        <TableHead className="font-semibold text-slate-900">Kendaraan</TableHead>
                        <TableHead className="font-semibold text-slate-900">Jenis Servis</TableHead>
                        <TableHead className="font-semibold text-slate-900">Mekanik</TableHead>
                        <TableHead className="font-semibold text-slate-900">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-slate-700">#SRV-240520-001</TableCell>
                        <TableCell>Budi Santoso</TableCell>
                        <TableCell>Honda Brio 2020</TableCell>
                        <TableCell>Ganti Oli</TableCell>
                        <TableCell>Andi</TableCell>
                        <TableCell><Badge className="bg-amber-400 hover:bg-amber-500 text-slate-900 border-none shadow-none font-medium">Dalam Proses</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-slate-700">#SRV-240520-002</TableCell>
                        <TableCell>Dewi Lestari</TableCell>
                        <TableCell>Yamaha NMAX 2021</TableCell>
                        <TableCell>Servis CVT</TableCell>
                        <TableCell>Rudi</TableCell>
                        <TableCell><Badge className="bg-amber-400 hover:bg-amber-500 text-slate-900 border-none shadow-none font-medium">Dalam Proses</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-slate-700">#SRV-240520-003</TableCell>
                        <TableCell>Arif Setiawan</TableCell>
                        <TableCell>Toyota Avanza 2018</TableCell>
                        <TableCell>Tune Up</TableCell>
                        <TableCell>Andi</TableCell>
                        <TableCell><Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-none font-medium">Selesai</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-slate-700">#SRV-240520-004</TableCell>
                        <TableCell>Fajar Nugroho</TableCell>
                        <TableCell>Honda Vario 2019</TableCell>
                        <TableCell>Ganti Oli</TableCell>
                        <TableCell>Rudi</TableCell>
                        <TableCell><Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-none font-medium">Selesai</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-slate-700">#SRV-240520-005</TableCell>
                        <TableCell>Siti Aminah</TableCell>
                        <TableCell>Yamaha Aerox 2022</TableCell>
                        <TableCell>Ganti Ban</TableCell>
                        <TableCell>Doni</TableCell>
                        <TableCell><Badge className="bg-slate-200 hover:bg-slate-300 text-slate-700 border-none shadow-none font-medium">Menunggu</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" className="w-full mt-4 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-600 border-dashed">
                  + Order Baru
                </Button>
              </CardContent>
            </Card>

            {/* Grafik Pendapatan */}
            <Card className="shadow-sm border-slate-200 flex flex-col items-center relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 w-full">
                <CardTitle className="text-lg">Grafik Pendapatan</CardTitle>
                <div className="text-sm border rounded-md px-2 py-1 text-slate-600 bg-white">7 Hari Terakhir ⌄</div>
              </CardHeader>
              <CardContent className="w-full flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-slate-500">Total Pendapatan</p>
                  <h3 className="text-2xl font-bold">Rp 78.650.000</h3>
                  <p className="text-xs font-semibold text-emerald-500 mt-1">+12% <span className="text-slate-400 font-normal">dari periode sebelumnya</span></p>
                </div>
                <div className="flex-1 w-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} tickFormatter={(val) => `${val / 1000000}M`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                      />
                      <Line type="monotone" dataKey="value" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4, fill: "#FBBF24", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              {/* Optional background gradient effect as shown in design */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-100/30 to-transparent pointer-events-none"></div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stok Barang */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Stok Barang</CardTitle>
                <Link href="#" className="flex text-sm text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-900">Nama Barang</TableHead>
                      <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
                      <TableHead className="font-semibold text-slate-900 text-center">Stok</TableHead>
                      <TableHead className="font-semibold text-slate-900">Satuan</TableHead>
                      <TableHead className="font-semibold text-slate-900 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-slate-700">Oli Mesin Shell AX7</TableCell>
                      <TableCell>Oli</TableCell>
                      <TableCell className="text-center font-bold">12</TableCell>
                      <TableCell>Botol</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="size-3 text-slate-500" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-slate-700">Oli Mesin Castrol Matic</TableCell>
                      <TableCell>Oli</TableCell>
                      <TableCell className="text-center font-bold">8</TableCell>
                      <TableCell>Botol</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="size-3 text-slate-500" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-slate-700">Filter Oli Honda</TableCell>
                      <TableCell>Sparepart</TableCell>
                      <TableCell className="text-center font-bold">15</TableCell>
                      <TableCell>Pcs</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="size-3 text-slate-500" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-slate-700">Busi NGK CPR7EA-9</TableCell>
                      <TableCell>Sparepart</TableCell>
                      <TableCell className="text-center font-bold">20</TableCell>
                      <TableCell>Pcs</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="size-3 text-slate-500" /></Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-slate-700">Kampas Rem Depan</TableCell>
                      <TableCell>Sparepart</TableCell>
                      <TableCell className="text-center font-bold">7</TableCell>
                      <TableCell>Set</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="size-3 text-slate-500" /></Button></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Aktivitas Mekanik */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Aktivitas Mekanik</CardTitle>
                <Link href="#" className="flex text-sm text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col h-full space-y-5 pt-3">
                
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Andi</p>
                    <p className="text-xs text-amber-500 font-medium">Sedang mengerjakan</p>
                    <p className="text-xs text-slate-500 truncate">#SRV-240520-001 • Honda Brio 2020</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">00:45</p>
                    <p className="text-xs text-slate-500">Durasi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                    <AvatarFallback>RU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Rudi</p>
                    <p className="text-xs text-amber-500 font-medium">Sedang mengerjakan</p>
                    <p className="text-xs text-slate-500 truncate">#SRV-240520-002 • Yamaha NMAX 2021</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">01:10</p>
                    <p className="text-xs text-slate-500">Durasi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=3" />
                    <AvatarFallback>DN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Doni</p>
                    <p className="text-xs text-amber-500 font-medium">Sedang mengerjakan</p>
                    <p className="text-xs text-slate-500 truncate">#SRV-240520-005 • Yamaha Aerox 2022</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">00:30</p>
                    <p className="text-xs text-slate-500">Durasi</p>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full text-amber-500 border-amber-200">
                    Lihat Semua Mekanik
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pengingat */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Pengingat</CardTitle>
                <Link href="#" className="flex text-sm text-blue-600 hover:underline">
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                <div className="flex items-center gap-4 bg-white p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-500 shrink-0">
                    <AlertTriangle className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Stok Oli Mesin Shell AX7</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tersisa 12 Botol</p>
                  </div>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500 shrink-0">
                    <CalendarClock className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Jadwal Servis Berkala</p>
                    <p className="text-xs text-slate-500 mt-0.5">5 kendaraan perlu servis berkala</p>
                  </div>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                    <Receipt className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900">Pembayaran Tertunda</p>
                    <p className="text-xs text-slate-500 mt-0.5">3 order belum lunas</p>
                  </div>
                  <ChevronRight className="size-5 text-slate-300" />
                </div>
              </CardContent>
            </Card>

              </div>
            </div>

            {/* Right Column Content */}
            <div className="space-y-6">
              
              {/* Menu Cepat */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg">Menu Cepat</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <ClipboardList className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Order Servis</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <Calendar className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Jadwal</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <Users className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Pelanggan</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <Package className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Stok Barang</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <Receipt className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Pembayaran</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer text-center group">
                      <div className="bg-slate-900 rounded-lg p-2 text-[#FFC107] mb-2 group-hover:scale-110 transition-transform">
                        <BarChart3 className="size-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">Laporan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ringkasan Hari Ini */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
                  <CardTitle className="text-lg">Ringkasan Hari Ini</CardTitle>
                  <Link href="#" className="flex text-[11px] text-blue-600 hover:underline font-medium">
                    Lihat Detail
                  </Link>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <h4 className="text-xl font-bold">28</h4>
                      <p className="text-[11px] text-slate-500">Total Order</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">12</h4>
                      <p className="text-[11px] text-slate-500">Dalam Proses</p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">16</h4>
                      <p className="text-[11px] text-slate-500">Selesai</p>
                    </div>
                    <div>
                      <h4 className="text-[17px] font-bold">Rp 12.450.000</h4>
                      <p className="text-[11px] text-slate-500">Pendapatan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Terbaru (Side Panel) */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
                  <CardTitle className="text-lg">Order Terbaru</CardTitle>
                  <Link href="#" className="flex text-[11px] text-blue-600 hover:underline font-medium">
                    Lihat Semua
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">#SRV-240520-001</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Budi Santoso</p>
                      <p className="text-[11px] text-slate-500">Honda Brio 2020</p>
                    </div>
                    <Badge className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-slate-900 border-none shadow-none text-[10px] px-2 py-0">Dalam Proses</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">#SRV-240520-002</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Dewi Lestari</p>
                      <p className="text-[11px] text-slate-500">Yamaha NMAX 2021</p>
                    </div>
                    <Badge className="bg-[#FFC107] hover:bg-[#FFC107]/90 text-slate-900 border-none shadow-none text-[10px] px-2 py-0">Dalam Proses</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">#SRV-240520-003</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Arif Setiawan</p>
                      <p className="text-[11px] text-slate-500">Toyota Avanza 2018</p>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-none text-[10px] px-2 py-0">Selesai</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">#SRV-240520-004</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Fajar Nugroho</p>
                      <p className="text-[11px] text-slate-500">Honda Vario 2019</p>
                    </div>
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-none text-[10px] px-2 py-0">Selesai</Badge>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </div>
    </>
  )
}
