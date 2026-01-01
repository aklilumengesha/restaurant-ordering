import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Returns all menu items including inactive ones (for staff/admin)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  const items = await prisma.menuItem.findMany({ 
    orderBy: [{ category: 'asc' }, { name: 'asc' }] 
  })
  return NextResponse.json(items)
}
