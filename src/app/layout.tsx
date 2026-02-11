import './globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { ConditionalFooter } from '@/components/conditional-footer'
import { ChatWidget } from '@/components/chat-widget'

export const metadata = {
  title: 'RestoNext | Modern Restaurant Experience',
  description: 'Order delicious food online, make reservations, and enjoy a seamless dining experience',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <ConditionalFooter />
              <ChatWidget />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
