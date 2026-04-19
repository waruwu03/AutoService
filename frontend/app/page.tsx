'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wrench } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        const routes: Record<string, string> = {
          admin: '/admin',
          kasir: '/admin',
          mekanik: '/mekanik',
          gudang: '/gudang',
          pimpinan: '/pimpinan',
        }
        router.push(routes[user.role] || '/admin')
      } else {
        router.push('/login')
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <Wrench className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">AutoServis System</h1>
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Memuat aplikasi...</p>
    </div>
  )
}
