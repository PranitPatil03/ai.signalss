import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Daily Updates - Personalized AI Intelligence Briefing',
  description: 'Get personalized AI updates across startups, tech, research, business, and more — summarized daily so you stay ahead.',
  openGraph: {
    title: 'AI Daily Updates',
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
      <body className="min-h-screen bg-surface text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
