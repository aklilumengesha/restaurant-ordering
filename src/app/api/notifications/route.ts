import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const rows = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return NextResponse.json(rows)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const { id, read } = await req.json()
  if (!id) return new NextResponse('Bad Request', { status: 400 })
  const updated = await prisma.notification.update({ where: { id }, data: { read: !!read } })
  return NextResponse.json(updated)
}
