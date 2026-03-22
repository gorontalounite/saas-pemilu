import type { Metadata } from 'next'
import './globals.css'
import { TenantProvider } from '@/contexts/TenantContext'

export const metadata: Metadata = {
  title: 'KampanyeOS',
  description: 'One Source of Truth. Satu platform, satu komando, satu instruksi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  )
}