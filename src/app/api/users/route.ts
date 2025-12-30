import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(users)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const json = await req.json()
  const { id, role, isActive } = json
  if (!id) return new NextResponse('Missing id', { status: 400 })
  const data: any = {}
  if (role) data.role = role
  if (typeof isActive === 'boolean') data.isActive = isActive
  const updated = await prisma.user.update({ where: { id }, data })
  return NextResponse.json(updated)
}
