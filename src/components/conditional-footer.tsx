'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './footer'
import { GetInTouch } from './get-in-touch'

export function ConditionalFooter() {
  const pathname = usePathname()
  const hideFooter = pathname === '/profile'
  
  if (hideFooter) return null
  
  return (
    <>
      <GetInTouch />
      <Footer />
    </>
  )
}
