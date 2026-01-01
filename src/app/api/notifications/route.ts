import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) return new NextResponse('Forbidden', { status: 403 })
  const rows = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) return new NextResponse('Forbidden', { status: 403 })
  const { type, title, message, severity = 'info' } = await req.json()
  if (!title) return new NextResponse('Title required', { status: 400 })
  const notification = await prisma.notification.create({
    data: { type: type || 'INTERNAL_NOTE', title, message, severity }
  })
  return NextResponse.json(notification, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) return new NextResponse('Forbidden', { status: 403 })
  const { id, read } = await req.json()
  if (!id) return new NextResponse('Bad Request', { status: 400 })
  const updated = await prisma.notification.update({ where: { id }, data: { read: !!read } })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'STAFF'].includes((session.user as any)?.role)) return new NextResponse('Forbidden', { status: 403 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    await prisma.notification.delete({ where: { id } })
  }
  return new NextResponse(null, { status: 204 })
}
