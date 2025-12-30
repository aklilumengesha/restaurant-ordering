import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}
