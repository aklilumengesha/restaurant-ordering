import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const allowed: any = {}
  if (typeof body.assignedToId !== 'undefined') allowed.assignedToId = body.assignedToId
  if (typeof body.startTime !== 'undefined') allowed.startTime = new Date(body.startTime)
  if (typeof body.endTime !== 'undefined') allowed.endTime = new Date(body.endTime)
  if (typeof body.notes !== 'undefined') allowed.notes = body.notes
  const updated = await prisma.reservation.update({ where: { id: params.id }, data: allowed })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.reservation.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
