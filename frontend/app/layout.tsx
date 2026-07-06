import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { RootThemeProvider } from '@/components/root-theme-provider'
import { SocketProvider } from '@/context/SocketContext'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'AutoService System',
    template: '%s | AutoService',
  },
  description: 'Sistem Manajemen Bengkel Mobil - Kelola SPK, Invoice, Sparepart, dan Laporan',
  keywords: ['bengkel', 'servis mobil', 'spk', 'invoice', 'sparepart', 'manajemen bengkel'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

import { UIProvider } from '@/context/UIContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background" suppressHydrationWarning>
          <AuthProvider>
            <UIProvider>
              <SocketProvider>
                <RootThemeProvider>
                  {children}
                  <Toaster position="top-right" richColors closeButton />
                </RootThemeProvider>
              </SocketProvider>
            </UIProvider>
          </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
