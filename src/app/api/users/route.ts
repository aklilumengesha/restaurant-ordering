import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const roleParam = searchParams.get('role')
  
  const where: any = {}
  if (roleParam) {
    const roles = roleParam.split(',').map(r => r.trim())
    where.role = { in: roles }
  }
  
  const users = await prisma.user.findMany({ 
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
  })
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
