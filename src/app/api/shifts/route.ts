import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const MIN_SHIFT_HOURS = 1 // Minimum 1 hour shift

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const rows = await prisma.shift.findMany({ include: { user: true }, orderBy: { startTime: 'asc' } })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const { userId, startTime, endTime, note } = await req.json()
  if (!userId || !startTime || !endTime) return new NextResponse('Bad Request: Missing required fields', { status: 400 })
  
  const start = new Date(startTime)
  const end = new Date(endTime)
  
  // Validate end time is after start time
  if (end <= start) {
    return new NextResponse('Bad Request: End time must be after start time', { status: 400 })
  }
  
  // Validate minimum shift duration (1 hour)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  if (durationHours < MIN_SHIFT_HOURS) {
    return new NextResponse(`Bad Request: Shift must be at least ${MIN_SHIFT_HOURS} hour(s)`, { status: 400 })
  }
  
  const row = await prisma.shift.create({ data: { userId, startTime: start, endTime: end, note } })
  return NextResponse.json(row, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return new NextResponse('Bad Request', { status: 400 })
  await prisma.shift.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
