import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'signalss',
  description: 'Get personalized AI updates across startups, tech, research, business, and more — summarized daily so you stay ahead.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'signalss',
    description: 'AI updates that never sleep. Stay ahead without reading everything.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
