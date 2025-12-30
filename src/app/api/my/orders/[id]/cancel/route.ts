import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id } })
  if (!order) return new NextResponse('Not found', { status: 404 })
  if (order.status !== 'PENDING') return new NextResponse('Cannot cancel', { status: 400 })

  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELED' } })
  return NextResponse.json(updated)
}
