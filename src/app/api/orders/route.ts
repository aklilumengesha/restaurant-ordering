import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const CreateOrderSchema = z.object({
  items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().positive() })),
  paymentIntentId: z.string().optional(),
})

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { menuItem: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const json = await req.json()
  const parsed = CreateOrderSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const itemsWithPrice = await Promise.all(
    parsed.data.items.map(async (it) => {
      const mi = await prisma.menuItem.findUnique({ where: { id: it.menuItemId } })
      if (!mi) throw new Error('Invalid item')
      return { ...it, unitPrice: mi.price }
    })
  )

  const total = itemsWithPrice.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0)

  // Auto-assign to available staff (least active open orders)
  const staff = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'STAFF'] } } })
  let assignedToId: string | undefined = undefined
  if (staff.length) {
    const counts = await Promise.all(
      staff.map(async (s) => ({
        id: s.id,
        count: await prisma.order.count({ where: { assignedToId: s.id, status: { in: ['PENDING','PREPARING','READY'] } } }),
      }))
    )
    counts.sort((a, b) => a.count - b.count)
    assignedToId = counts[0]?.id
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        total,
        assignedToId,
        items: {
          create: itemsWithPrice.map((it) => ({ menuItemId: it.menuItemId, quantity: it.quantity, unitPrice: it.unitPrice })),
        },
      },
      include: { items: true },
    })
    // Fire notification
    const { notifyNewOrder } = await import('@/lib/notify')
    await notifyNewOrder(order.id)
    return NextResponse.json(order, { status: 201 })
  } catch (e: any) {
    const { notifyError } = await import('@/lib/notify')
    await notifyError('Order creation failed', e?.message || 'Unknown error')
    throw e
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as any)?.role === 'CUSTOMER') return new NextResponse('Forbidden', { status: 403 })
  const json = await req.json()
  const { id, status, assignedToId } = json
  const updated = await prisma.order.update({ where: { id }, data: { status, assignedToId } })
  return NextResponse.json(updated)
}
