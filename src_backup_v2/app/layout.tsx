import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KampanyeOS — Platform Kampanye Digital',
  description: 'One Source of Truth. Satu platform, satu komando, satu instruksi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
