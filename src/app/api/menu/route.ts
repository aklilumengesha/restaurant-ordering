import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const MenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['APPETIZERS', 'MAINS', 'DESSERTS', 'DRINKS']),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

export async function GET() {
  const items = await prisma.menuItem.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role === 'CUSTOMER') return new NextResponse('Forbidden', { status: 403 })
  const json = await req.json()
  // Handle empty imageUrl
  if (json.imageUrl === '') delete json.imageUrl
  const parsed = MenuItemSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 })
  const data = { ...parsed.data }
  if (!data.imageUrl) delete data.imageUrl
  const created = await prisma.menuItem.create({ data })
  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role === 'CUSTOMER') return new NextResponse('Forbidden', { status: 403 })
  const json = await req.json()
  const { id, ...rest } = json
  // Handle empty imageUrl
  if (rest.imageUrl === '') rest.imageUrl = null
  const parsed = MenuItemSchema.partial().safeParse(rest)
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 })
  const updated = await prisma.menuItem.update({ where: { id }, data: parsed.data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role === 'CUSTOMER') return new NextResponse('Forbidden', { status: 403 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return new NextResponse('Missing id', { status: 400 })
  await prisma.menuItem.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
