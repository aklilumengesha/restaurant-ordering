'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './footer'
import { GetInTouch } from './get-in-touch'

export function ConditionalFooter() {
  const pathname = usePathname()
  const hideFooter = pathname === '/profile' || pathname?.startsWith('/staff')
  
  if (hideFooter) return null
  
  return (
    <>
      <GetInTouch />
      <Footer />
    </>
  )
}
