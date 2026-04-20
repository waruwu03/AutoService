"use client"

import { useState } from "react"
import { Plus, Search, Filter, Wrench, Star, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock Data
const mechanicsData = [
  { id: 1, name: "Andi Wijaya", status: "Aktif", spkTotal: 145, rating: 4.8, avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Rudi Santoso", status: "Aktif", spkTotal: 120, rating: 4.5, avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Doni Pratama", status: "Tidak Aktif", spkTotal: 85, rating: 4.2, avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Bagus Setiawan", status: "Aktif", spkTotal: 98, rating: 4.6, avatar: "https://i.pravatar.cc/150?u=4" },
]

export default function MechanicsPage() {
  const [search, setSearch] = useState("")

  return (
    <>
      <AdminHeader title="Manajemen Mekanik" description="Kelola tim mekanik dan pantau performa mereka." />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard title="Total Mekanik Aktif" value="3" icon={Wrench} />
          <StatsCard title="Rata-rata Rating" value="4.5" icon={Star} />
          <StatsCard title="SPK Selesai (Bulan Ini)" value="84" icon={Wrench} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input 
                placeholder="Cari mekanik..." 
                className="pl-9 bg-white" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white">
              <Filter className="size-4 mr-2" /> Filter
            </Button>
          </div>
          <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 w-full sm:w-auto font-bold shadow-sm">
            <Plus className="size-4 mr-2 stroke-[3px]" /> Tambah Mekanik Baru
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead>Nama Mekanik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Total SPK</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mechanicsData.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map((mekanik, i) => (
                  <TableRow key={mekanik.id}>
                    <TableCell className="text-center font-medium">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={mekanik.avatar} />
                          <AvatarFallback>{mekanik.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{mekanik.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={mekanik.status === "Aktif" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none" : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-none shadow-none"}>
                        {mekanik.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-700">{mekanik.spkTotal}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="size-4 fill-[#FFC107] text-[#FFC107]" />
                        <span className="font-bold text-slate-800">{mekanik.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer font-medium text-slate-600"><Eye className="size-4 mr-2" /> Detail</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-medium text-amber-600"><Edit className="size-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-medium text-red-600 focus:text-red-600"><Trash2 className="size-4 mr-2" /> Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
