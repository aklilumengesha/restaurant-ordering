"use client"
import { ReactNode, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </SessionProvider>
  )
}
