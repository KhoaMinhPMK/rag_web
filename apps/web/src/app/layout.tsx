import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'RAG Y Tế Nhi Khoa',
  description: 'Hệ thống hỗ trợ chẩn đoán viêm phổi Nhi khoa với RAG có kiểm soát',
  robots: 'noindex, nofollow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
