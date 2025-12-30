import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const { items } = await req.json()
  if (!Array.isArray(items) || items.length === 0) return new NextResponse('Bad Request', { status: 400 })

  const line_items = [] as any[]
  for (const it of items) {
    const mi = await prisma.menuItem.findUnique({ where: { id: it.menuItemId } })
    if (!mi) continue
    line_items.push({
      quantity: it.quantity,
      price_data: {
        currency: 'usd',
        product_data: { name: mi.name },
        unit_amount: Math.round(Number(mi.price) * 100)
      }
    })
  }

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${process.env.APP_URL}/checkout/success`,
      cancel_url: `${process.env.APP_URL}/cart`
    })
    return NextResponse.json({ url: checkout.url })
  } catch (e: any) {
    const { notifyError } = await import('@/lib/notify')
    await notifyError('Checkout session failed', e?.message || 'Stripe error', { code: e?.code })
    return new NextResponse('Stripe error', { status: 500 })
  }
}
